import { Pressable, Text, View } from "react-native";
import { localStyles } from "./exercises.style";

type SortKey = "name" | "primaryMuscle" | "equipment" | "tags";
type SortDir = "asc" | "desc";

interface ExerciseTableHeaderProps {
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

export default function ExerciseTableHeader({
  sortKey,
  sortDir,
  onSort,
}: ExerciseTableHeaderProps) {
  const arrow = sortDir === "asc" ? " ▲" : " ▼";

  return (
    <View style={[localStyles.row, localStyles.headerRow]}>
      <Pressable
        style={[localStyles.cell, localStyles.colName]}
        onPress={() => onSort("name")}
      >
        <Text style={localStyles.headerText}>
          Exercise{sortKey === "name" ? arrow : ""}
        </Text>
      </Pressable>
      <Pressable
        style={[localStyles.cell, localStyles.colPrimary]}
        onPress={() => onSort("primaryMuscle")}
      >
        <Text style={localStyles.headerText}>
          Primary muscle{sortKey === "primaryMuscle" ? arrow : ""}
        </Text>
      </Pressable>
      <Text
        style={[
          localStyles.cell,
          localStyles.colSecondary,
          localStyles.headerText,
        ]}
      >
        Secondary muscles
      </Text>
      <Pressable
        style={[localStyles.cell, localStyles.colEquipment]}
        onPress={() => onSort("equipment")}
      >
        <Text style={localStyles.headerText}>
          Equipment{sortKey === "equipment" ? arrow : ""}
        </Text>
      </Pressable>
      <Pressable
        style={[localStyles.cell, localStyles.colTags]}
        onPress={() => onSort("tags")}
      >
        <Text style={localStyles.headerText}>
          Tags{sortKey === "tags" ? arrow : ""}
        </Text>
      </Pressable>
    </View>
  );
}
