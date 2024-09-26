import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { fetchAddConversation } from '@/hooks/useAccount'
import {
  MessageType,
  useConversationDetail,
  useConversationRead
} from '@/hooks/useConversation'
import { useMessage, useMessageCreate } from '@/hooks/useMessage'
import { PUB_CONVERSATION_REFRESH, PUB_SENDMESSAGE, PUB_SUBSCRIBE_MESSAGE, PUB_UPDATE_GROUP } from '@/utils/stants'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import { head } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AppState, DeviceEventEmitter,
  TextInput,
  TouchableOpacity
} from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { Appbar, Icon } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import tw from 'twrnc'
import { get } from "lodash"
import useUserStore from '../store/useUser'
import { getAvatarUrl, showToast } from '@/utils/utils'

export default function conversationId() {
	const route = useLocalSearchParams()
	const insets = useSafeAreaInsets()
	const { setOptions } = useNavigation()
	const router = useRouter()
	const [messages, setMessages] = useState<any[]>([])
	const [message, setMessage] = useState<string>('')
	const { runAsync } = useMessage()
	const { runAsync: sendMessage } = useMessageCreate()
	const { run, data: conversation } = useConversationDetail()
	const { runAsync: readSync } = useConversationRead()
	const { user } = useUserStore()
	const [appState, setAppState] = useState(AppState.currentState)

	useEffect(() => {
		setOptions({ headerShown: false })
	}, [])

	useEffect(() => {
		run({id:(route.conversationId as string)})
	}, [route.conversationId])

	useEffect(() => {
		getMessages(1)
		read()
		const appstate = AppState.addEventListener('change',handleAppStateChange)
		return () => {
			read()
			appstate.remove()
		}
	}, [])

  useEffect(()=>{
    if(!conversation?.data._id) return
    const eventListener = DeviceEventEmitter.addListener(PUB_SUBSCRIBE_MESSAGE, receiveMessage)
    return () => {
      eventListener.remove()
    }
  },[conversation?.data._id])

  useEffect(()=>{
    if(!conversation?.data._id) return
    const eventListener = DeviceEventEmitter.addListener(PUB_UPDATE_GROUP, updateConversation)
    return () => {
      eventListener.remove()
    }
  },[conversation?.data._id])

  const updateConversation = ()=>{
    run({id:(route.conversationId as string)})
  }


  const receiveMessage = (message:MessageType)=>{
    if(message.conversationId === conversation?.data._id){
      onSend([{
        _id: message._id,
        text: message.body,
        createdAt: message.createdAt,
        system: Boolean(message.system),
        user: {
          _id: message.senderId[0]?._id!,
          name: message.senderId[0]?.name,
          avatar: getAvatarUrl(message.senderId[0]?.avatar),
        },
      }])
    }
  }
  

	const read = async () => {
		const res = await readSync({
			conversationId:(route.conversationId as string),
		})
		// console.log("消息已读",res)
		DeviceEventEmitter.emit(PUB_CONVERSATION_REFRESH)
		return res
	}

	// 监听应用状态变化的函数
	const handleAppStateChange = (nextAppState: any) => {
		if (
			appState.match(/inactive|background/) &&
			nextAppState === 'active'
		) {
			// console.log('应用从后台切换到前台');
		} else if (nextAppState.match(/inactive|background/)) {
			console.log('应用正在进入后台message')
			read()
			// 在这里执行需要在应用切换到后台时进行的操作
		}
		setAppState(nextAppState)
	}

	const back = async () => {
		read()
		router.dismiss(1)
	}

  const handlerGroupDetail = useCallback(()=>{
    router.push(`/group-setting/${(route.conversationId as string)}`)
  },[route.conversationId])

	const getMessages = async (page: number) => {
		const res = await runAsync({
			conversationId:(route.conversationId as string),
			page,
		})
		if (res.code === 200) {
			const data = res.data.list.map((v) => ({
				_id: v._id,
				text: v.body,
				createdAt: v.createdAt,
				user: {
					_id: v.senderId[0]?._id!,
					name: v.senderId[0]?.name,
					avatar: getAvatarUrl(v.senderId[0]?.avatar)
				},
			}))
      if(page === 1){
        setMessages(data)
      }else{
        setMessages((previousMessages)=>
          GiftedChat.prepend(previousMessages, data)
          )
      }
		}
	}

	const onSend = useCallback((messages: IMessage[] = []) => {
		setMessages((previousMessages) =>
			GiftedChat.append(previousMessages, messages)
		)
		setMessage('')
	}, [])

	// 如果是群聊，则接收者id为群聊id，否则为接收者id
	const receiverId = useMemo(() => {
		if (conversation?.data.isGroup) return conversation.data._id
		return head(
			conversation?.data.participants.filter((v) => v._id !== user?._id)
		)?._id!
	}, [conversation?.data._id])

  // 如果时群聊则返回会话名称否则返回对方名称
  const name = useMemo(() => {
		if (conversation?.data.isGroup) return conversation.data.name
		return head(
			conversation?.data.participants.filter((v) => v._id !== user?._id)
		)?.name!
	}, [conversation?.data._id,conversation?.data.name])

	const costumSend = async () => {
		if (!message) return
		const res = await sendMessage({
			body: message,
			conversationId:
				typeof route.conversationId == 'string'
					? route.conversationId
					: route.conversationId[0],
			senderId: user?._id!,
			receiverId: receiverId,
			image: '',
		})
		onSend([
			{
				_id: res.data._id,
				text: message,
				createdAt: res.data.createdAt,
				user: {
					_id: user?._id!,
					name: user?.name,
					avatar: user?.avatar,
				},
			},
		])

    // 聊天成员中添加此会话
    await fetchAddConversation({
      conversationId:typeof route.conversationId == 'string'
      ? route.conversationId
      : route.conversationId[0],
      participants:conversation?.data.participants.map((s)=>s._id) || []
    })


    DeviceEventEmitter.emit(PUB_SENDMESSAGE,{
      participants:conversation?.data.participants.filter((v)=>v._id !== user?._id).map((s)=>s._id),
      message:res.data
    })
	}

	return (
		<ThemedView style={tw`bg-white flex-1`}>
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
					title={ name || " "}
					titleStyle={tw`text-base text-black`}
				/>
				<Appbar.Action
					iconColor={'black'}
					icon="dots-vertical"
          style={tw.style({hidden:!conversation?.data.isGroup})}
					onPress={handlerGroupDetail}
				/>
			</Appbar.Header>
			<ThemedView style={tw`flex-1`}>
				<GiftedChat
					messages={messages}
					placeholder={'说点什么吧...'}
					alwaysShowSend={true}
					showUserAvatar={true}
					showAvatarForEveryMessage={false}
					renderAvatarOnTop={true}
					locale={require('dayjs/locale/zh-cn')}
					renderInputToolbar={(props) => (
						<ThemedView
							style={[
								tw`p-1 bg-slate-100 flex flex-row items-center gap-2 px-2`,
								{
									paddingBottom: insets.bottom + 10,
								},
							]}
						>
							<TouchableOpacity onPress={()=> showToast("暂未开放")}>
								<Icon
									source="plus-circle-outline"
									color={Colors.light.tint}
									size={24}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=> showToast("暂未开放")}>
								<Icon
									source="emoticon"
									color={Colors.light.tint}
									size={24}
								/>
							</TouchableOpacity>
							<TextInput
								style={tw`flex-1 p-2 px-4 bg-white rounded-full`}
								value={message}
								maxLength={200}
								onChangeText={setMessage}
								placeholderTextColor={Colors.light.icon}
								placeholder="说点什么吧..."
							/>

							<TouchableOpacity onPress={costumSend}>
								<Icon
									source="send"
									color={Colors.light.tint}
									size={24}
								/>
							</TouchableOpacity>
						</ThemedView>
					)}
					infiniteScroll={true}
					// loadEarlier={true}
					// renderLoadEarlier={()=><Text>加载更多</Text>}
					onLoadEarlier={() => console.log('load')}
					user={{
						_id: user?._id!,
						name: user?.name,
						avatar: user?.avatar,
					}}
				/>
			</ThemedView>
		</ThemedView>
	)
}
