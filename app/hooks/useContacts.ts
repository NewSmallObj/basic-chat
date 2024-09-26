import { useRequest } from 'ahooks';
import request from "@/utils/request"
import { useRouter } from 'expo-router';
import { showToast } from '@/utils/utils';
import { UserType } from './useAccount';
import { CACHE_CONTACTS } from '@/utils/stants';

const fetch = async () => {
  return request<UserType[]>({
    url: '/user',
    method: 'get',
  })
}

export const useContacts = () => {
  const router = useRouter()
  const { data, loading, refresh, run, params, runAsync,mutate } = useRequest(fetch, {
    manual: false, // 是否手动触发 
    debounceWait: 500,
    refreshOnWindowFocus: false,
    cacheKey: CACHE_CONTACTS,
    cacheTime: 1000 * 60,
    staleTime: 1000 * 60,
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

