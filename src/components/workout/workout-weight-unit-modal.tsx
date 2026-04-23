import { Modal, Pressable, Text, View } from "react-native";
import { localStyles } from "./workout.style";

type WeightUnit = "kg" | "lb";

const SET_WEIGHT_UNIT_OPTIONS: WeightUnit[] = ["kg", "lb"];

type WorkoutWeightUnitModalProps = {
  weightUnitSelectTarget: { exerciseId: string; setId: string } | null;
  setWeightUnitSelectTarget: React.Dispatch<
    React.SetStateAction<{ exerciseId: string; setId: string } | null>
  >;
  selectWeightUnit: (nextUnit: WeightUnit) => void;
};

export default function WorkoutWeightUnitModal({
  weightUnitSelectTarget,
  setWeightUnitSelectTarget,
  selectWeightUnit,
}: WorkoutWeightUnitModalProps) {
  return (
    <Modal
      transparent
      animationType="none"
      //bylo animationType="fade"
      //animacja może być zbędna dla tego typu wyboru, bo i tak jest szybki, a bez animacji jest bardziej responsywny
      //podomno nawet 200 ms może być zauważalne, a tu chcemy, żeby było jak najszybciej
      //po za tym przy szybkkim wyborze opcji, było zauważalne opóźnienie w zamykaniu modala, co mogło być frustrujące, więc zrezygnowałem z animacji
      visible={!!weightUnitSelectTarget}
      onRequestClose={() => setWeightUnitSelectTarget(null)}
    >
      <Pressable
        style={localStyles.typeModalBackdrop}
        onPress={() => setWeightUnitSelectTarget(null)}
      >
        <View style={localStyles.typeModalCard}>
          {SET_WEIGHT_UNIT_OPTIONS.map((unitOption) => (
            <Pressable
              key={unitOption}
              onPress={() => selectWeightUnit(unitOption)}
              style={localStyles.typeOptionRow}
            >
              <Text style={localStyles.typeOptionText}>{unitOption}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
