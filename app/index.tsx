import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Image
          source={require("@/assets/images/myGym.png")}
          style={styles.logoImageSmall}
          resizeMode="contain"
        />
      </View>
      <View style={styles.centerLogoContainer}>
        <Image
          source={require("@/assets/images/myGym.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    </Screen>
  );
}
