import { Exercise } from "@/src/models/Exercise";
import { createExerciseFromFormValues } from "@/src/models/exercise.factory";
import type { ExerciseFormValues } from "@/src/models/ExerciseFormValues";
import { ExerciseRepository } from "@/src/repositories/exercise.repository";
import {
  buildExerciseLookups,
  ExerciseLookups,
} from "@/src/search/exercise-lookups";
import { filterExercises } from "@/src/search/filter-exercises";
import { SortDir, sortExercises, SortKey } from "@/src/search/sort-exercises";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "./use-debounced-value";

export function useExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 200);

  const lookups: ExerciseLookups = useMemo(() => buildExerciseLookups(), []);

  useEffect(() => {
    ExerciseRepository.getAll().then(setExercises);
  }, []);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filteredExercises = useMemo(
    () =>
      filterExercises(exercises, {
        query: debouncedSearchQuery,
        muscleNameById: lookups.muscleNameById,
        muscleNameEnById: lookups.muscleNameEnById,
      }),
    [exercises, debouncedSearchQuery, lookups],
  );

  const sortedExercises = useMemo(
    () => sortExercises(filteredExercises, sortKey, sortDir, lookups),
    [filteredExercises, sortKey, sortDir, lookups],
  );

  async function handleSaveExercise(values: ExerciseFormValues) {
    const newExercise = createExerciseFromFormValues(values);

    await ExerciseRepository.add(newExercise);
    setExercises((prev) => [...prev, newExercise]);
    setIsAddModalVisible(false);
  }

  async function handleResetToSeed() {
    await ExerciseRepository.resetToSeed();
    const fresh = await ExerciseRepository.getAll();
    setExercises(fresh);
  }

  return {
    exercises: sortedExercises,
    lookups,
    sortKey,
    sortDir,
    searchQuery,
    setSearchQuery,
    isAddModalVisible,
    setIsAddModalVisible,
    handleSort,
    handleSaveExercise,
    handleResetToSeed,
  };
}
