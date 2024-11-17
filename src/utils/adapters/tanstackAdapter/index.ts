import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export function FirebaseMutation<T>({ options,  callback = () => {} }:{
  options: any,
  callback: ((data: T) => void) | undefined,
}) {
  return useMutation({

    mutationFn: async (payload: any) => {
      return await options(payload);
    },
    onSuccess: (res:T) => {
      callback && callback(res);
      return res;
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: `Error ${error.response.status}`,
        text2: error.response.data.message,
        visibilityTime: 3000,
      });
      return error;
    },
  });
}
