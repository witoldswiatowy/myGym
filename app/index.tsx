import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../App.style";
import { ProfilCard } from "../components/ProfilCard/ProfilCard";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.profileCard}>
        {/* <AgeCounter age={33} /> */}
        <ProfilCard
          firstName={"Witold"}
          lastName={"Światowy"}
          title={"Software Engineer"}
          initialAge={33}
          isOpenToWork
        />
        <ProfilCard
          firstName={"John"}
          lastName={"Doe"}
          title={"Product Manager"}
          initialAge={28}
          isOpenToWork={false}
        />
        <ProfilCard
          firstName={"Jane"}
          lastName={"Smith"}
          title={"Designer"}
          initialAge={0} // bo zero jest falsy, więc nie będzie wyświetlane za pomocą warunku age && <Text>...</Text>
          isOpenToWork={true}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
