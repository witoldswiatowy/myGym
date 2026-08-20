import { ExerciseFormValues } from "@/src/components/exercises/add-exercise-modal";
import { Exercise } from "@/src/models/Exercise";

// Buduje domenowy model Exercise z danych formularza, generując unikalne id
export function createExerciseFromFormValues(
  values: ExerciseFormValues,
): Exercise {
  const baseId = values.nameEn.trim().toLowerCase().replace(/\s+/g, "_");
  const uniqueSuffix = Date.now().toString(36);

  return {
    id: baseId ? baseId + "_" + uniqueSuffix : "exercise_" + uniqueSuffix,
    name: values.name.trim(),
    nameEn: values.nameEn.trim(),
    primaryMuscleId: values.primaryMuscleId,
    secondaryMuscleIds: values.secondaryMuscleIds.filter(
      (id) => id !== values.primaryMuscleId,
    ),
    equipmentIds: values.equipmentIds,
    tagIds: values.tagIds,
  };
}
