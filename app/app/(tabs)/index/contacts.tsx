import useUserStore from '@/app/store/useUser'
import ConversationItem from '@/components/ConversationItem'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useContacts } from '@/hooks/useContacts'
import { useConversationCreate } from '@/hooks/useConversation'
import { showToast } from '@/utils/utils'
import { clearCache } from 'ahooks'
import { useRouter } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { Avatar } from 'react-native-paper';
import tw from 'twrnc'
import { useState } from 'react'
import { CACHE_CONTACTS } from '@/utils/stants'

export default function ContactsSceen() {
	const router = useRouter()
	const { user } = useUserStore()

	const { data, refresh } = useContacts()
	const { runAsync } = useConversationCreate()
	const hanlderUser = async (receiverId: string) => {
		const res = await runAsync({
			senderId: user._id!,
			receiverId: receiverId,
		})
		if (res.code === 200) {
			router.push(`/messages/${res.data._id}`)
		}
	}

	const onRefresh = () => {
		clearCache(CACHE_CONTACTS)
		refresh()
	}

  const startActivity = ()=>{
    router.push('/group')
  }

	return (
		<ThemedView style={tw`bg-white flex-1 bg-slate-100`}>
      
      <View
        style={tw`mb-1 flex-row items-center gap-2 bg-white py-2 px-2 border-b border-slate-100 border-solid`}
      >
        <View>
          <Avatar.Icon
            size={40}
            style={{backgroundColor: Colors.light.tint}}
            icon={'account-outline'}
          />
        </View>
        <TouchableOpacity style={tw`flex-1`} onPress={startActivity}>
          <Text
            style={tw.style(`leading-6 text-[4] min-h-4`)}
            numberOfLines={1}
          >
            群聊
          </Text>
        </TouchableOpacity>
      </View>


			<SwipeListView
				data={data?.data}
				refreshControl={
					<RefreshControl refreshing={false} onRefresh={onRefresh} />
				}
				renderItem={(data, rowMap) => (
					<ConversationItem
						_id={data.item._id}
						name={data.item.name}
						avatar={data.item.avatar}
					>
						<TouchableOpacity
							style={[
								tw`text-blue-600`,
								{
									borderColor: Colors.light.tint,
									color: Colors.light.tint,
									borderWidth: 1,
									borderRadius: 20,
									padding: 5,
									flexDirection: 'row',
									justifyContent: 'center',
                  backgroundColor: Colors.light.tint,
								},
							]}
							onPress={() => {
								hanlderUser(data.item._id)
							}}
						>
              <AntDesign name="message1" size={16} color="white" />
						</TouchableOpacity>
					</ConversationItem>
				)}
				renderHiddenItem={(data, rowMap) => (
					<View style={tw`flex-1 flex-row justify-end w-full`}>
						<TouchableOpacity
							style={[
								tw`bg-red-500 items-center justify-center`,
								{
									width: 75,
								},
							]}
							onPress={() => {
								showToast('不可删除')
							}}
						>
							<Text style={[tw`text-white`]}>删除</Text>
						</TouchableOpacity>
					</View>
				)}
				rightOpenValue={-75}
			/>
		</ThemedView>
	)
}
