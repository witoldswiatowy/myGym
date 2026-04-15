import { EXERCISES } from "@/src/data/exercises.data";
import { Exercise } from "@/src/models/Exercise";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "exercises.v1";

export const ExerciseRepository = {
  async getAll(): Promise<Exercise[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(EXERCISES));
      return EXERCISES;
    } catch (error) {
      console.error("Error reading exercises from AsyncStorage:", error);
      return EXERCISES;
    }
  },

  async add(exercise: Exercise): Promise<void> {
    try {
      const currentExercises = await this.getAll();
      const updatedExercises = [...currentExercises, exercise];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExercises));
      console.log("Exercise added to AsyncStorage:", exercise);
    } catch (error) {
      console.error("Error adding exercise to AsyncStorage:", error);
      //return Promise.reject(error) to to samo co throw error; ale bardziej idiomatyczne dla async functions
      throw error;
    }
  },

  async resetToSeed(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(EXERCISES));
    } catch (error) {
      console.error("Error resetting exercises:", error);
      throw error;
    }
  },
};
