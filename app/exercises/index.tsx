import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen } from "../../src/components/common/Screen";
import { styles } from "../app.style";

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Text style={styles.headerLogo}>myGym</Text>
      </View>
      <Text style={styles.headerTitle}>Exercise Library</Text>
    </Screen>
  );
}
