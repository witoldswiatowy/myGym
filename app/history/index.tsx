import { Screen } from "@/src/components/common/Screen";
import { TrainingDay } from "@/src/models/TrainingDay";
import { WorkoutRepository } from "@/src/repositories/workout.repository";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function HistoryScreen() {
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([]);

  useEffect(() => {
    WorkoutRepository.getTrainingDays().then(setTrainingDays);
  }, []);
  //WorkoutRepository.getTrainingDays().then((result) => setTrainingDays(result));

  return (
    <Screen title="Workout History">
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
