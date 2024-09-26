import {
  DeviceEventEmitter,
	Image,
	KeyboardAvoidingView,
	Platform,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import tw from 'twrnc'
import { Stack, useRouter } from 'expo-router'
import { Button } from 'react-native-paper'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Input } from '@rneui/themed'
import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar'

import { useLogin } from '@/hooks/useAccount'
import { getAvatarUrl, showToast } from '@/utils/utils'
import { setToken } from '@/utils/storage'
import useUserStore from './store/useUser'
import { BASE_URL, PUB_CONNECT_SCOKET } from '@/utils/stants'

export default function LoginScreen() {
	const router = useRouter()
	const inputRef = useRef(null)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('123456')
	const { setUser } = useUserStore()
	const { runAsync } = useLogin()

	const handleLogin = async () => {
		if (!username || !password) return showToast('请输入用户名和密码')
		const res = await runAsync({ username, password })

		await setToken(res.data.token)
    
		await setUser({...res.data.user,avatar: getAvatarUrl(res.data.user.avatar)})
		setTimeout(() => {
      DeviceEventEmitter.emit(PUB_CONNECT_SCOKET)
      router.replace('/(tabs)')
    }, 100);
	}

	const handlerRegister = async () => {
		router.push('/register')
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={[
				tw`flex-1 w-full justify-center items-center`,
				{ backgroundColor: '#059669' },
			]}
		>
			<StatusBar style="dark" />
			<Stack.Screen options={{ headerShown: false }} />
			<View>
				<View style={tw`bg-white rounded-full relative`}>
					<Image
						source={require('@/assets/images/logo.png')}
						style={tw`w-25 h-25`}
						loadingIndicatorSource={require('@/assets/images/react-logo.png')}
					/>
				</View>
				<Text style={tw`text-white text-center text-xl mt-4`}>
					欢迎回来
				</Text>
			</View>
			<View style={tw`w-80 mt-10`}>
				<Input
					ref={inputRef}
					style={[
						tw`text-black`,
						{
							fontSize: 16,
						},
					]}
					leftIcon={<AntDesign name="user" size={16} color="black" />}
					value={username}
					inputContainerStyle={{
						borderBottomColor: 'transparent',
						backgroundColor: '#fff',
						borderRadius: 30,
						paddingLeft: 20,
						paddingRight: 20,
					}}
					onChangeText={(text) => setUsername(text)}
					placeholder="请输入用户名"
				/>
				<Input
					style={[
						tw`text-black`,
						{
							fontSize: 16,
						},
					]}
					secureTextEntry={true}
					leftIcon={<AntDesign name="lock" size={16} color="black" />}
					inputContainerStyle={{
						borderBottomColor: 'transparent',
						backgroundColor: '#fff',
						borderRadius: 30,
						paddingLeft: 20,
						paddingRight: 20,
					}}
					value={password}
					onChangeText={(text) => setPassword(text)}
					placeholder="请输入密码"
				/>
			</View>
			<View style={[tw`flex justify-center items-center`]}>
				<TouchableOpacity>
					<Button
						style={[tw`mt-10 w-36`, { backgroundColor: '#047857' }]}
						mode={'contained'}
						labelStyle={tw`text-white text-base`}
						onPress={handleLogin}
					>
						登录
						<AntDesign name="logout" size={12} color="white" />
					</Button>
				</TouchableOpacity>
				<TouchableOpacity style={[tw`p-3`]} onPress={handlerRegister}>
					<Text style={tw`text-white`}>注册</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	)
}
