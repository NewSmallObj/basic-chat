import { Colors } from '@/constants/Colors'
import { UserType } from '@/hooks/useAccount'
import { ConersationType } from '@/hooks/useConversation'
import { formatRelativeTime, getAvatarUrl } from '@/utils/utils'
import { useRafInterval } from 'ahooks'
import { useRouter } from 'expo-router'
import React, { PropsWithChildren, useMemo, useState } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Badge, Avatar } from 'react-native-paper'
import tw from 'twrnc'

export default function ConversationItem(
	props: Partial<{
		name: string
		avatar: string
		lastMessage: string
		lastMessageAt: number | Date;
		_id: string
		canRouter: boolean
    isGroup:boolean
    num: number
	}> &
		PropsWithChildren
) {
	const router = useRouter()
  const [now,setNow] = useState(new Date())
	const showBadge = (unread?: number) => {
		if (unread && unread > 0) {
			return (
				<Badge
					visible={true}
					size={18}
					style={tw`absolute -top-1 -right-1 z-10 text-white bg-red-600`}
				>
					{unread}
				</Badge>
			)
		}
	}

  useRafInterval(()=>{
    setNow(new Date())
  },10000)

	const time = useMemo(() => {
		if (!props.lastMessageAt) return null
		return formatRelativeTime(props.lastMessageAt,now)
	}, [props.lastMessageAt,now])

	const startActivity = () => {
		if (props.canRouter) router.push(`/messages/${props._id}`)
	}

	return (
		<View
			style={tw`flex-1 flex-row items-center gap-2 bg-white py-4 px-2 border-b border-slate-100 border-solid`}
		>
			<View>
				<Avatar.Image
					size={40}
          style={tw.style({ hidden: !Boolean(props.avatar)},{backgroundColor: Colors.light.slate})}
					source={
           props.isGroup && props.avatar == 'public' ? require('@/assets/images/group.png'): {uri: getAvatarUrl(props?.avatar)}
          }
				/>
        <Avatar.Text style={tw.style({ hidden: Boolean(props.avatar)},{backgroundColor: Colors.light.tint})} 
        size={40} label={props.name?.slice(0, 1)!} />
				{showBadge(props.num)}
			</View>
			<TouchableOpacity style={tw`flex-1`} onPress={startActivity}>
				<Text
					style={tw.style(`leading-6 text-[4] min-h-4`)}
					numberOfLines={1}
				>
					{props.name}
				</Text>
				<Text
					style={tw.style(`text-gray-500 text-[3.2] leading-4`, {
						hidden: Boolean(!props.lastMessage),
					})}
					numberOfLines={1}
				>
					{props.lastMessage}
				</Text>
			</TouchableOpacity>
			<Text
				style={tw.style(`text-gray-500 text-[2]`, {
					hidden: !Boolean(time),
				})}
				numberOfLines={1}
			>
				{time}
			</Text>
			<View>{props.children}</View>
		</View>
	)
}
