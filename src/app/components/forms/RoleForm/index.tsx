import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { styles } from './styles';
import theme from '@/app/styles/theme';
import { useBoundStore } from '@/app/stateManagement/store';
import useLoginViewModel from '@/app/features/login/viewModel/useLoginViewModel';
import Loading from '@components/elements/Loader';
import TextField from '@components/elements/TextField';
import SelectPicker from '@components/elements/SelectPicker';
import TextView from '@components/elements/TextView';
import Button from '@components/elements/Button';

export interface FormDataLogin {
  name: string;
  role: string;
}

export default function RoleForm(){
  const { user } = useBoundStore((state) => state);
  const { control, errors, handleSubmit, handleLoginForm, handleLogoutForm, checkLogin, isChecked, setIsChecked } = useLoginViewModel();

  if(handleLoginForm.isPending || handleLogoutForm.isPending){
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
      {user && <Button label="Sign Out" onPress={()=>handleLogoutForm.mutate(null)} size="large" fontWeight="400" />}
    </View>
  );
}

