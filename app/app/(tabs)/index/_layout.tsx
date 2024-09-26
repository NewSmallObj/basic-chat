import { ThemedView } from '@/components/ThemedView'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import tw from 'twrnc'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Shadow } from 'react-native-shadow-2'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessageScreen from '.'
import { NavigationProp } from '@react-navigation/native'
import ContactsSceen from './contacts'
import { showToast } from '@/utils/utils'

const Stack = createNativeStackNavigator();

export default function TabsViewLayoutScreen({ navigation }: { navigation: NavigationProp<any> }) {
	const [index, setIndex] = useState(0)
	const insets = useSafeAreaInsets()

  const handler = (index:number)=>{
    setIndex(index)
    navigation.navigate(index === 0? 'Message':'Contact')
  }

	return (
		<PaperProvider>
			<View style={[tw`flex-col bg-slate-100 pb-2`]}>
				<Shadow
					distance={5}
					style={[tw`w-full bg-white`, { paddingTop: insets.top }]}
					paintInside={true}
					startColor={'#00000010'}
					endColor={'#00000000'}
					offset={[0, 1]}
				>
					<View style={[tw`flex-row bg-white`]}>
						<TouchableOpacity
							style={[tw`relative px-4`,{boxSizing:'border-box'}]}
							onPress={() => handler(0)}
						>
							<Text
								style={tw.style(`font-bold py-4`, {
									'text-slate-500': index === 1,
									'text-slate-800': index === 0,
								})}
							>
								消息
							</Text>
							<View
								style={tw.style(
									`absolute bottom-0 w-8 h-1 rounded bg-slate-800 left-4`,
									{ hidden: index === 1 }
								)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={tw`relative px-4`}
							onPress={() => handler(1)}
						>
							<Text
								style={tw.style(`font-bold py-4`, {
									'text-slate-500': index === 0,
									'text-slate-800': index === 1,
								})}
							>
								联系人
							</Text>
							<View
								style={tw.style(
									`absolute bottom-0 w-8 h-1 rounded bg-slate-800 left-4`,
									{ hidden: index === 0 }
								)}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={tw.style(`relative px-4 pt-3 flex-1 flex-row justify-end`,{
                'hidden': index === 0
              })}
							onPress={() => {
                showToast("暂未开放")
              }}
						>
							<AntDesign name="adduser" size={22} color="black" />
						</TouchableOpacity>
					</View>
				</Shadow>
			</View>

      <Stack.Navigator initialRouteName='Message'>
        <Stack.Screen name="Message" component={ MessageScreen } options={{ headerShown: false }} />
        <Stack.Screen name="Contact" component={ ContactsSceen } options={{ headerShown: false }} />
      </Stack.Navigator>
      
		</PaperProvider>
	)
}
