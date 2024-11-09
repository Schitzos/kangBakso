import React from 'react';
import { View } from 'react-native';
import SelectOption from '@/components/elements/SelectOption';
import { Controller, useForm } from 'react-hook-form';
import TextField from '@/components/elements/TextField';
import { useBoundStore } from '@/store/store';
import Button from '@/components/elements/Button';
import { GeoPoint } from '@react-native-firebase/firestore';
import { useLocation } from '@/hooks/user/useLocation';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';
import authService from '@/services/auth/auth.service';

export interface FormDataLogin {
    name: string;
    role: string;
  }

export default function RoleForm(){
  const user = useBoundStore((state) => state.user); // Subscribe to user state changes
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const {getLocation} = useLocation();
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataLogin>({
    defaultValues: {
      name: user?.displayName ?? '',
      role: '',
    },
  });

  const onSubmit = async (data: FormDataLogin) => {
    try {
      const location = await getLocation();
      if(user){
        const payload = {
          name: data.name,
          location: new GeoPoint(location.latitude, location.longitude), // Create a GeoPoint
          role: data.role,
          isOnline: true,
          lastOnline: Date.now(),
          email: user?.email,
        };
        const dataAuth = await authService.doAauth(payload);

        useBoundStore.setState({profile: {role: dataAuth?.role, location: dataAuth?.location}});
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error in onSubmit:', error);
    }
  };

  return(
    <View>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Name"
            type="text"
            value={value}
            onChangeText={onChange}
            placeholder="Masukkan no Handphone atau Alamat Email Anda"
            error={errors.name ? 'This field is required.' : undefined} // Pass error message if exists
            disabled={true}
          />
        )}
        name="name"
        rules={{ required: true }}
      />
      <Controller
        control={control}
        name="role"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <SelectOption
            label="Choose an option"
            options={[
              {label: 'Pilih Role', value: ''},
              {label: 'Pembeli', value: 'Buyer'},
              {label: 'Penjual', value: 'Seller'},
            ]}
            selectedValue={value}
            onValueChange={onChange}
          />
        )}
      />
      <Button
        label="Masuk"
        onPress={handleSubmit(onSubmit)}
        size="medium"/>
    </View>
  );
}
