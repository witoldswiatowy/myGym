import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import { Text } from "react-native";

export default function AboutMeScreen() {
  return (
    <Screen>
      <Text style={styles.headerTitle}>About Me</Text>
    </Screen>
  );
}
