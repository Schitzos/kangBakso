import React, { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import BottomSheetModal from '../BottomSheet';
import TextView from '../TextView';
import { Image, View } from 'react-native';
import { styles } from './styles';

function Offline(): React.JSX.Element {
  const [isOnline, setIsOnline] = useState(true);
  // Monitor network status
  useEffect(() => {
    // Fetch initial network status
    const fetchStatus = async () => {
      const state = await NetInfo.fetch();
      setIsOnline(!!state.isConnected && !!state.isInternetReachable);
    };
    fetchStatus();

    NetInfo.addEventListener(state => {
      const online = !!state.isConnected && !!state.isInternetReachable;
      if (isOnline !== online) {
        setIsOnline(online);
      }
    });

  }, [isOnline]);

  if(isOnline){
    return <View/>;
  }else{
    return (
      <BottomSheetModal
        onClose={() => {}}
        snapPoints={['40%', '40%']}
        enablePanDownToClose={false}
        pressBehavior="none"
      >
        <View style={styles.container}>
          <TextView align="center" fw="700" fz={20}>
            Network Offline
          </TextView>
          <View style={styles.imageContainer}>
            <Image source={require('@assets/logo/offline.png')} style={styles.image} resizeMode="cover"/>
          </View>
          <TextView align="center">This application is depends on network so please make sure your network is connected</TextView>
        </View>
      </BottomSheetModal>
    );
  }
}

export default Offline;
