import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlannerScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Text style={styles.headerLogo}>myGym</Text>
      </View>
      <Text style={styles.headerTitle}>Workout Planner</Text>
    </Screen>
  );
}
