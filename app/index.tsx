import { Text, View } from "react-native";
import { Screen } from "../src/components/common/Screen";
import { styles } from "./app.style";

export default function Index() {
  return (
    <Screen>
      <View style={styles.headerElement}>
        <Text style={styles.headerTitle}>myGym</Text>
      </View>
    </Screen>
  );
}
