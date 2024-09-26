import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = "CHAT-TOKEN"

export const setToken = async (value: string) => {
  try {
    return await AsyncStorage.setItem(KEY, value);

  } catch (e) {
    // saving error
  }
};


export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(KEY);
  } catch (e) {
    // error reading value
  }
};

export const removeToken = async () => {
  try {
    return await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.log('removeToken error',e)
    // error reading value
  }
};