import { TrainingDay } from "@/src/models/TrainingDay";
import {
  WorkoutExerciseWithName,
  WorkoutRepository,
} from "@/src/repositories/workout.repository";
import { useEffect, useState } from "react";
import { WorkoutSet } from "../models/WorkoutSet";
import { useDebouncedValue } from "./use-debounced-value";

type SetForm = {
  id: string;
  workoutExerciseId: string;
  index: number;
  type: "warmup" | "working" | "drop" | "failure";
  weight: string;
  weightUnit: "kg" | "lb";
  reps: string;
  done: boolean;
};

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
  if (set) return mapSet(set);
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

// Konwertuj SetForm (stringi) na WorkoutSet (liczby) i zapisz
function toWorkoutSet(formSet: SetForm): WorkoutSet {
  return {
    id: formSet.id,
    workoutExerciseId: formSet.workoutExerciseId,
    index: formSet.index,
    type: formSet.type,
    weight: formSet.weight ? parseFloat(formSet.weight) : undefined,
    weightUnit: formSet.weightUnit,
    reps: formSet.reps ? parseInt(formSet.reps) : undefined,
    done: formSet.done,
  };
}

export function useWorkoutScreen(trainingDayId: string | undefined) {
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

  const debouncedSetsByExerciseId = useDebouncedValue(setsByExerciseId, 500); //by nie wywoływać aktualizacji przy każdym szybkim tapnięciu, tylko po chwili "uspokajania się" zmian

  function updateSetField(
    exerciseId: string,
    setId: string,
    patch: Partial<SetForm>,
  ) {
    setSetsByExerciseId((prev) => {
      const currentSets = prev[exerciseId] ?? [];
      return {
        ...prev,
        [exerciseId]: currentSets.map((s) =>
          s.id === setId ? { ...s, ...patch } : s,
        ),
      };
    });
  }

  function selectSetType(nextType: SetForm["type"]) {
    if (!typeSelectTarget) return;
    updateSetField(typeSelectTarget.exerciseId, typeSelectTarget.setId, {
      type: nextType,
    });
    setTypeSelectTarget(null); // zamyka modal po wyborze opcji,
    // bo visible zależy od typeSelectTarget,
    // więc ustawienie go na null ukryje modal
  }

  function selectWeightUnit(nextUnit: SetForm["weightUnit"]) {
    if (!weightUnitSelectTarget) return;
    updateSetField(
      weightUnitSelectTarget.exerciseId,
      weightUnitSelectTarget.setId,
      { weightUnit: nextUnit },
    );
    setWeightUnitSelectTarget(null);
  }

  useEffect(() => {
    if (!trainingDayId) return;

    WorkoutRepository.getWorkoutDetailsWithExerciseInfo(trainingDayId).then(
      (
        details: Awaited<
          ReturnType<typeof WorkoutRepository.getWorkoutDetailsWithExerciseInfo>
        >,
      ) => {
        setDay(details.day);
        setExercises(details.exercises);
        setSetsByExerciseId(
          Object.fromEntries(
            details.exercises.map((exercise: any) => {
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
      },
    );
  }, [trainingDayId]);

  useEffect(() => {
    if (!trainingDayId) return; // ← nie zapisuj jeśli brak ID

    // Zapis przy debounce
    // Spłaszcz wszystkie sety ze wszystkich ćwiczeń do jednej tablicy
    const allSets = Object.values(debouncedSetsByExerciseId)
      .flat()
      .map(toWorkoutSet);

    if (allSets.length === 0) return;

    // Jeden zapis dla wszystkich setów — brak race condition
    WorkoutRepository.updateSets(allSets).catch((error) =>
      console.error("Error saving sets:", error),
    );
  }, [debouncedSetsByExerciseId, trainingDayId]); // ← zależy od debounced stanu

  return {
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
  };
}
