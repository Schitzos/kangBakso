import React, { useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@/components/elements/TextField';
import { useBoundStore } from '@/store/store';
import Button from '@/components/elements/Button';
import { GeoPoint } from '@react-native-firebase/firestore';
import { useLocation } from '@/hooks/user/useLocation';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import authService, { AuthPayload } from '@/services/auth/auth.service';
import SelectPicker from '@/components/elements/SelectPicker';
import TextView from '@/components/elements/TextView';
import { StackNavigationProp } from '@react-navigation/stack';
import theme from '@/styles/theme';
import { useAccessPermission } from '@/hooks/user/useAccessPermission';
import { Alert, Linking, Platform, View } from 'react-native';
import { styles } from './styles';
import { useAuth } from '@/hooks/auth/useAuth';

export interface FormDataLogin {
    name: string;
    role: string;
}

export default function RoleForm(){
  const { user } = useBoundStore((state) => state);
  const { requestLocationPermission, locationPermissions } = useAccessPermission();
  const { onLogout } = useAuth();
  const { getLocation } = useLocation();
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataLogin>({
    defaultValues: {
      name: user?.displayName ?? '',
      role: '',
    },
  });
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const handleSignOut = async () => {
    await onLogout();
    navigation.navigate('Login', { refresh: true });
  };


  const onSubmit = async (data: FormDataLogin) => {
    try {
      console.log('locationPermissions', locationPermissions);
      // Check and request permission only if not granted yet
      if (locationPermissions !== 'granted') {
        await requestLocationPermission().then(async res=>{
          if(res === 'granted' && user){
            handleCallbackAuth(data);
          }else{
            Alert.alert(
              'Location Permission Needed',
              `Location access is needed to find nearby Bakso ${data.role === 'Seller' ? 'Customers' : 'Vendors'}. Please enable location permissions in settings.`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Open Settings',
                  onPress: () => {
                    if (Platform.OS === 'ios') {
                      Linking.openURL('app-settings:');  // Opens app settings on iOS
                    } else if (Platform.OS === 'android') {
                      Linking.openSettings(); // Opens settings on Android
                    }
                  },
                },
                { text: 'Retry', onPress: requestLocationPermission },
              ]
            );
            return;
          }
        });
      }else{
        handleCallbackAuth(data);
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
    }
  };

  const handleCallbackAuth = async (data:FormDataLogin)=>{
    const location = await getLocation();
    const payload = {
      name: data.name,
      location: new GeoPoint(location.latitude, location.longitude),
      role: data.role,
      isOnline: true,
      lastOnline: Date.now(),
      email: user?.email,
    };
    const dataAuth = await authService.doAauth(payload as AuthPayload);

    useBoundStore.setState({ profile: { role: dataAuth?.role, location: dataAuth?.location } });
    navigation.navigate('Home');

  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Nama"
            type="text"
            value={value}
            onChangeText={onChange}
            placeholder="Masukkan nama"
            error={errors.name ? 'This field is required.' : undefined}
            disabled={false}
          />
        )}
        name="name"
        rules={{ required: true }}
      />
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectPicker
            options={[
              { label: 'Masukan Role', value: '' },
              { label: 'Pembeli', value: 'Buyer' },
              { label: 'Penjual', value: 'Seller' },
            ]}
            selectedValue={value}
            onValueChange={(val) => onChange(val)}
            error={errors?.role?.message}
            label="Role"
          />
        )}
        name="role"
        rules={{ required: true }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          value={isChecked}
          onValueChange={setIsChecked}
          tintColors={{ true: theme.colors.blue, false: theme.colors.blue }} // Set checked and unchecked colors
        />
        <TextView fz={10} style={{ marginLeft: 8, flexWrap: 'wrap', width: '90%' }} lineHeight={16}>
          Dengan menggunakan aplikasi ini Anda telah setuju untuk membagikan lokasi Anda kepada para tukang Bakso Keliling.
        </TextView>
      </View>
      <Button
        label="Join"
        onPress={handleSubmit(onSubmit)}
        size="large"
        fontWeight="400"
        disabled={!isChecked}
      />
      {user && <Button label="Sign Out" onPress={handleSignOut} size="large" fontWeight="400" />}
    </View>
  );
}
