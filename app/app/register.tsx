import { ThemedView } from '@/components/ThemedView'
import { useRegister } from '@/hooks/useAccount'
import { showToast } from '@/utils/utils'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Input } from '@rneui/themed'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Appbar, Icon } from 'react-native-paper'
import React, { useRef, useState } from 'react'
import {
	KeyboardAvoidingView,
	Platform,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { Button } from 'react-native-paper'
import tw from 'twrnc'

export default function RegisterScreen() {
	const router = useRouter()
	const inputRef = useRef(null)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [nickname, setNickname] = useState('')
	const { runAsync } = useRegister()

	const handleRegister = async () => {
		if (!username) return showToast('请输入用户名和密码')
		if (!password) return showToast('请输入密码')
		if (!nickname) return showToast('请输入昵称')
		const res = await runAsync({ username, password,name:nickname })
    if(res.code === 200){
      showToast('注册成功')
      setUsername('')
      setPassword('')
      setNickname('')
    }
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
			<View>
				<Text style={tw`text-white text-center text-xl mt-4`}>
					注册
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
				<Input
					style={[
						tw`text-black`,
						{
							fontSize: 16,
						},
					]}
					leftIcon={
						<FontAwesome name="user-o" size={16} color="black" />
					}
					value={nickname}
					inputContainerStyle={{
						borderBottomColor: 'transparent',
						backgroundColor: '#fff',
						borderRadius: 30,
						paddingLeft: 20,
						paddingRight: 20,
					}}
					onChangeText={(text) => setNickname(text)}
					placeholder="请输入昵称"
				/>
			</View>
			<View style={[tw`flex justify-center items-center`]}>
				<TouchableOpacity>
					<Button
						style={[tw`mt-10 w-36`, { backgroundColor: '#047857' }]}
						mode={'contained'}
						labelStyle={tw`text-white text-base`}
						onPress={handleRegister}
					>
						提交
					</Button>
				</TouchableOpacity>
				<TouchableOpacity
					style={[tw`p-3`]}
					onPress={() => router.dismiss(1)}
				>
					<Text style={tw`text-white`}>返回</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	)
}
