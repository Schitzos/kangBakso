import React, { useState } from 'react';
import { Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { styles } from './styles';
import TextView from '../TextView';
import theme from '@/app/styles/theme';

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

/**
 * A customizable select picker component using `DropDownPicker`.
 *
 * This component renders a dropdown picker with a list of options, displaying
 * the selected value and allowing the user to change the selection. It also
 * supports displaying an optional label and error message.
 *
 * @prop {PickerOption[]} options - An array of objects representing the options for the picker. Each object should have a `label` and `value`.
 * @prop {string | null} selectedValue - The currently selected value of the picker.
 * @prop {(value: string) => void} onValueChange - A callback function that is called when the selected value changes.
 * @prop {string} [error] - An optional error message to display below the picker.
 * @prop {string} [placeholder='Pilih salah satu'] - An optional placeholder text to display when no value is selected.
 * @prop {string} [label] - An optional label text to display above the picker.
 */
const SelectPicker: React.FC<SelectPickerProps> = ({ options = [], selectedValue, onValueChange, error, placeholder = 'Pilih salah satu', label }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);
  const [items, setItems] = useState(options);

  const handleValueChange = (val: string | null) => {
    setValue(val);
    onValueChange(val ?? '');
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
        listItemLabelStyle={styles.dropdownLabelList}
        customItemLabelStyle={styles.dropdownLabelList}
        dropDownContainerStyle={styles.dropdownItem}
        // @ts-ignore
        arrowIconStyle={{ tintColor: theme.colors.primary }}
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
