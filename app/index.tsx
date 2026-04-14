import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <Screen>
      <View style={styles.headerElement}>
        <Text style={styles.headerTitle}>myGym</Text>
      </View>
    </Screen>
  );
}
