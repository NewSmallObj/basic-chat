import { Colors } from '@/constants/Colors'
import { UserType } from '@/hooks/useAccount'
import { useContacts } from '@/hooks/useContacts'
import { ConersationType, useGroupConversation, useGroupConversationCreate } from '@/hooks/useGroup'
import { CACHE_GROUP_CONVERSATION } from '@/utils/stants'
import { getAvatarUrl, showToast } from '@/utils/utils'
import Feather from '@expo/vector-icons/Feather'
import BottomSheet, { BottomSheetFlatList, BottomSheetFooter, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { clearCache } from 'ahooks'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  RefreshControl, Text, TouchableOpacity, View
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Appbar, Avatar, Button } from 'react-native-paper'
import { SwipeListView } from 'react-native-swipe-list-view'
import tw from 'twrnc'
import useUserStore from './store/useUser'

export default function GroupScreen() {
	const router = useRouter()

	const sheetRef = useRef<BottomSheet>(null)
	const snapPoints = useMemo(() => ["25%", "50%", "90%"], [])
  const [index,setIndex] = useState(-1)
  const { data } = useContacts();
  const { data:groupList,refresh } = useGroupConversation()
  const { runAsync } = useGroupConversationCreate()
  const [checkeds,setChecked] = useState<string[]>([])
  const {user} = useUserStore()

	const handleSheetChange = useCallback((index: any) => {
    setIndex(index)
	}, [])
  
	const handleSnapPress = useCallback((index: any) => {
		sheetRef.current?.snapToIndex(index)
	}, [])
  
	const handleClosePress = useCallback(() => {
		sheetRef.current?.close()
	}, [])

  const handler = useCallback(()=>{
    if(index >= 0){
      handleClosePress()
    }else{
      handleSnapPress(1)
    }
  },[index])

	const back = async () => {
		router.dismiss(1)
	}

	const startActivity = (item:ConersationType) => {
    handleClosePress()
    router.replace(`/messages/${item._id}`)
  }

	const onRefresh = () => {
    clearCache(CACHE_GROUP_CONVERSATION)
		refresh()
	}

  const handlerItemChange = (item: UserType)=>{
    checkeds.includes(item._id) ? setChecked(checkeds.filter(i=>i !== item._id)) : setChecked([...checkeds,item._id])
  }
  

  const list = useMemo(() =>{
      if(!data?.data) return []
      return data?.data.map(item=>{
        return {
          ...item,
          checked: false
        }
      })
    },[data]);
    
  const handlerCreate = async ()=>{
    if(checkeds.length < 3) return showToast('请选择至少3个联系人');
    const items = list.filter((item)=>checkeds.includes(item._id!)).map((v)=>v.name)
    const res = await runAsync({
      name: [...items,user.name].join('、').slice(0,20),
      participantsIds: [...checkeds,user._id].join(',')
    })
    if(res.code === 200){
      showToast('创建成功')
      refresh()
      handleClosePress()
      setIndex(-1)
    }
  }


  const renderFooter = useCallback((props:any) => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <View style={tw`p-4 w-full bg-white`}>
          <Button icon="chat-plus-outline" buttonColor={Colors.light.tint} mode="contained" onPress={handlerCreate}>
            创建群聊
          </Button>
        </View>
      </BottomSheetFooter>
    ),
    [checkeds,user,sheetRef.current]
  );

	return (
		<GestureHandlerRootView>
			<View style={tw`flex-1 bg-slate-100`}>
				<Appbar.Header
					style={[
						tw`bg-white relative z-50`,
						{
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 1 },
							shadowOpacity: 0.1,
							shadowRadius: 0,
						},
					]}
				>
					<Appbar.BackAction size={18} onPress={back} />
					<Appbar.Content
						title="群聊"
						titleStyle={tw`text-base text-black`}
					/>
					<Appbar.Action
						iconColor={'black'}
						icon="chat-plus-outline"
						onPress={handler}
					/>
				</Appbar.Header>

				<SwipeListView
          style={tw`mt-2`}
					data={groupList?.data || []}
					refreshControl={
						<RefreshControl
							refreshing={false}
							onRefresh={onRefresh}
						/>
					}
					renderItem={(data, rowMap) => (
						<View
							style={tw`mb-1 flex-row items-center gap-2 bg-white py-4 px-2 border-b border-slate-100 border-solid`}
						>
							<View>
              <Avatar.Image
                  size={40}
                  style={tw.style({backgroundColor: Colors.light.slate})}
                  source={
                    !data.item?.image ? require('@/assets/images/group.png'): { uri: getAvatarUrl(data.item?.image) }}
                />
                {/* <Avatar.Text style={tw.style({ hidden: Boolean(data.item.image)},{backgroundColor: Colors.light.tint})} 
                size={40} label={data.item.name?.slice(0, 1)!} /> */}
							</View>
							<TouchableOpacity
								style={tw`flex-1`}
								onPress={()=>startActivity(data.item)}
							>
								<Text
									style={tw.style(
										`leading-6 text-[4] min-h-4`
									)}
									numberOfLines={1}
								>
									{ data.item.name }
								</Text>
							</TouchableOpacity>
						</View>
					)}
				/>

				<BottomSheet
					ref={sheetRef}
					snapPoints={snapPoints}
          detached={true}
          index={index}
					onChange={handleSheetChange}
          footerComponent={renderFooter}
				>
          <BottomSheetTextInput 
            placeholder='请输入关键词...'
            style={{ 
            margin:10,
            borderRadius: 99,
            fontSize: 16,
            lineHeight: 20,
            padding: 8,
            backgroundColor: 'rgba(151, 151, 151, 0.10)',
           }} />
					<BottomSheetFlatList
            style={tw`pb-10`}
            data={list}
            keyExtractor={(item) => item._id}
            renderItem={({item})=>(
              <Items item={item} checkeds={checkeds} onChange={handlerItemChange} />
            )}
            contentContainerStyle={{
              backgroundColor: "white",
            }}
          />
				</BottomSheet>
			</View>
		</GestureHandlerRootView>
	)
}



const Items = ({item,checkeds,onChange}:{item:UserType,checkeds:string[],onChange:(item:UserType)=>void})=>{
  
  return (
    <View
        style={tw`mb-1 flex-row items-center gap-2 bg-white py-2 px-4 border-b border-slate-100 border-solid`}
      >
        <View>
          <Avatar.Image
            size={40}
            style={tw.style({ hidden: !Boolean(item.avatar)},{backgroundColor: Colors.light.tint})}
            source={{
              uri: getAvatarUrl(item?.avatar)
            }}
          />
          <Avatar.Text style={tw.style({ hidden: Boolean(item.avatar)},{backgroundColor: Colors.light.tint})} 
          size={40} label={item.name?.slice(0, 1)!} />
        </View>
        <TouchableOpacity style={tw`flex-1`} onPress={()=>onChange(item)}>
          <Text
            style={tw.style(`leading-6 text-[4] min-h-4`)}
            numberOfLines={1}
          >
            { item.name }
          </Text>
        </TouchableOpacity>
        <Feather style={tw.style({
          opacity:checkeds.includes(item._id) ? 1 : 0
        })} name="check" size={18} color={Colors.light.tint} />
      </View>
  )
}