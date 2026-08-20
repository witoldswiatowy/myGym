import { Exercise } from "@/src/models/Exercise";
import { ExerciseLookups } from "./exercise-lookups";

export type SortKey = "name" | "primaryMuscle" | "equipment" | "tags";
export type SortDir = "asc" | "desc";

function comparePrimaryMuscle(
  a: Exercise,
  b: Exercise,
  lookups: ExerciseLookups,
): number {
  const groupIdA = lookups.muscleGroupIdByMuscleId[a.primaryMuscleId] ?? "";
  const groupIdB = lookups.muscleGroupIdByMuscleId[b.primaryMuscleId] ?? "";

  const groupIndexA = lookups.muscleGroupIndexById[groupIdA] ?? 999;
  const groupIndexB = lookups.muscleGroupIndexById[groupIdB] ?? 999;

  if (groupIndexA !== groupIndexB) {
    return groupIndexA - groupIndexB;
  }

  const muscleNameA = lookups.muscleNameById[a.primaryMuscleId] ?? "";
  const muscleNameB = lookups.muscleNameById[b.primaryMuscleId] ?? "";
  return muscleNameA.localeCompare(muscleNameB, "pl");
}

function compareByField(
  a: Exercise,
  b: Exercise,
  sortKey: SortKey,
  lookups: ExerciseLookups,
): number {
  let valA: string;
  let valB: string;

  if (sortKey === "equipment") {
    valA = lookups.equipmentNameById[a.equipmentIds[0]] ?? "";
    valB = lookups.equipmentNameById[b.equipmentIds[0]] ?? "";
  } else if (sortKey === "tags") {
    valA = lookups.tagNameById[a.tagIds[0]] ?? "";
    valB = lookups.tagNameById[b.tagIds[0]] ?? "";
  } else {
    valA = a.name;
    valB = b.name;
  }

  return valA.localeCompare(valB, "pl");
}

export function sortExercises(
  exercises: Exercise[],
  sortKey: SortKey,
  sortDir: SortDir,
  lookups: ExerciseLookups,
): Exercise[] {
  const dirMultiplier = sortDir === "asc" ? 1 : -1;

  return [...exercises].sort((a, b) => {
    const cmp =
      sortKey === "primaryMuscle"
        ? comparePrimaryMuscle(a, b, lookups)
        : compareByField(a, b, sortKey, lookups);

    return cmp * dirMultiplier;
  });
}
