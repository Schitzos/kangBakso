import { QueryCache, QueryClient } from '@tanstack/react-query';
// import crashlytics from '@react-native-firebase/crashlytics';

export const queryClientConfig = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query: any) => {
      if (query.meta && query.meta.errorMessage) {
        // const isError = error instanceof Error;
        // const errorToReport = isError
        //   ? error
        //   : new Error(
        //     JSON.stringify({
        //       message: query.meta.errorMessage,
        //       originalError: error,
        //     }),
        //   );
        // crashlytics().log(`Error fetch ${error}`);
        // crashlytics().recordError(errorToReport);
        console.log(`error ${query.meta.errorMessage} ${error}`);
      }
    },
  }),
});
