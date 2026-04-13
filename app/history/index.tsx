import { Text } from "react-native";
import { Screen } from "../../src/components/common/Screen";
import { styles } from "../app.style";

export default function HistoryScreen() {
  return (
    <Screen>
      <Text style={styles.headerTitle}>Workout History</Text>
    </Screen>
  );
}
