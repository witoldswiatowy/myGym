import { Text } from "react-native";
import { Screen } from "../../src/components/common/Screen";
import { styles } from "../app.style";

export default function PlannerScreen() {
  return (
    <Screen>
      <Text style={styles.headerTitle}>Workout Planner</Text>
    </Screen>
  );
}
