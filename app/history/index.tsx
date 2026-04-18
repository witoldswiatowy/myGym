import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import { TrainingDay } from "@/src/models/TrainingDay";
import { WorkoutRepository } from "@/src/repositories/workout.repository";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([]);

  useEffect(() => {
    WorkoutRepository.getTrainingDays().then(setTrainingDays);
  }, []);
  //WorkoutRepository.getTrainingDays().then((result) => setTrainingDays(result));

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Text style={styles.headerLogo}>myGym</Text>
      </View>
      <Text style={styles.headerTitle}>Workout History</Text>
      <View style={{ gap: 8, marginTop: 16 }}>
        {trainingDays.map((day) => (
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
