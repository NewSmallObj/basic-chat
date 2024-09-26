import useConversationStore from '@/app/store/useConversation'
import useUserStore from '@/app/store/useUser'
import ConversationItem from '@/components/ConversationItem'
import { ThemedView } from '@/components/ThemedView'
import {
  ConersationType, useConversation,
  useConversationRemove
} from '@/hooks/useConversation'
import { PUB_CONVERSATION_REFRESH } from '@/utils/stants'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DeviceEventEmitter, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { SwipeListView } from 'react-native-swipe-list-view'
import tw from 'twrnc'

export default function MessageScreen() {
	const router = useRouter()
	const { runAsync } = useConversation()
  const { conversation,setConversation } = useConversationStore()
	const { runAsync: remove } = useConversationRemove()
	const [refreshing, setRefreshing] = useState(false)
	const { user } = useUserStore()
  const swipeListViewRef = useRef<SwipeListView<any>>(null)

	const onRefresh = () => {
		setRefreshing(true)
		getConversation()
	}

  useEffect(()=>{
    getConversation()
    const eventListener = DeviceEventEmitter.addListener(PUB_CONVERSATION_REFRESH, ()=>{
      console.log("触发监听方法获取用户数据")
      getConversation()
    })
    return ()=>{
      eventListener.remove()
    }
  },[])

  const getConversation = ()=>{
    runAsync().then((res)=>{
      setConversation([...res.data])
      setRefreshing(false)
    })
  }

  // 倒序
  const conversations = useMemo(()=>{
    if(!conversation.length) return []
    return conversation.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
  },[conversation])

	const onRemove = async (data: ConersationType) => {
		await remove({ id: data._id })
    getConversation()
    swipeListViewRef.current?.closeAllOpenRows()
	}

	const conversationProps = (data: ConersationType) => {
		if (!data.isGroup) {
			const other = data.participants.find(
				(item) => item._id !== user?._id
			)
			return {
				_id: data._id,
				name: other?.name,
				avatar: other?.avatar,
				lastMessage: data.lastMessage,
				lastMessageAt: data.lastMessageAt,
        num: data.messages.length
			}
		}else{
      return {
        _id: data._id,
        name: data.name,
        avatar: !data?.image? 'public' : data?.image,
        lastMessage:data.lastMessage,
        lastMessageAt: data.lastMessageAt,
        isGroup:true,
        num: data.messages.length
      }
    }
	}

	return (
		<PaperProvider>
			<View style={[tw`flex-1 gap-1 bg-slate-100`]}>
				<SwipeListView
          ref={swipeListViewRef}
					data={conversations}
          // closeOnRowOpen={true}
          keyExtractor={(item)=>item._id}
          disableLeftSwipe={false}
					renderItem={(row, rowMap) => (
						<ConversationItem
              key={row.item._id}
							canRouter
							{...conversationProps(row.item)}
						/>
					)}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					renderHiddenItem={(data, rowMap) => (
						<View key={data.item._id+data.index} style={tw`flex-1 flex-row justify-end w-full`}>
							<TouchableOpacity
								style={[
									tw`bg-red-500 items-center justify-center`,
									{
										width: 75,
									},
								]}
								onPress={() => {
                  onRemove(data.item)
                  // console.log(rowMap)
                  // rowMap.closeRow()
                }}
							>
								<Text style={[tw`text-white`]}>删除</Text>
							</TouchableOpacity>
						</View>
					)}
					rightOpenValue={-75}
				/>
			</View>
		</PaperProvider>
	)
}
