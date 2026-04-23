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

type WorkoutSetTypeModalProps = {
  typeSelectTarget: { exerciseId: string; setId: string } | null;
  setTypeSelectTarget: React.Dispatch<
    React.SetStateAction<{ exerciseId: string; setId: string } | null>
  >;
  selectSetType: (nextType: SetType) => void;
};

export default function WorkoutSetTypeModal({
  typeSelectTarget,
  setTypeSelectTarget,
  selectSetType,
}: WorkoutSetTypeModalProps) {
  return (
    <Modal
      transparent
      animationType="none" //
      visible={!!typeSelectTarget}
      // typeSelectTarget pochodzi z index.tsx jako prop
      // Kiedy użytkownik kliknie przycisk typu w WorkoutSetRow,
      // setTypeSelectTarget({ exerciseId, setId }) zmienia stan w index.tsx
      // React re-renderuje ten komponent z nową wartością prop
      // !!typeSelectTarget konwertuje: null → false, obiekt → true
      // Gdy true, modal się wyświetla; gdy false, się chowa
      //-------------------------------
      // Modal otwiera się gdy typeSelectTarget != null
      // (usetkownk kliknął przycisk w WorkoutSetRow → setTypeSelectTarget ustawił wartość)
      // React re-renderuje → Modal dostaje nowy prop → widoczność zmienia się
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
