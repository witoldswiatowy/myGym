import { Text } from "react-native";
import { Screen } from "../../src/components/common/Screen";
import { styles } from "../app.style";

export default function ExercisesScreen() {
  return (
    <Screen>
      <Text style={styles.headerTitle}>Exercise Library</Text>
    </Screen>
  );
}
