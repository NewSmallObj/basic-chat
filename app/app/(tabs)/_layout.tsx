import { Colors } from '@/constants/Colors'
import { useUserInfo } from '@/hooks/useAccount'
import { useColorScheme } from '@/hooks/useColorScheme'
import { BASE_URL, PUB_DISCONNECT } from '@/utils/stants'
import { removeToken, setToken } from '@/utils/storage'
import Feather from '@expo/vector-icons/Feather'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { DrawerNavigationProp } from '@react-navigation/drawer'
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList } from '@react-navigation/drawer'
import { clearCache } from 'ahooks'
import { useRouter } from 'expo-router'
import React, { Fragment, useEffect, useMemo } from 'react'
import { DeviceEventEmitter, Dimensions, Text, TouchableOpacity } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import HomeScreen from './index'
import useConversationStore from '../store/useConversation'
import useUserStore from '../store/useUser'
import UserScreen from './user'
import TabsViewLayoutScreen from './index/_layout'
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import { getAvatarUrl } from '@/utils/utils'

const Tab = createBottomTabNavigator()
function TabLayout({ navigation }: { navigation: DrawerNavigationProp<any> }) {
	const colorScheme = useColorScheme()
	const router = useRouter()
	const { runAsync } = useUserInfo()
	const { user, setUser } = useUserStore()
  const { conversation } = useConversationStore()
	const getUserinfo = async () => {
		const res = await runAsync() 
		setUser({...res.data,avatar: getAvatarUrl(res.data.avatar)})
	}

	useEffect(() => {
		getUserinfo()
	}, [])

  const Badge = useMemo(()=>{
    if(!conversation) return undefined
    if(conversation.map((v)=>v.messages.length).length===0) return undefined
    return conversation.map((v)=>v.messages.length).reduce((prev,cur)=>prev+cur) || undefined
  },[conversation])

	return (
		<Fragment>
			<Tab.Navigator
				screenOptions={{
					tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
					headerShown: false,
					tabBarStyle: {
						backgroundColor:
							Colors[colorScheme ?? 'light'].background,
					},
				}}
			>
				<Tab.Screen
					name="index"
					component={TabsViewLayoutScreen}
					options={{
						title: '消息',
						tabBarIcon: ({ color, focused }) => (
							<Feather
								name="message-square"
								size={20}
								color={color}
							/>
						),
						tabBarIconStyle: {
							marginTop: 5,
						},
						tabBarLabelStyle: {
							marginBottom: 5,
						},
            tabBarBadge: Badge,
					}}
				/>
				<Tab.Screen
					name="user"
					component={UserScreen}
					options={{
						title: '我的',
						tabBarIcon: ({ color, focused }) => (
							// <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
							<Feather name="user" size={20} color={color} />
						),
						tabBarIconStyle: {
							marginTop: 5,
						},
						tabBarLabelStyle: {
							marginBottom: 5,
						},
					}}
				/>
			</Tab.Navigator>
		</Fragment>
	)
}

const Drawer = createDrawerNavigator()

export default function DrawerLayout() {
	const router = useRouter()
	const { user } = useUserStore()

	const logout = async () => {
    clearCache()
		useUserStore.setState({})
		await removeToken()
    DeviceEventEmitter.emit(PUB_DISCONNECT)
		router.replace('/login')
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer.Navigator
				screenOptions={{
					drawerStyle: {
						width: Dimensions.get('window').width * 0.5,
						backgroundColor: '#fff',
					},
					drawerPosition: 'left',
				}}
				initialRouteName="home"
        drawerContent={(props) => <DrawerContentScrollView {...props}>
          {/* <DrawerItemList {...props} /> */}
          <Menu.Item
            title="退出登录"
            onPress={logout}
            leadingIcon="logout"
          />
        </DrawerContentScrollView>}
			>
				<Drawer.Screen
					name="home"
					options={{
						headerShown: false,
						drawerLabel: () => null,
						drawerIcon: () => null,
						drawerActiveBackgroundColor: 'transparent',
					}}
					component={TabLayout}
				/>
				<Drawer.Screen
					name="login"
					options={{
						headerShown: false,
						// drawerLabel: () => (
						// 	<TouchableOpacity
						// 		style={{ padding: 10 }}
						// 		onPress={logout}
						// 	>
						// 		<Text>退出登录</Text>
						// 	</TouchableOpacity>
						// ),
						drawerIcon: () => null,
						drawerActiveBackgroundColor: 'transparent',
					}}
					component={LogOutScreen}
				/>
			</Drawer.Navigator>
		</GestureHandlerRootView>
	)
}

const LogOutScreen = () => <></>
