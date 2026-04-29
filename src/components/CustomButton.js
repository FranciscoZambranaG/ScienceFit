import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export const CustomButton = ({ title, onPress, style, textStyle, disabled }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style, disabled && styles.disabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
});