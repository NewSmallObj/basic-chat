

import { Colors } from "@/constants/Colors";
import { uploadAvatar } from "@/hooks/useAccount";
import { useConversationDetail, useConversationUpdate } from "@/hooks/useConversation";
import { ConersationType } from "@/hooks/useGroup";
import { PUB_CONVERSATION_REFRESH, PUB_UPDATE_GROUP } from "@/utils/stants";
import { getAvatarUrl, showToast } from "@/utils/utils";
import { useDebounceFn, useSetState } from "ahooks";
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from "expo-router";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, TextInput, View } from "react-native";
import { Appbar, Avatar, Button, List } from 'react-native-paper';
import tw from "twrnc";
export default function SettingScreen() {
  const route = useLocalSearchParams()
  const router = useRouter()
  const [status, requestPermission]  = ImagePicker.useMediaLibraryPermissions()
  const [ image, setImage ] = useState('')
  const [state,setState] =  useSetState<Partial<ConersationType>>({})
  const { runAsync,loading } = useConversationUpdate()
  const { run, data: conversation } = useConversationDetail();

  useEffect(() => {
    run({id:(route.groupId as string)})
	}, [route.groupId])

  useEffect(()=>{
    setState({
      name:conversation?.data?.name || '',
    })
    if(conversation?.data.image){
      setImage(getAvatarUrl(conversation?.data.image!)!)
    }
  },[conversation?.data])

  const handlerSave = async (text:string)=>{
    setState({name:text})
    const {code,data} = await runAsync({name:text,id:conversation?.data._id!})
    if(code === 200){
      DeviceEventEmitter.emit(PUB_UPDATE_GROUP)
      DeviceEventEmitter.emit(PUB_CONVERSATION_REFRESH)
    }
  }

  const { run:runDeb } = useDebounceFn(handlerSave,
    {
      wait: 500,
    },
  );
  
  const back = () => {
    router.dismiss(1)
  }

  const chooseImage = async ()=>{
    
    if(status?.status == 'undetermined'){
      await requestPermission();
      return
    }
    if(status?.status == 'denied'){
      Linking.openSettings()
      return
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if(result && result.assets && !result.canceled){
      setImage(result?.assets[0].uri)
      const res = await uploadAvatar(result?.assets[0])
      await runAsync({id:conversation?.data._id!,image:res.data.fileName,...state})
      // setState({avatar:res.data._id})
    }
  }
  
  return (
    <View style={tw`flex-1 bg-slate-100 gap-1`}>
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
						title="群设置"
						titleStyle={tw`text-base text-black`}
					/>
				</Appbar.Header>

        <List.Item
          title=""
          style={tw`bg-white`}
          left={props => (<View style={tw`ml-3`}>
            <Avatar.Image
              size={40}
              style={tw.style({ hidden: !Boolean(conversation?.data.image) && !image})}
              source={{
                uri: image || get(conversation?.data,'image',image),
              }}
            />
            <Avatar.Image
              size={40}
              style={tw.style({ hidden: Boolean(conversation?.data.image) || Boolean(image)})}
              source={require('@/assets/images/group.png')}
            />
          </View>)}
          right={props => <List.Icon {...props} icon="circle-edit-outline" />}
          onPress={chooseImage}
        />
        
        <List.Item
          title="群名称"
          titleStyle={tw`text-base text-black w-24`}
          style={tw`bg-white`}
          right={props => <TextInput 
            value={ state.name || ''} 
            style={tw`text-base text-right text-black w-full`}
            onChangeText={(text) => runDeb(text)}
            /> }
        />
        <List.Item
          title="群成员"
          titleStyle={tw`text-base text-black w-24`}
          style={tw`bg-white`}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={()=>{
            showToast("暂未开放")
          }}
        />

        <List.Item
          title=""
          titleStyle={tw`text-base text-black w-24`}
          style={tw`bg-white mt-4`}
          description="退出群聊"
          descriptionStyle={tw`text-base text-rose-600 text-center`}
          onPress={()=>{
            showToast("暂未开放")
          }}
        />
    </View>
  );
}