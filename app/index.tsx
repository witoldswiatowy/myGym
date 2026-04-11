import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../App.style";
import { ProfilCard } from "../components/ProfilCard/ProfilCard";
import { Linking } from "react-native";

export default function Index() {
  function goToSocialMedia(socialMedia: "linkedin" | "github" | "twitter") {
    //można socialMedia: any, ale wtedy trzeba bedzie obsłużyć sytuacje inne niż te 3 czy jakiś defult, dlatego lepiej jest ograniczyć typ do konkretnych wartości, które nas interesują
    let url;
    switch (socialMedia) {
      case "github":
        url = "https://github.com/witoldswiatowy";
        break;
      case "linkedin":
        url = "https://github.com/witoldswiatowy";
        break;
      case "twitter":
        url = "https://github.com/witoldswiatowy";
        break; // break musi być, żeby nie wykonywały się kolejne przypadki po znalezieniu pasującego
      // Możesz dodać więcej przypadków dla innych mediów społecznościowych
    }
    Linking.openURL(url);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.profileCard}>
        <ProfilCard
          firstName={"Witold"}
          lastName={"Światowy"}
          title={"Software Engineer"}
          initialAge={33}
          isOpenToWork
          onPressSocialMediaIcon={goToSocialMedia}
        />
        <ProfilCard
          firstName={"John"}
          lastName={"Doe"}
          title={"Product Manager"}
          initialAge={28}
          isOpenToWork={false}
          onPressSocialMediaIcon={goToSocialMedia}
        />
        <ProfilCard
          firstName={"Jane"}
          lastName={"Smith"}
          title={"Designer"}
          initialAge={0} // bo zero jest falsy, więc nie będzie wyświetlane za pomocą warunku age && <Text>...</Text>
          isOpenToWork={true}
          onPressSocialMediaIcon={goToSocialMedia}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
