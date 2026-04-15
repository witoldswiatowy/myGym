import { Exercise } from "@/src/models/Exercise";
import { Text, View } from "react-native";
import { localStyles } from "./exercises.style";

type ExerciseTableRowProps = {
  exercise: Exercise;
  muscleNameById: Record<string, string>;
  muscleColorById: Record<string, string>;
  equipmentNameById: Record<string, string>;
  tagNameById: Record<string, string>;
};

export default function ExerciseTableRow({
  exercise,
  muscleNameById,
  muscleColorById,
  equipmentNameById,
  tagNameById,
}: ExerciseTableRowProps) {
  function resolveName(id: string, dictionary: Record<string, string>) {
    return dictionary[id] ?? `Unknown (${id})`;
  }

  function resolveMany(ids: string[], dictionary: Record<string, string>) {
    if (ids.length === 0) {
      return "-";
    }
    return ids.map((id) => resolveName(id, dictionary)).join(", ");
  }

  function resolveColor(id: string) {
    return muscleColorById[id] ?? "#F2F4F7";
  }

  return (
    <View style={localStyles.row}>
      <Text style={[localStyles.cell, localStyles.colName]}>
        {exercise.name}
      </Text>
      <View
        style={[
          localStyles.cell,
          localStyles.colPrimary,
          localStyles.muscleCellWrap,
        ]}
      >
        <View
          style={[
            localStyles.muscleBadge,
            { backgroundColor: resolveColor(exercise.primaryMuscleId) },
          ]}
        >
          <Text style={localStyles.muscleBadgeText}>
            {resolveName(exercise.primaryMuscleId, muscleNameById)}
          </Text>
        </View>
      </View>
      <View
        style={[
          localStyles.cell,
          localStyles.colSecondary,
          localStyles.muscleCellWrap,
        ]}
      >
        {exercise.secondaryMuscleIds.length === 0 ? (
          <Text>-</Text>
        ) : (
          exercise.secondaryMuscleIds.map((muscleId) => (
            <View
              key={muscleId}
              style={[
                localStyles.muscleBadge,
                { backgroundColor: resolveColor(muscleId) },
              ]}
            >
              <Text style={localStyles.muscleBadgeText}>
                {resolveName(muscleId, muscleNameById)}
              </Text>
            </View>
          ))
        )}
      </View>
      <Text style={[localStyles.cell, localStyles.colEquipment]}>
        {resolveMany(exercise.equipmentIds, equipmentNameById)}
      </Text>
      <Text style={[localStyles.cell, localStyles.colTags]}>
        {resolveMany(exercise.tagIds, tagNameById)}
      </Text>
    </View>
  );
}
