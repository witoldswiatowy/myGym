import { Text, View } from "react-native";
import { localStyles } from "./exercises.style";

export default function ExerciseTableHeader() {
  return (
    <View style={[localStyles.row, localStyles.headerRow]}>
      <Text
        style={[localStyles.cell, localStyles.colName, localStyles.headerText]}
      >
        Exercise
      </Text>
      <Text
        style={[
          localStyles.cell,
          localStyles.colPrimary,
          localStyles.headerText,
        ]}
      >
        Primary muscle
      </Text>
      <Text
        style={[
          localStyles.cell,
          localStyles.colSecondary,
          localStyles.headerText,
        ]}
      >
        Secondary muscles
      </Text>
      <Text
        style={[
          localStyles.cell,
          localStyles.colEquipment,
          localStyles.headerText,
        ]}
      >
        Equipment
      </Text>
      <Text
        style={[localStyles.cell, localStyles.colTags, localStyles.headerText]}
      >
        Tags
      </Text>
    </View>
  );
}
