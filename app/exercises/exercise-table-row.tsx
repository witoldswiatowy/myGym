import { Exercise } from "@/src/models/Exercise";
import { Text, View } from "react-native";
import { localStyles } from "./exercises.style";

type ExerciseTableRowProps = {
  exercise: Exercise;
  muscleNameById: Record<string, string>;
  equipmentNameById: Record<string, string>;
  tagNameById: Record<string, string>;
};

export default function ExerciseTableRow({
  exercise,
  muscleNameById,
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

  return (
    <View style={localStyles.row}>
      <Text style={[localStyles.cell, localStyles.colName]}>
        {exercise.name}
      </Text>
      <Text style={[localStyles.cell, localStyles.colPrimary]}>
        {resolveName(exercise.primaryMuscleId, muscleNameById)}
      </Text>
      <Text style={[localStyles.cell, localStyles.colSecondary]}>
        {resolveMany(exercise.secondaryMuscleIds, muscleNameById)}
      </Text>
      <Text style={[localStyles.cell, localStyles.colEquipment]}>
        {resolveMany(exercise.equipmentIds, equipmentNameById)}
      </Text>
      <Text style={[localStyles.cell, localStyles.colTags]}>
        {resolveMany(exercise.tagIds, tagNameById)}
      </Text>
    </View>
  );
}
