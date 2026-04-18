import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import { localStyles } from "@/src/components/workout/workout.style";
import { TrainingDay } from "@/src/models/TrainingDay";
import { WorkoutSet } from "@/src/models/WorkoutSet";
import {
  WorkoutExerciseWithName,
  WorkoutRepository,
} from "@/src/repositories/workout.repository";
import { spacing } from "@/src/theme/spacing";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [day, setDay] = useState<TrainingDay | null>(null);
  const [exercises, setExercises] = useState<WorkoutExerciseWithName[]>([]);
  const [setsByExerciseId, setSetsByExerciseId] = useState<
    Record<string, WorkoutSet[]>
  >({});

  useEffect(() => {
    if (!id) {
      return;
    }

    WorkoutRepository.getWorkoutDetailsWithExerciseInfo(id).then((details) => {
      setDay(details.day);
      setExercises(details.exercises);
      setSetsByExerciseId(details.setsByExerciseId);
    });
  }, [id]);

  if (!day) {
    return (
      <Screen>
        <View style={{ paddingTop: insets.top }}>
          <Text>Nie znaleziono dnia treningowego.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Text style={styles.headerLogo}>myGym</Text>
      </View>
      <Text style={styles.headerTitle}>Workout Day</Text>
      <Pressable onPress={() => router.back()} style={localStyles.backButton}>
        <Text style={localStyles.backButtonText}>← Wróć</Text>
      </Pressable>

      <Text style={styles.headerTitle}>
        {day.date}{" "}
        {new Date(day.date).toLocaleDateString("pl-PL", { weekday: "long" })}
      </Text>
      {day.note ? <Text style={localStyles.note}>{day.note}</Text> : null}
      {day.durationMin ? (
        <Text style={localStyles.meta}>Czas: {day.durationMin} min</Text>
      ) : null}

      <ScrollView
        style={{ marginTop: spacing.md }}
        contentContainerStyle={{ gap: spacing.sm }}
      >
        {exercises.map((ex, idx) => {
          const sets = setsByExerciseId[ex.id] ?? [];

          return (
            <View key={ex.id} style={localStyles.exerciseCard}>
              <Text style={localStyles.exerciseName}>
                {idx + 1}. {ex.name}
              </Text>
              {sets.map((set) => (
                <View key={set.id} style={localStyles.setRow}>
                  <Text style={localStyles.setType}>
                    {set.type === "warmup" ? "0" : set.index}
                  </Text>
                  <Text style={localStyles.setText}>
                    {set.weight} {set.weightUnit} × {set.reps} powt.{" "}
                    {set.done ? "✓" : ""}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
