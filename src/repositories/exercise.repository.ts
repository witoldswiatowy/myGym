import { EXERCISES } from "@/src/data/exercises.data";
import { Exercise } from "@/src/models/Exercise";

export const ExerciseRepository = {
  getAll(): Promise<Exercise[]> {
    return Promise.resolve(EXERCISES);
  },

  add(exercise: Exercise): Promise<void> {
    EXERCISES.push(exercise);
    return Promise.resolve();
  },
};
