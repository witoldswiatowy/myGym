import { Text, TouchableOpacity, View, Image } from "react-native";
import { styles } from "./ProfileCard.style";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AgeCounter } from "../AgeCounter/AgeCounter";

export function ProfilCard({ firstName, lastName, title, age, isOpenToWork }) {
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
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.title}>
            {title}, {age}
          </Text>
          <Text style={{ backgroundColor: isOpenToWork ? "green" : "red" }}>
            {isOpenToWork ? "I am open to work" : "I am not open to work"}
          </Text>
        </View>
      </View>
      <View style={styles.links}>
        <TouchableOpacity style={styles.linksBtn}>
          <FontAwesome name="twitter" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linksBtn}>
          <FontAwesome name="linkedin-square" size={24} color="#0A66C2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linksBtn}>
          <FontAwesome5 name="github" size={24} color="#333" />
          {/*
            https://docs.expo.dev/guides/icons/ - dokumentacja ikon expo
             https://icons.expo.fyi/Index - do wyszukiwania ikon expo
             */}
        </TouchableOpacity>
        <AgeCounter age={age} />
      </View>
    </View>
  );
}
