

import { useRouter } from "expo-router";
import { Text, TextInput, View } from "react-native";
import { Appbar, Avatar, Icon, List, Menu,Button } from 'react-native-paper'
import tw from "twrnc"
import { get } from "lodash";
import useUserStore from "./store/useUser";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { useEffect, useState } from "react";
import { uploadAvatar, useUserUpdate } from "@/hooks/useAccount";
import { useSetState } from "ahooks";
import { BASE_URL } from "@/utils/stants";
import { getAvatarUrl, showToast } from "@/utils/utils";

type PreUserType = {
  avatar: string;
  name: string;
  remark: string;
}

export default function SettingScreen() {

  const router = useRouter()
  const [status, requestPermission]  = ImagePicker.useMediaLibraryPermissions()
  const {user,setUser} = useUserStore();
  const [ image, setImage ] = useState('')
  const [state,setState] =  useSetState<Partial<PreUserType>>({})
  const { runAsync,loading } = useUserUpdate()

  useEffect(()=>{
    setState({
      name:user?.name || '',
      remark:user?.remark || '',
    })
  },[user.name,user.remark])

  const handlerSave = async ()=>{
    const value = {...state,id:user._id};
    const {code,data} = await runAsync(value)
    if(code === 200){
      showToast('保存成功') 
      setUser({...data, avatar: getAvatarUrl(data.avatar)})
    }
  }
  
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
      setState({avatar:res.data._id})
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
						title="设置"
						titleStyle={tw`text-base text-black`}
					/>
				</Appbar.Header>

        <List.Item
          title=""
          style={tw`bg-white`}
          left={props => (<View style={tw`ml-3`}>
            <Avatar.Image
              size={40}
              style={tw.style({ hidden: !Boolean(user?.avatar) && !image})}
              source={{
                uri: image || get(user,'avatar',image),
              }}
            />
            <Avatar.Text style={tw.style({ hidden: Boolean(user?.avatar) || Boolean(image)})} size={40} label={user?.name?.slice(0, 1)!} />
          </View>)}
          right={props => <List.Icon {...props} icon="circle-edit-outline" />}
          onPress={chooseImage}
        />
        
        <List.Item
          title="昵称"
          titleStyle={tw`text-base text-black w-24`}
          style={tw`bg-white`}
          right={props => <TextInput 
            value={ state.name || ''} 
            style={tw`text-base text-right text-black w-full`}
            onChangeText={(text) => setState({name:text})}
            /> }
        />

        <List.Item
          title="个性签名"
          contentStyle={tw`items-start`}
          titleStyle={tw`text-base text-black w-24`}
          style={[tw`bg-white items-start`,{alignItems:'flex-start'}]}
          right={props => <TextInput 
              multiline={true} 
              numberOfLines={3} 
              maxLength={200} 
              value={state.remark || ''} 
              onChangeText={(text) => setState({remark:text})}
              style={[tw`text-base text-left text-black`,{
                flex:4
              }]} /> }
        />

      <Button 
        icon="content-save-check-outline"  
        mode="contained"
        style={[tw`w-1/2 m-auto mt-4`,{backgroundColor: Colors.light.tint}]} 
        loading={loading}
        onPress={handlerSave}>
        保存
      </Button>
    </View>
  );
}