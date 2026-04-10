import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../App.style";
import { ProfilCard } from "../components/ProfilCard/ProfilCard";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.profileCard}>
        <ProfilCard
          firstName="Witold"
          lastName="Światowy"
          title="Software Engineer"
        />
        <ProfilCard firstName="John" lastName="Doe" title="Product Manager" />
        <ProfilCard firstName="Jane" lastName="Smith" title="Designer" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
