import { Modal, Pressable, Text, View } from "react-native";
import { localStyles } from "./workout.style";

type SetType = "warmup" | "working" | "drop" | "failure";

const SET_TYPE_OPTIONS: SetType[] = ["warmup", "working", "drop", "failure"];

const SET_TYPE_LABEL: Record<SetType, string> = {
  warmup: "WarmUp",
  working: "Normal",
  drop: "Drop",
  failure: "Upadek",
};

type WorkoutSetRowModalProps = {
  typeSelectTarget: { exerciseId: string; setId: string } | null;
  setTypeSelectTarget: React.Dispatch<
    React.SetStateAction<{ exerciseId: string; setId: string } | null>
  >;
  selectSetType: (nextType: SetType) => void;
};

export default function WorkoutSetRowModal({
  typeSelectTarget,
  setTypeSelectTarget,
  selectSetType,
}: WorkoutSetRowModalProps) {
  return (
    <Modal
      transparent
      animationType="none" //
      visible={!!typeSelectTarget}
      onRequestClose={() => setTypeSelectTarget(null)}
    >
      <Pressable
        style={localStyles.typeModalBackdrop}
        onPress={() => setTypeSelectTarget(null)}
      >
        <View style={localStyles.typeModalCard}>
          {SET_TYPE_OPTIONS.map((typeOption) => (
            <Pressable
              key={typeOption}
              onPress={() => selectSetType(typeOption)}
              style={localStyles.typeOptionRow}
            >
              <Text style={localStyles.typeOptionText}>
                {SET_TYPE_LABEL[typeOption]} ({typeOption})
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
