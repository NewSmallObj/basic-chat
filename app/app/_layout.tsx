import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import 'react-native-reanimated'
import { useColorScheme } from '@/hooks/useColorScheme'
import { StatusBar } from 'expo-status-bar'
import { RootSiblingParent } from 'react-native-root-siblings'
import { getToken } from '@/utils/storage'
import { Socket, io } from 'socket.io-client'
import { showToast } from '@/utils/utils'
import { DeviceEventEmitter } from 'react-native'
import { MessageType } from '@/hooks/useConversation'
import {
  PUB_CONNECT_SCOKET,
	PUB_DISCONNECT,
	PUB_SENDMESSAGE,
	PUB_SUBSCRIBE_MESSAGE,
	WS_URL,
} from '@/utils/stants'
import useConversationStore from './store/useConversation'
import { cloneDeep } from 'lodash'

SplashScreen.preventAutoHideAsync()

type sendType = { participants: string[]; message: MessageType }

export default function RootLayout() {
	const colorScheme = useColorScheme()
	const router = useRouter()
	const [socket, setSocket] = useState<Socket>()
	const { addConversationMessage } = useConversationStore()

	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	})

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
      init()
		}
	}, [loaded])

	const init = () => {
		getToken().then((token) => {
			if (!token) {
				router.replace('/login')
			} else {
				// 如果当前连接保持通畅则不再连接
				console.log('socket是否连接', socket?.connected)
				if (socket && socket.connected) return
				const skt = io(WS_URL, {
					transports: ['websocket'],
					auth: { token },
				})
				setSocket(skt)
			}
		})
	}

	const connectws = () => {
    if(!socket || socket?.connected) return console.log("socket未初始化")
		socket.on('message', (message: string) => {
			if (message === 'tokenRrror') {
				showToast('登录失效')
				router.replace('/login')
			} else if (message === 'RepeatLogin') {
				showToast('账号已在其他设备登录')
				// router.replace('/login')
			} else {
				// console.log("message",message);
				// 广播数据
        // showToast(message)
			}
		})

		socket.on('response', responentMessage)

		socket.on('connect', () => {
			console.log('connect')
		})
		socket.on('disconnect', (message: string) => {
			console.log('关闭连接', message)
		})
		socket.on('error', (error) => {
			console.log('error', error)
		})

    socket.connect()
	}

	const responentMessage = (message: sendType) => {
    console.log('接收到消息', message)
		DeviceEventEmitter.emit(PUB_SUBSCRIBE_MESSAGE, message.message)
    if(!message.message.system){
      addConversationMessage(message.message)
    }
	}

	const disconnect = () => {
		console.log('disconnect')
		socket?.disconnect()
	}

	const sendMessage = (message: sendType) => {
		socket?.emit('message', message)
	}

  useEffect(() => {
    const eventListener = DeviceEventEmitter.addListener(
      PUB_CONNECT_SCOKET,
      ()=>init()
    )
    return () => eventListener.remove()
  }, [])


	useEffect(() => {
    if(socket && !socket.connected) connectws()
		const eventListener = DeviceEventEmitter.addListener(
			PUB_SENDMESSAGE,
			(message: sendType) => sendMessage(message)
		)
		const eventListener2 = DeviceEventEmitter.addListener(
			PUB_DISCONNECT,
			() => disconnect()
		)
		return () => {
			eventListener.remove()
			eventListener2.remove()
		}
	}, [socket,socket?.connected])

	if (!loaded) {
		return null
	}

	return (
		<ThemeProvider
			value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<RootSiblingParent>
				{/*<SafeAreaProvider>*/}
				<StatusBar style="dark" />
				<Stack>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>
					{/* <Stack.Screen
						name="contacts"
						options={{ headerShown: false }}
					/> */}
					<Stack.Screen
						name="messages/[conversationId]"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="login"
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="register"
						options={{ headerShown: false }}
					/>
          <Stack.Screen
						name="group"
						options={{ headerShown: false }}
					/>
          <Stack.Screen
						name="setting"
						options={{ headerShown: false }}
					/>
          <Stack.Screen
						name="group-setting/[groupId]"
						options={{ headerShown: false }}
					/>
					<Stack.Screen name="+not-found" />
				</Stack>
			</RootSiblingParent>
		</ThemeProvider>
	)
}
