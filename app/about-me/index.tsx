import { Text } from "react-native";
import { Screen } from "../../src/components/common/Screen";
import { styles } from "../app.style";

export default function AboutMeScreen() {
  return (
    <Screen>
      <Text style={styles.headerTitle}>About Me</Text>
    </Screen>
  );
}
