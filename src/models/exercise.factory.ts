import { Exercise } from "@/src/models/Exercise";
import type { ExerciseFormValues } from "@/src/models/ExerciseFormValues";

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
