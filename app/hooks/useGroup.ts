import request from "@/utils/request";
import { CACHE_GROUP_CONVERSATION } from "@/utils/stants";
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
    url: '/conversation/group',
    method: 'GET',
  })
}

export const useGroupConversation = () => {
  const router = useRouter();
  const { data, loading, refresh, run, params, runAsync, mutate } = useRequest(fetch, {
    manual: false, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    cacheKey: CACHE_GROUP_CONVERSATION,
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


type CreateGroupConversationType = {
  name: string;
  participantsIds: string;
}

const fetchAdd = async (data: CreateGroupConversationType) => {
  return request<ConersationType>({
    url: '/conversation/group',
    method: 'POST',
    data
  })
}


export const useGroupConversationCreate = () => {
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




// const fetchRemove = async (data: { id: string }) => {
//   return request<ConersationType>({
//     url: '/user/remove_conversation',
//     method: 'POST',
//     data
//   })
// }
// export const useConversationRemove = () => {
//   const router = useRouter();
//   const { data, loading, refresh, run, params, runAsync, mutate } = useRequest(fetchRemove, {
//     manual: true, // 是否手动触发 
//     debounceWait: 500,
//     refreshOnWindowFocus: false,
//     loadingDelay: 100,
//     onError: (error) => {
//       console.log('error', error)
//     },
//     onSuccess: (res) => {
//       if (res.code === 401) {
//         router.dismissAll()
//         router.replace('/login')
//       }
//     },
//   });

//   return {
//     data,
//     loading,
//     params,
//     refresh,
//     run,
//     runAsync,
//     mutate
//   }
// }
