import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

interface AppInputProps {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const AppInput = ({ 
  label, 
  placeholder, 
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType = 'default',
}: AppInputProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput 
      style={styles.input} 
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.5)"
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { color: Colors.light.primary, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: Colors.light.inputBg,
    borderRadius: 8,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
  }
});
