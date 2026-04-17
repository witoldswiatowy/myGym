import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import { SAMPLE_TRAINING_DAYS } from "@/src/data/training-days.data";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Text style={styles.headerLogo}>myGym</Text>
      </View>
      <Text style={styles.headerTitle}>Workout Day</Text>
      <View>
        {SAMPLE_TRAINING_DAYS.map((day) => (
          <View key={day.id}>
            <Text>{day.date}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
