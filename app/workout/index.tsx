import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import {
  SAMPLE_TRAINING_DAYS,
  SAMPLE_WORKOUT_EXERCISES,
  SAMPLE_WORKOUT_SETS,
} from "@/src/data/training-days.data";
import { spacing } from "@/src/theme/spacing";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const day = SAMPLE_TRAINING_DAYS.find((d) => d.id === id);
  const exercises = SAMPLE_WORKOUT_EXERCISES.filter(
    (e) => e.trainingDayId === id,
  ).sort((a, b) => a.order - b.order);

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
          const sets = SAMPLE_WORKOUT_SETS.filter(
            (s) => s.workoutExerciseId === ex.id,
          ).sort((a, b) => a.index - b.index);

          return (
            <View key={ex.id} style={localStyles.exerciseCard}>
              <Text style={localStyles.exerciseName}>
                {idx + 1}. {ex.exerciseId}
              </Text>
              {sets.map((set) => (
                <View key={set.id} style={localStyles.setRow}>
                  <Text style={localStyles.setType}>
                    {set.type === "warmup" ? "0" : set.index}
                  </Text>
                  <Text style={localStyles.setText}>
                    {set.weight} {set.weightUnit} × {set.reps} powt.
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

const localStyles = StyleSheet.create({
  backButton: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#333",
    fontSize: 14,
  },
  note: {
    textAlign: "center",
    color: "#555",
    marginTop: spacing.xs,
  },
  meta: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  exerciseCard: {
    backgroundColor: "#fff8ee",
    borderRadius: 8,
    padding: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: "orange",
  },
  exerciseName: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 2,
  },
  setType: {
    width: 20,
    fontWeight: "bold",
    color: "#888",
  },
  setText: {
    fontSize: 14,
  },
});
