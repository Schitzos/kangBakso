import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TextView from '@/components/elements/TextView';
import {styles} from './styles';

type Option = {
  label: string;
  value: string;
};

type SelectOptionProps = {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

/**
 * A component to render a select option with a label and multiple options.
 *
 * @param {{label: string, options: Option[], selectedValue: string, onValueChange: (value: string) => void}} props
 * @prop {string} label - a label to describe the select option
 * @prop {Option[]} options - an array of options containing a label and value
 * @prop {string} selectedValue - the selected value of the select option
 * @prop {(value: string) => void} onValueChange - a callback function invoked when the selected value changes
 * @returns {React.ReactElement} a React element representing the select option
 */

export default function SelectOption({
  label,
  options,
  selectedValue,
  onValueChange,
}: Readonly<SelectOptionProps>) {
  return (
    <View style={styles.container}>
      <TextView>{label}</TextView>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue) => onValueChange(itemValue)}
      >
        {options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
}
