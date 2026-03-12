import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

interface TabBarIconProps {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}

export const TabBarIcon = ({ name, color }: TabBarIconProps) => (
  <MaterialCommunityIcons name={name} size={24} color={color} style={styles.icon} />
);

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});
