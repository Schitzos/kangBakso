import React, { useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@/components/elements/TextField';
import { useBoundStore } from '@/store/store';
import Button from '@/components/elements/Button';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';
import SelectPicker from '@/components/elements/SelectPicker';
import TextView from '@/components/elements/TextView';
import { StackNavigationProp } from '@react-navigation/stack';
import theme from '@/styles/theme';
import { Alert, Linking, Platform, View } from 'react-native';
import { styles } from './styles';
import { useAuth } from '@/hooks/auth/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchemaValidation } from './validation';
import { FirebaseMutation } from '@/utils/adapters/tanstackAdapter';
import Loading from '@/components/elements/Loader';
import { useAccessPermission } from '@/hooks/user/useAccessPermission';

export interface FormDataLogin {
  name: string;
  role: string;
}

export default function RoleForm(){
  const { user, profile } = useBoundStore((state) => state);
  const { onLogout, onLogin } = useAuth();
  const  { requestLocationPermission, checkLocationPermission } = useAccessPermission();
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataLogin>({
    defaultValues: {
      name: profile?.name ?? '',
      role: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(signInSchemaValidation),
  });

  const handlelogin = FirebaseMutation({
    options: onLogin,
    callback: () => navigation.navigate('Home'),
  });

  const handleLogout = FirebaseMutation({
    options: onLogout,
    callback: () => navigation.navigate('Login', { refresh: true }),
  });

  const checkLogin = async (data:FormDataLogin) => {
    const granted = await checkLocationPermission();
    if(!granted){
      const isAllow = await requestLocationPermission();
      if(isAllow === 'granted'){
        checkLogin(data);
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
          ]
        );
      }
    }else{
      handlelogin.mutate(data);
    }
  };

  if(handlelogin.isPending || handleLogout.isPending){
    return (
      <Loading/>
    );
  }

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
            error={errors.name?.message} // Pass error message if exists
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
            onValueChange={(val) =>onChange(val)}
            error={errors.role?.message} // Pass error message if exists
            label="Role"
          />
        )}
        name="role"
        rules={{ required: true }}
      />
      <View style={styles.cta}>
        <CheckBox
          value={isChecked}
          onValueChange={setIsChecked}
          tintColors={{ true: theme.colors.blue, false: theme.colors.blue }} // Set checked and unchecked colors
        />
        <TextView fz={10} style={styles.ctaText} lineHeight={16}>
          Dengan menggunakan aplikasi ini Anda telah setuju untuk membagikan lokasi Anda kepada para tukang Bakso Keliling.
        </TextView>
      </View>
      <Button
        label="Join"
        onPress={handleSubmit((data)=>checkLogin(data))}
        size="large"
        fontWeight="400"
        disabled={!isChecked || Object.keys(errors).length > 0}
      />
      {user && <Button label="Sign Out" onPress={()=>handleLogout.mutate(null)} size="large" fontWeight="400" />}
    </View>
  );
}

