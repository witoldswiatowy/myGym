import {
  SAMPLE_TRAINING_DAYS,
  SAMPLE_WORKOUT_EXERCISES,
  SAMPLE_WORKOUT_SETS,
} from "@/src/data/training-days.data";
import { TrainingDay } from "@/src/models/TrainingDay";
import { WorkoutExercise } from "@/src/models/WorkoutExercise";
import { WorkoutSet } from "@/src/models/WorkoutSet";
import { ExerciseRepository } from "@/src/repositories/exercise.repository";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  trainingDays: "training-days.v1",
  workoutExercises: "workout-exercises.v1",
  workoutSets: "workout-sets.v1",
} as const;

export type WorkoutDetails = {
  day: TrainingDay | null;
  exercises: WorkoutExercise[];
  setsByExerciseId: Record<string, WorkoutSet[]>;
};

export type WorkoutExerciseWithName = WorkoutExercise & { name: string };

async function getOrSeed<T>(key: string, seed: T): Promise<T> {
  try {
    const stored = await AsyncStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
    await AsyncStorage.setItem(key, JSON.stringify(seed));
    return seed;
  } catch (error) {
    console.error(`Error reading key ${key}:`, error);
    return seed;
  }
}

export const WorkoutRepository = {
  async getTrainingDays(): Promise<TrainingDay[]> {
    return getOrSeed(STORAGE_KEYS.trainingDays, SAMPLE_TRAINING_DAYS);
  },

  async getTrainingDayById(id: string): Promise<TrainingDay | null> {
    const days = await this.getTrainingDays();
    return days.find((d) => d.id === id) ?? null;
  },

  async getExercisesForTrainingDay(
    trainingDayId: string,
  ): Promise<WorkoutExercise[]> {
    const exercises = await getOrSeed(
      STORAGE_KEYS.workoutExercises,
      SAMPLE_WORKOUT_EXERCISES,
    );
    return exercises
      .filter((e) => e.trainingDayId === trainingDayId)
      .sort((a, b) => a.order - b.order);
  },

  async getSetsForWorkoutExercise(
    workoutExerciseId: string,
  ): Promise<WorkoutSet[]> {
    const sets = await getOrSeed(STORAGE_KEYS.workoutSets, SAMPLE_WORKOUT_SETS);
    return sets
      .filter((s) => s.workoutExerciseId === workoutExerciseId)
      .sort((a, b) => a.index - b.index);
  },

  async updateSet(updatedSet: WorkoutSet): Promise<void> {
    const sets = await getOrSeed(STORAGE_KEYS.workoutSets, SAMPLE_WORKOUT_SETS);
    const updated = sets.map((s) => (s.id === updatedSet.id ? updatedSet : s));
    await AsyncStorage.setItem(
      STORAGE_KEYS.workoutSets,
      JSON.stringify(updated),
    );
    //opcjonalnie można usprawnić i zamienić na aktualizację tylko tego jednego seta, ale to wymagałoby bardziej złożonej logiki i nie jest konieczne w tym przypadku, póki co trzymamy wszystko prosto.
  },

  async getWorkoutDetails(trainingDayId: string): Promise<WorkoutDetails> {
    const [day, exercises, sets] = await Promise.all([
      this.getTrainingDayById(trainingDayId),
      this.getExercisesForTrainingDay(trainingDayId),
      getOrSeed(STORAGE_KEYS.workoutSets, SAMPLE_WORKOUT_SETS),
    ]);

    const exerciseIds = new Set(exercises.map((e) => e.id));
    const setsByExerciseId = sets
      .filter((s) => exerciseIds.has(s.workoutExerciseId))
      .sort((a, b) => a.index - b.index)
      .reduce<Record<string, WorkoutSet[]>>((acc, set) => {
        if (!acc[set.workoutExerciseId]) {
          acc[set.workoutExerciseId] = [];
        }
        acc[set.workoutExerciseId].push(set);
        return acc;
      }, {});

    return {
      day,
      exercises,
      setsByExerciseId,
    };
  },

  async getWorkoutDetailsWithExerciseInfo(
    trainingDayId: string,
  ): Promise<
    Omit<WorkoutDetails, "exercises"> & { exercises: WorkoutExerciseWithName[] }
  > {
    const [details, allExercises] = await Promise.all([
      this.getWorkoutDetails(trainingDayId),
      ExerciseRepository.getAll(),
    ]);

    const exerciseNameById = allExercises.reduce<Record<string, string>>(
      (acc, exercise) => {
        acc[exercise.id] = exercise.name;
        return acc;
      },
      {},
    );

    const exercisesWithName = details.exercises.map((workoutExercise) => ({
      ...workoutExercise,
      name:
        exerciseNameById[workoutExercise.exerciseId] ??
        workoutExercise.exerciseId,
    }));

    return {
      day: details.day,
      setsByExerciseId: details.setsByExerciseId,
      exercises: exercisesWithName,
    };
  },

  async resetToSeed(): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.trainingDays, JSON.stringify(SAMPLE_TRAINING_DAYS)],
        [
          STORAGE_KEYS.workoutExercises,
          JSON.stringify(SAMPLE_WORKOUT_EXERCISES),
        ],
        [STORAGE_KEYS.workoutSets, JSON.stringify(SAMPLE_WORKOUT_SETS)],
      ]);
    } catch (error) {
      console.error("Error resetting workouts:", error);
      throw error;
    }
  },
};
