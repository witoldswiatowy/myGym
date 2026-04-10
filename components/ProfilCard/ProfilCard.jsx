import { Text, TouchableOpacity, View, Image } from "react-native";
import { styles } from "./ProfileCard.style";

export function ProfilCard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>Witold Światowy</Text>
          <Text style={styles.title}>Software Engineer</Text>
        </View>
      </View>
      <View style={styles.links}>
        <TouchableOpacity>
          <Text>Click me !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
