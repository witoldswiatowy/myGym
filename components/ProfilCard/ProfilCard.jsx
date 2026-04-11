import { Text, TouchableOpacity, View, Image } from "react-native";
import { styles } from "./ProfileCard.style";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function ProfilCard({ firstName, lastName, title, age, isHappy }) {
  // if (age > 100) {
  //   return <Text>Jesteś stary!</Text>;
  // } else if (age < 18) {
  //   return <Text>Jesteś dzieckiem!</Text>;
  // } else {
  //   return <Text>Jesteś młody!</Text>;
  // }

  return (
    <>
      <Text>
        {age > 100
          ? "Jesteś stary!"
          : age < 18
            ? "Jesteś dzieckiem!"
            : "Jesteś młody!"}
      </Text>
      <Text>{isHappy ? "Jesteś szczęśliwy!" : "Nie jesteś szczęśliwy!"}</Text>
      <Text>{isHappy && "Jesteś szczęśliwy!"}</Text>

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
            <Text style={styles.title}>{title}</Text>
            {age && <Text style={styles.age}>{age} years old</Text>}
            <Text style={styles.age}>{age} years old</Text>
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
        </View>
      </View>
    </>
  );
}
