import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../App.style";
import { Profil } from "../components/Profil/Profil";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Welcome !</Text>
        <Profil />
        <Text style={styles.title}>Welcome !!</Text>
        <View style={styles.square}>
          <Text style={styles.innerText}> Text w boxie </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
