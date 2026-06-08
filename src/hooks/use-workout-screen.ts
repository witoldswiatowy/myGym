import { TrainingDay } from "@/src/models/TrainingDay";
import {
  WorkoutExerciseWithName,
  WorkoutRepository,
} from "@/src/repositories/workout.repository";
import { useEffect, useState } from "react";
import { WorkoutSet } from "../models/WorkoutSet";

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
