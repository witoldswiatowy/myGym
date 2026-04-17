import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import { SAMPLE_TRAINING_DAYS } from "@/src/data/training-days.data";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Text style={styles.headerLogo}>myGym</Text>
      </View>
      <Text style={styles.headerTitle}>Workout History</Text>
      <View style={{ gap: 8, marginTop: 16 }}>
        {SAMPLE_TRAINING_DAYS.map((day) => (
          <Pressable
            key={day.id}
            onPress={() =>
              router.push({ pathname: "/workout", params: { id: day.id } })
            }
            style={{ padding: 12, backgroundColor: "#ffc457", borderRadius: 8 }}
          >
            <Text style={{ fontWeight: "bold" }}>{day.date}</Text>
            {day.note ? <Text>{day.note}</Text> : null}
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
