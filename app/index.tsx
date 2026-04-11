import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../App.style";
import { ProfilCard } from "../components/ProfilCard/ProfilCard";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.profileCard}>
        <ProfilCard
          firstName={"Witold"}
          lastName={"Światowy"}
          title={"Software Engineer"}
          age={32}
          isOpenToWork
        />
        <ProfilCard
          firstName={"John"}
          lastName={"Doe"}
          title={"Product Manager"}
          age={28}
          isOpenToWork={false}
        />
        <ProfilCard
          firstName={"Jane"}
          lastName={"Smith"}
          title={"Designer"}
          age={0} // bo zero jest falsy, więc nie będzie wyświetlane za pomocą warunku age && <Text>...</Text>
          isOpenToWork={true}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
