import request from "@/utils/request";
import { CACHE_CONVERSATION } from "@/utils/stants";
import { useRequest } from 'ahooks';
import { useRouter } from 'expo-router';
import { UserType } from './useAccount';


export type ConersationType = {
  _id: string;
  name: string;
  isGroup: boolean;
  lastMessageAt: number | Date;
  lastMessage: string;
  messages: MessageType[];
  image: string;
  participants: UserType[];
  createdAt: number | Date;
  updatedAt: number | Date;
}

export type MessageType = {
  _id: string;
  body: string;
  image: string;
  senderId: UserType[];
  receiverId: string;
  conversationId: string;
  isReads: string[];
  createdAt: number | Date;
  updatedAt: number | Date;
  system?: boolean;
}

const fetch = async () => {
  return request<ConersationType[]>({
    url: '/user/conversation',
    method: 'GET',
  })
}

export const useConversation = () => {
  const router = useRouter();
  const { data, loading, refresh, run, params, runAsync, mutate } = useRequest(fetch, {
    manual: false, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    cacheKey: CACHE_CONVERSATION,
    loadingDelay: 100,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
      // console.log('会话列表变更', data)
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
    runAsync,
    mutate
  }
}


type CreateConversationType = {
  senderId: string;
  receiverId: string;
}

const fetchAdd = async (data: CreateConversationType) => {
  return request<ConersationType>({
    url: '/conversation',
    method: 'POST',
    data
  })
}


export const useConversationCreate = () => {
  const router = useRouter();
  const { data, loading, refresh, run, params, runAsync, mutate } = useRequest(fetchAdd, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    loadingDelay: 100,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
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
    runAsync,
    mutate
  }
}




const fetchRemove = async (data: { id: string }) => {
  return request<ConersationType>({
    url: '/user/remove_conversation',
    method: 'POST',
    data
  })
}
export const useConversationRemove = () => {
  const router = useRouter();
  const { data, loading, refresh, run, params, runAsync, mutate } = useRequest(fetchRemove, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    loadingDelay: 100,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
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
    runAsync,
    mutate
  }
}



const fetchDetail = async (params: { id: string }) => {
  return request<ConersationType>({
    url: '/conversation/detail',
    method: 'GET',
    params
  })
}
export const useConversationDetail = () => {
  const router = useRouter();
  const { data, loading, refresh, run, params, runAsync, mutate } = useRequest(fetchDetail, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    loadingDelay: 100,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
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
    runAsync,
    mutate
  }
}


// 所有未读消息已读
const fetchRead = async (data: { conversationId: string }) => {
  return request<ConersationType>({
    url: '/message/read',
    method: 'POST',
    data
  })
}
export const useConversationRead = () => {
  const router = useRouter();
  const { data, loading, refresh, run, params, runAsync, mutate } = useRequest(fetchRead, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    loadingDelay: 100,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
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
    runAsync,
    mutate
  }
}







type UpdateConversationType = {
  id: string;
  image?: string;
  name?:string
}

const fetchUpdate = async (data: UpdateConversationType) => {
  return request<ConersationType>({
    url: '/conversation',
    method: 'put',
    data
  })
}


export const useConversationUpdate = () => {
  const router = useRouter();
  const { data, loading, refresh, run, params, runAsync, mutate } = useRequest(fetchUpdate, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    loadingDelay: 100,
    onError: (error) => {
      console.log('error', error)
    },
    onSuccess: (res) => {
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
    runAsync,
    mutate
  }
}