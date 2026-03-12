import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';

export const SocialButton = ({ title, icon, images, onPress }: any) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.iconContainer}>
      {images ? (
        <Image source={images} style={styles.imageIcon} />
      ) : (
        <Text style={styles.icon}>{icon}</Text>
      )}
    </View>
    <Text style={styles.text}>Continuer avec {title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#173A8A',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  imageIcon: {
    width: 24,
    height: 24,
  },
  text: { 
    color: '#FFF', 
    fontWeight: '600', 
    fontSize: 16 
  }
});
