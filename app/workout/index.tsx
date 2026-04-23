import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import WorkoutSetRow from "@/src/components/workout/workout-set-row";
import WorkoutSetTypeModal from "@/src/components/workout/workout-set-type-modal";
import WorkoutWeightUnitModal from "@/src/components/workout/workout-weight-unit-modal";
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

type SetForm = {
  id: string;
  workoutExerciseId: string;
  index: number;
  type: "warmup" | "working" | "drop" | "failure";
  weight: string; // jako string dla TextInput
  weightUnit: "kg" | "lb";
  reps: string; // jako string dla TextInput
  done: boolean;
};

const SET_TYPE_LABEL: Record<SetForm["type"], string> = {
  warmup: "WarmUp",
  working: "Normal",
  drop: "Drop",
  failure: "Upadek",
};

const SET_WEIGHT_UNIT_OPTIONS: SetForm["weightUnit"][] = ["kg", "lb"];

function mapSet(set: WorkoutSet): SetForm {
  return {
    id: set.id,
    workoutExerciseId: set.workoutExerciseId,
    index: set.index,
    type: set.type,
    // weight: set.weight ? set.weight.toString() : "",
    weight: set.weight != null ? set.weight.toString() : "",
    weightUnit: set.weightUnit ?? "kg",
    // reps: set.reps ? set.reps.toString() : "",
    reps: set.reps != null ? set.reps.toString() : "",
    done: set.done,
  };
}

function mapSetOrCreate(
  set: WorkoutSet | undefined,
  workoutExerciseId: string,
  index: number,
): SetForm {
  if (set) {
    return mapSet(set);
  } else {
    return {
      id: `new-${workoutExerciseId}-${index}`,
      workoutExerciseId,
      index,
      type: "working",
      weightUnit: "kg",
      weight: "",
      reps: "",
      done: false,
    };
  }
}

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [day, setDay] = useState<TrainingDay | null>(null);
  const [exercises, setExercises] = useState<WorkoutExerciseWithName[]>([]);
  const [setsByExerciseId, setSetsByExerciseId] = useState<
    Record<string, SetForm[]>
  >({});
  const [typeSelectTarget, setTypeSelectTarget] = useState<{
    exerciseId: string;
    setId: string;
  } | null>(null);
  const [weightUnitSelectTarget, setWeightUnitSelectTarget] = useState<{
    exerciseId: string;
    setId: string;
  } | null>(null);

  function updateSetField(
    exerciseId: string,
    setId: string,
    patch: Partial<SetForm>,
  ) {
    setSetsByExerciseId((prev) => {
      const currentSets = prev[exerciseId] ?? [];
      return {
        ...prev,
        [exerciseId]: currentSets.map((set) =>
          set.id === setId ? { ...set, ...patch } : set,
        ),
      };
    });
  }

  function selectSetType(nextType: SetForm["type"]) {
    if (!typeSelectTarget) {
      return;
    }

    updateSetField(typeSelectTarget.exerciseId, typeSelectTarget.setId, {
      type: nextType,
    });
    setTypeSelectTarget(null); // zamyka modal po wyborze opcji,
    // bo visible zależy od typeSelectTarget,
    // więc ustawienie go na null ukryje modal
  }

  function selectWeightUnit(nextUnit: SetForm["weightUnit"]) {
    if (!weightUnitSelectTarget) {
      return;
    }

    updateSetField(
      weightUnitSelectTarget.exerciseId,
      weightUnitSelectTarget.setId,
      {
        weightUnit: nextUnit,
      },
    );
    setWeightUnitSelectTarget(null);
  }

  useEffect(() => {
    if (!id) {
      return;
    }

    WorkoutRepository.getWorkoutDetailsWithExerciseInfo(id).then((details) => {
      setDay(details.day);
      setExercises(details.exercises);
      setSetsByExerciseId(
        Object.fromEntries(
          details.exercises.map((exercise) => {
            const rawSets = details.setsByExerciseId[exercise.id] ?? [];
            const mappedSets = rawSets.length
              ? rawSets.map(mapSet)
              : [0, 1, 2].map((index) =>
                  mapSetOrCreate(undefined, exercise.id, index),
                );

            return [exercise.id, mappedSets];
          }),
        ),
      );
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
