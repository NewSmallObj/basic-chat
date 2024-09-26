import { useRequest } from 'ahooks';
import request from "@/utils/request"
import { useRouter } from 'expo-router';
import { showToast } from '@/utils/utils';
import { MessageType } from './useConversation';
import { CACHE_MESSAGE } from '@/utils/stants';



const fetch = async (params:{ conversationId: string ,page:number}) => {
  return request<{
    list:MessageType[],
    total:number
  }>({
    url: '/message/byConversationId',
    method: 'get',
    params
  })
}

export const useMessage = () => {
  const router = useRouter()
  const { data, loading, refresh, run, params, runAsync } = useRequest(fetch, {
    manual: true, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    cacheKey: CACHE_MESSAGE,
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
    runAsync
  }
}


const fetchcreate = async (data:{ 
  senderId: string,
  receiverId: string,
  conversationId: string ,
  body?: string ,
  image?: string ,
}) => {
  return request<MessageType>({
    url: '/conversation/message',
    method: 'post',
    data
  })
}

export const useMessageCreate = () => {
  const router = useRouter()
  const { data, loading, refresh, run, params, runAsync } = useRequest(fetchcreate, {
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
    runAsync
  }
}
