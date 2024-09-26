import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { getToken, removeToken } from './storage';
import { showToast } from './utils';
import { BASE_URL } from './stants';

// 接口定义返回的数据 返回的数据 多一项或少一项都将报错
export declare interface responseData<T> {
  code: number;
  msg: string;
  data: T;
}

export declare interface ErrorData<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 生产环境用


const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 60 * 1000,
});

// 请求拦截器
instance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await getToken();
    if (token) {
      config.headers = {
        ...config.headers,
      };
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
  },
  (error) => {
    console.log('请求拦截器报错', error);
    return Promise.resolve(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // console.log('response', response.data);
    const res = response.data as responseData<any>;
    // 返回200正常返回
    if (res.code === 401) {
      showToast('登录失效')
      removeToken();
    }
    return res
  },
  (error) => {
    showToast(error?.message || '请求失败')
  }
);

function requset<T = any>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<responseData<T>> {
  if (!options) {
    return instance.request({
      ...config,
    });
  }

  return instance.request({
    ...config,
    cancelToken: options.cancelToken,
  });
}

export default requset;

export interface requestType<T> {
  (config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<
    responseData<T>
  >;
}