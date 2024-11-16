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
import { View } from 'react-native';
import { styles } from './styles';
import { useAuth } from '@/hooks/auth/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchemaValidation } from './validation';

export interface FormDataLogin {
    name: string;
    role: string;
}

export default function RoleForm(){
  const { user } = useBoundStore((state) => state);
  const { onLogout, onLogin } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataLogin>({
    defaultValues: {
      name: user?.displayName ?? '',
      role: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(signInSchemaValidation),
  });

  const onSubmit = async (data: FormDataLogin) => {
    try {
      await onLogin(data).then(async (res)=>{
        res && navigation.navigate('Home');
      });
    } catch (error) {
      console.error('Error in onSubmit:', error);
    }
  };

  const handleSignOut = async () => {
    await onLogout();
    navigation.navigate('Login', { refresh: true });
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
        onPress={handleSubmit(onSubmit)}
        size="large"
        fontWeight="400"
        disabled={!isChecked || Object.keys(errors).length > 0}
      />
      {user && <Button label="Sign Out" onPress={handleSignOut} size="large" fontWeight="400" />}
    </View>
  );
}
