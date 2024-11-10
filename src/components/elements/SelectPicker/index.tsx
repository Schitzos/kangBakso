import React, { useState } from 'react';
import { Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from './styles';
import theme from '@/styles/theme';
import TextView from '../TextView';

type PickerOption = {
  label: string;
  value: string;
};

interface SelectPickerProps {
  options: PickerOption[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  label?: string;
}

const SelectPicker: React.FC<SelectPickerProps> = ({ options = [], selectedValue, onValueChange, error, placeholder = 'Pilih salah satu', label }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);
  const [items, setItems] = useState(options);

  const handleValueChange = (val: string | null) => {
    if (val) {
      setValue(val);
      onValueChange(val);
    }
  };

  return (
    <View style={styles.container}>
      <TextView fz={14}>{label}</TextView>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={(isOpen) => {
          setOpen(isOpen);
        }}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={handleValueChange}
        style={styles.dropdown}
        labelStyle={styles.dropdownLabel}
        dropDownContainerStyle={styles.dropdownItem}
        // @ts-ignore
        arrowIconStyle={{tintColor: theme.colors.primary}}
        listMode={'SCROLLVIEW'}
        zIndex={1000}
        zIndexInverse={1000}
        closeOnBackPressed={true}
        placeholder={placeholder}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default SelectPicker;
