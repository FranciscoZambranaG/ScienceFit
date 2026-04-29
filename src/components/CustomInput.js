import { StyleSheet, TextInput } from 'react-native';

export const CustomInput = ({ placeholder, value, onChangeText, secureTextEntry, style, ...props }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});