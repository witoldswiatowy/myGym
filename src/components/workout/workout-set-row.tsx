import { localStyles } from "@/src/components/workout/workout.style";
import { Checkbox } from "expo-checkbox";
import { Pressable, Text, TextInput, View } from "react-native";

export type WorkoutSetType = "warmup" | "working" | "drop" | "failure";
export type WorkoutSetWeightUnit = "kg" | "lb";

export type WorkoutSetRowData = {
  id: string;
  type: WorkoutSetType;
  weight: string;
  weightUnit: WorkoutSetWeightUnit;
  reps: string;
  done: boolean;
};

type WorkoutSetRowProps = {
  set: WorkoutSetRowData;
  typeLabel: string;
  onOpenTypeSelect: () => void;
  onOpenWeightUnitSelect: () => void;
  onChangeWeight: (nextWeight: string) => void;
  onChangeReps: (nextReps: string) => void;
  onChangeDone: (done: boolean) => void;
};

export default function WorkoutSetRow({
  set,
  typeLabel,
  onOpenTypeSelect,
  onOpenWeightUnitSelect,
  onChangeWeight,
  onChangeReps,
  onChangeDone,
}: WorkoutSetRowProps) {
  return (
    <View style={localStyles.setRow}>
      <Pressable
        onPress={onOpenTypeSelect}
        style={({ pressed }) => [
          localStyles.typeSelectButton,
          localStyles.typeSelectButtonType,
          pressed && localStyles.typeSelectButtonPressed,
        ]}
      >
        <Text style={localStyles.typeSelectLabel}>{typeLabel}</Text>
      </Pressable>
      <TextInput
        value={set.weight}
        onChangeText={(text) => onChangeWeight(text.replace(/[^0-9.,]/g, ""))}
        keyboardType="decimal-pad"
        placeholder="0"
        style={localStyles.inlineNumberInput}
      />

      <Pressable
        onPress={onOpenWeightUnitSelect}
        style={({ pressed }) => [
          localStyles.typeSelectButton,
          localStyles.typeSelectButtonUnit,
          pressed && localStyles.typeSelectButtonPressed,
        ]}
      >
        <Text style={localStyles.typeSelectLabel}>{set.weightUnit}</Text>
      </Pressable>

      <Text style={localStyles.setText}> x </Text>

      <TextInput
        value={set.reps}
        onChangeText={(text) => onChangeReps(text.replace(/[^0-9]/g, ""))}
        keyboardType="number-pad"
        placeholder="0"
        style={localStyles.inlineNumberInput}
      />

      <Text style={localStyles.setText}>powt.</Text>
      <Checkbox
        style={localStyles.doneCheckbox}
        value={set.done}
        onValueChange={onChangeDone}
      />
    </View>
  );
}
