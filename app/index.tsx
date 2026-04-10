import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../App.style";
import { Profil } from "../components/Profil/Profil";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        // style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View style={styles.box1}></View>
        <View style={styles.box2}></View>
        <View style={styles.box3}></View>
        <View style={styles.box4}></View>
        <View style={styles.box5}></View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
