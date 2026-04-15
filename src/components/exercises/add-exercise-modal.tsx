import { localStyles } from "@/src/components/exercises/exercises.style";
import { EQUIPMENT } from "@/src/data/equipment.data";
import { MUSCLES } from "@/src/data/muscles.data";
import { TAGS } from "@/src/data/tags.data";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import ExerciseForm from "./exercise-form";

export interface ExerciseFormValues {
  name: string;
  nameEn: string;
  primaryMuscleId: string;
  secondaryMuscleIds: string[];
  equipmentIds: string[];
  tagIds: string[];
}

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (values: ExerciseFormValues) => void | Promise<void>;
}

export default function AddExerciseModal({
  visible,
  onClose,
  onSave,
}: AddExerciseModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={localStyles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={localStyles.modalSheet}>
          <View style={localStyles.modalHeader}>
            <Text style={localStyles.modalTitle}>Add Exercise</Text>
            <Pressable onPress={onClose}>
              <Text style={localStyles.modalCloseText}>Close</Text>
            </Pressable>
          </View>

          <ExerciseForm
            muscles={MUSCLES}
            equipment={EQUIPMENT}
            tags={TAGS}
            onCancel={onClose}
            onSave={onSave}
          />
        </View>
      </View>
    </Modal>
  );
}
