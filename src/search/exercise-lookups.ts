import { EQUIPMENT } from "@/src/data/equipment.data";
import { MUSCLE_GROUPS } from "@/src/data/muscle-groups.data";
import { MUSCLES } from "@/src/data/muscles.data";
import { TAGS } from "@/src/data/tags.data";

export interface ExerciseLookups {
  muscleNameById: Record<string, string>;
  muscleNameEnById: Record<string, string>;
  muscleGroupIndexById: Record<string, number>;
  muscleGroupIdByMuscleId: Record<string, string>;
  muscleColorById: Record<string, string>;
  equipmentNameById: Record<string, string>;
  tagNameById: Record<string, string>;
}

// Słowniki id -> nazwa/kolor budowane raz ze statycznych danych (MUSCLES, EQUIPMENT, TAGS...)
export function buildExerciseLookups(): ExerciseLookups {
  return {
    muscleNameById: Object.fromEntries(MUSCLES.map((m) => [m.id, m.name])),
    muscleNameEnById: Object.fromEntries(MUSCLES.map((m) => [m.id, m.nameEn])),
    muscleGroupIndexById: Object.fromEntries(
      MUSCLE_GROUPS.map((g, i) => [g.id, i]),
    ),
    muscleGroupIdByMuscleId: Object.fromEntries(
      MUSCLES.map((m) => [m.id, m.muscleGroupId]),
    ),
    muscleColorById: Object.fromEntries(MUSCLES.map((m) => [m.id, m.colorHex])),
    equipmentNameById: Object.fromEntries(EQUIPMENT.map((e) => [e.id, e.name])),
    tagNameById: Object.fromEntries(TAGS.map((t) => [t.id, t.name])),
  };
}
