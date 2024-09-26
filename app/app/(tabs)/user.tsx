import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import type { DrawerNavigationProp } from '@react-navigation/drawer'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { get } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import {
  Dimensions,
  ImageBackground,
  RefreshControl,
  ScrollView,
  View
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar, Divider } from 'react-native-paper'
import Toast from 'react-native-root-toast'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import tw from 'twrnc'
import useUserStore from '../store/useUser'
export default function UserScreen({
	navigation,
}: {
	navigation: DrawerNavigationProp<any>
}) {
	const insets = useSafeAreaInsets()
	const [refreshing, setRefreshing] = useState(false)
	const scrollViewRef = useRef(null)
	const [scorllTop, setScrollTop] = useState(0)
	const { user } = useUserStore()
  const router = useRouter()

	const handleLeftPress = () => {
		navigation.openDrawer()
	}
  
  const handleRightPress = ()=>{
    router.push('/setting')
  }

	const show = useMemo(() => {
		return scorllTop < 340
	}, [scorllTop])

	const onRefresh = () => {
		setRefreshing(false)
		Toast.show('onRefresh', {
			position: Toast.positions.TOP,
			shadow: true,
			animation: true,
			hideOnPress: true,
			delay: 0,
			duration: Toast.durations.LONG,
		})
	}

	return (
		<View style={tw`flex-1 bg-slate-100`}>
			<ScrollView
				style={{ flex: 1 }}
				onScroll={(e) => setScrollTop(e.nativeEvent.contentOffset.y)}
				ref={scrollViewRef}
				scrollEventThrottle={1}
				stickyHeaderIndices={[1]}
				refreshControl={
					// 下拉刷新功能
					<RefreshControl
						style={{ backgroundColor: 'transparent' }}
						tintColor={'white'}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				<View>
					<ImageBackground
						style={{
							width: Dimensions.get('screen').width,
							height: 340,
							position: 'relative',
              backgroundColor: '#0c4a6e',
						}}
						source={{
							uri: get(user, 'image', 'null'),
						}}
					>
						<View
							style={[
								tw`flex-row items-center justify-between px-4 w-full`,
								{
									position: 'absolute',
									top: 20 + insets.top,
								},
							]}
						>
							<TouchableOpacity onPress={handleLeftPress}>
								<Feather name="menu" size={24} color="white" />
							</TouchableOpacity>
              <TouchableOpacity onPress={handleRightPress}>
              <AntDesign name="setting" size={24} color="white" />
							</TouchableOpacity>
						</View>
						<ThemedView
							style={{
								paddingBottom: 10,
								paddingTop: 20,
								width: '100%',
								position: 'absolute',
								bottom: 0,
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								backgroundColor: '#fff',
							}}
						>
							<ThemedView
								style={[
									tw` items-center justify-center px-4 gap-2`,
								]}
							>
								<Avatar.Image
									size={80}
                  style={tw.style({ hidden: !Boolean(user?.avatar)})}
									source={{
										uri: get(user,'avatar','null'),
									}}
								/>
                <Avatar.Text style={tw.style({ hidden: Boolean(user?.avatar)})} size={80} label={user?.name?.slice(0, 1)!} />
								<ThemedView style={tw`flex-1`}>
									<ThemedText
										style={tw`text-lg text-center`}
										numberOfLines={1}
									>
										{user?.name}
									</ThemedText>
									<ThemedText
										style={tw`text-sm w-full text-center text-slate-500`}
										numberOfLines={2}
									>
										{user?.remark}
									</ThemedText>
								</ThemedView>
							</ThemedView>
							<ThemedView
								style={tw`flex flex-row items-center justify-center mt-4 px-4 gap-2`}
							>
								<ThemedView style={tw`w-16`}>
                  <ThemedText style={tw`font-bold text-center`}>
										1000
									</ThemedText>
									<ThemedText
										style={tw`text-sm text-slate-500 text-center`}
									>
										关注
									</ThemedText>
								
								</ThemedView>
                <Divider style={{width:1,height:20}} horizontalInset={false} />
								<ThemedView style={tw`w-16`}>
                  <ThemedText style={tw`font-bold text-center`}>
										1000
									</ThemedText>
									<ThemedText
										style={tw`text-sm text-slate-500 text-center`}
									>
										粉丝
									</ThemedText>
									
								</ThemedView>
							</ThemedView>
						</ThemedView>
					</ImageBackground>
				</View>

				<LinearGradient
					colors={['#059669', '#059669']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={[
						{ width: '100%', height: 50 + insets.top },
						tw.style({ hidden: show }),
					]}
				>
					<View
						style={[
							tw`w-full h-full justify-center flex flex-row`,
							{ paddingTop: insets.top },
						]}
					>
						<Avatar.Image
							size={40}
              style={tw.style({ hidden: !Boolean(user?.avatar)})}
							source={{
								uri: user?.avatar,
							}}
						/>
            <Avatar.Text style={tw.style({ hidden: Boolean(user?.avatar)})} size={40} label={user?.name?.slice(0, 1)!} />
					</View>
				</LinearGradient>

				{/*底部内容 */}
				{/* {
				   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => {
				       return (<View key={item} style={{ height: 100 }}><Text>底部内容{index}</Text></View>)
				   })
				} */}
			</ScrollView>
		</View>
	)
}
