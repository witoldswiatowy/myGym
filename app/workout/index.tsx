import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import { Text } from "react-native";

export default function WorkoutScreen() {
  return (
    <Screen>
      <Text style={styles.headerTitle}>Workout Day</Text>
    </Screen>
  );
}
