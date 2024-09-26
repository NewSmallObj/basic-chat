import { useRequest } from 'ahooks';
import request from "@/utils/request"
import { showToast } from '@/utils/utils';
import { useRouter } from 'expo-router';
import { CACHE_USER_INFO } from '@/utils/stants';

type AccountType = { username: string, password: string }

export type UserType = {
  _id: string;
  conversationIds: string[];
  createdAt: string;
  name: string;
  remark: string;
  updatedAt: string;
  username: string;
  avatar?: string;
  image?: string;
}

const login = async (account: AccountType) => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: account,
  })
}

export const useLogin = () => {
  const { data, loading, refresh, run, params, runAsync } = useRequest(login, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    loadingDelay: 100,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
      showToast(res.msg)
    },
  });

  return {
    data,
    loading,
    params,
    refresh,
    run,
    runAsync
  }
}



type RegisterType = {
  username: string,
  password: string,
  name: string
}

const register = async (account: RegisterType) => {
  return request({
    url: '/user',
    method: 'POST',
    data: account,
  })
}

export const useRegister = () => {
  const { data, loading, refresh, run, params, runAsync } = useRequest(register, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    loadingDelay: 100,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
      showToast(res.msg)
    },
  });

  return {
    data,
    loading,
    params,
    refresh,
    run,
    runAsync
  }
}





const fetchUserinfo = async () => {
  return request({
    url: '/user/userinfo',
    method: 'get',
  })
}

export const useUserInfo = () => {
  const router = useRouter()
  const { data, loading, refresh, run, params, runAsync } = useRequest(fetchUserinfo, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    loadingDelay: 100,
    cacheKey: CACHE_USER_INFO,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
      // console.log('获取用户数据', res)
      if (res.code === 401) {
        router.dismissAll()
        router.replace('/login')
      }
    },
  });

  return {
    data,
    loading,
    params,
    refresh,
    run,
    runAsync
  }
}






type updateUserProps = {
  name?: string,
  remark?: string,
  avatar?: string
}
const fetchUpdateUser = async (data:updateUserProps) => {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

export const useUserUpdate = () => {
  const router = useRouter()
  const { data, loading, refresh, run, params, runAsync } = useRequest(fetchUpdateUser, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    loadingDelay: 100,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
      // console.log('获取用户数据', res)
      if (res.code === 401) {
        router.dismissAll()
        router.replace('/login')
      }
    },
  });

  return {
    data,
    loading,
    params,
    refresh,
    run,
    runAsync
  }
}



export const fetchAddConversation = async (data:{
  participants:string[]
  conversationId: string
}) => {
  return request({
    url: '/user/add_conversation',
    method: 'post',
    data
  })
}

function base64ToFile(base64String:any, fileName:any) {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}

export const uploadAvatar = async (file:any) => {
  const data  = new FormData();
  data.append('file', base64ToFile(file.uri,file.fileName));
  return request({
    url: '/uploads',
    method: 'post',
    data
  },{
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
