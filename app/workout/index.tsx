import { Text } from "react-native";
import { Screen } from "../../src/components/common/Screen";
import { styles } from "../app.style";

export default function WorkoutScreen() {
  return (
    <Screen>
      <Text style={styles.headerTitle}>Workout Day</Text>
    </Screen>
  );
}
