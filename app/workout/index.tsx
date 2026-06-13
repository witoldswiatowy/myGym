import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import WorkoutSetRow from "@/src/components/workout/workout-set-row";
import WorkoutSetTypeModal from "@/src/components/workout/workout-set-type-modal";
import WorkoutWeightUnitModal from "@/src/components/workout/workout-weight-unit-modal";
import { localStyles } from "@/src/components/workout/workout.style";
import { useWorkoutScreen } from "@/src/hooks/use-workout-screen";
import { spacing } from "@/src/theme/spacing";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const SET_TYPE_LABEL: Record<string, string> = {
  warmup: "WarmUp",
  working: "Normal",
  drop: "Drop",
  failure: "Upadek",
};

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    day,
    exercises,
    setsByExerciseId,
    typeSelectTarget,
    setTypeSelectTarget,
    weightUnitSelectTarget,
    setWeightUnitSelectTarget,
    updateSetField,
    selectSetType,
    selectWeightUnit,
  } = useWorkoutScreen(id);

  if (!day) {
    return (
      <Screen>
        <View>
          <Text>Nie znaleziono dnia treningowego.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen title="Workout Day">
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
                <WorkoutSetRow
                  key={set.id}
                  set={set}
                  typeLabel={SET_TYPE_LABEL[set.type]}
                  onOpenTypeSelect={() =>
                    setTypeSelectTarget({ exerciseId: ex.id, setId: set.id })
                  } //funkcja przekazana do WorkoutSetRow, która ustawi typeSelectTarget
                  // na obiekt z exerciseId i setId, co spowoduje otwarcie modala typu
                  onOpenWeightUnitSelect={() =>
                    setWeightUnitSelectTarget({
                      exerciseId: ex.id,
                      setId: set.id,
                    })
                  }
                  onChangeWeight={(weight) =>
                    updateSetField(ex.id, set.id, { weight })
                  }
                  onChangeReps={(reps) =>
                    updateSetField(ex.id, set.id, { reps })
                  }
                  onChangeDone={(done) =>
                    updateSetField(ex.id, set.id, { done })
                  }
                />
              ))}
            </View>
          );
        })}
      </ScrollView>

      <WorkoutSetTypeModal
        typeSelectTarget={typeSelectTarget}
        setTypeSelectTarget={setTypeSelectTarget}
        selectSetType={selectSetType}
      />

      <WorkoutWeightUnitModal
        weightUnitSelectTarget={weightUnitSelectTarget}
        setWeightUnitSelectTarget={setWeightUnitSelectTarget}
        selectWeightUnit={selectWeightUnit}
      />
    </Screen>
  );
}
