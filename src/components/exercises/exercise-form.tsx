import { localStyles } from "@/src/components/exercises/exercises.style";
import { Equipment } from "@/src/models/Equipment";
import type { ExerciseFormValues } from "@/src/models/ExerciseFormValues";
import { Muscle } from "@/src/models/Muscle";
import { Tag } from "@/src/models/Tag";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

interface ExerciseFormProps {
  muscles: Muscle[];
  equipment: Equipment[];
  tags: Tag[];
  onCancel: () => void;
  onSave: (values: ExerciseFormValues) => void | Promise<void>;
}

function toggleSelection(currentValues: string[], targetId: string): string[] {
  if (currentValues.includes(targetId)) {
    return currentValues.filter((id) => id !== targetId);
  }

  return [...currentValues, targetId];
}

export default function ExerciseForm({
  muscles,
  equipment,
  tags,
  onCancel,
  onSave,
}: ExerciseFormProps) {
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [primaryMuscleId, setPrimaryMuscleId] = useState(muscles[0]?.id ?? "");
  const [secondaryMuscleIds, setSecondaryMuscleIds] = useState<string[]>([]);
  const [equipmentIds, setEquipmentIds] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(
    () =>
      name.trim().length > 0 &&
      nameEn.trim().length > 0 &&
      primaryMuscleId.length > 0,
    [name, nameEn, primaryMuscleId],
  );

  async function handleSave() {
    if (!isValid || submitting) {
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        name,
        nameEn,
        primaryMuscleId,
        secondaryMuscleIds,
        equipmentIds,
        tagIds,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={localStyles.formContent}
    >
      <View style={localStyles.formFieldGroup}>
        <Text style={localStyles.formLabel}>Nazwa cwiczenia (PL)</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="np. wyciskanie hantli"
          style={localStyles.formInput}
        />
      </View>

      <View style={localStyles.formFieldGroup}>
        <Text style={localStyles.formLabel}>Name of exercise (EN)</Text>
        <TextInput
          value={nameEn}
          onChangeText={setNameEn}
          placeholder="e.g. dumbbell press"
          style={localStyles.formInput}
        />
      </View>

      <View style={localStyles.formFieldGroup}>
        <Text style={localStyles.formLabel}>Primary muscle</Text>
        <View style={localStyles.formOptionsWrap}>
          {muscles.map((muscle) => {
            const selected = primaryMuscleId === muscle.id;
            return (
              <Pressable
                key={muscle.id}
                onPress={() => {
                  setPrimaryMuscleId(muscle.id);
                  setSecondaryMuscleIds((current) =>
                    current.filter((id) => id !== muscle.id),
                  );
                }}
                style={[
                  localStyles.formChip,
                  selected && localStyles.formChipSelected,
                ]}
              >
                <Text
                  style={[
                    localStyles.formChipText,
                    selected && localStyles.formChipTextSelected,
                  ]}
                >
                  {muscle.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={localStyles.formFieldGroup}>
        <Text style={localStyles.formLabel}>Secondary muscles</Text>
        <View style={localStyles.formOptionsWrap}>
          {muscles.map((muscle) => {
            const selected = secondaryMuscleIds.includes(muscle.id);
            return (
              <Pressable
                key={muscle.id}
                onPress={() => {
                  if (muscle.id === primaryMuscleId) {
                    return;
                  }

                  setSecondaryMuscleIds((current) =>
                    toggleSelection(current, muscle.id),
                  );
                }}
                style={[
                  localStyles.formChip,
                  selected && localStyles.formChipSelected,
                ]}
              >
                <Text
                  style={[
                    localStyles.formChipText,
                    selected && localStyles.formChipTextSelected,
                  ]}
                >
                  {muscle.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={localStyles.formFieldGroup}>
        <Text style={localStyles.formLabel}>Equipment</Text>
        <View style={localStyles.formOptionsWrap}>
          {equipment.map((item) => {
            const selected = equipmentIds.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() =>
                  setEquipmentIds((current) =>
                    toggleSelection(current, item.id),
                  )
                }
                style={[
                  localStyles.formChip,
                  selected && localStyles.formChipSelected,
                ]}
              >
                <Text
                  style={[
                    localStyles.formChipText,
                    selected && localStyles.formChipTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={localStyles.formFieldGroup}>
        <Text style={localStyles.formLabel}>Tags</Text>
        <View style={localStyles.formOptionsWrap}>
          {tags.map((item) => {
            const selected = tagIds.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() =>
                  setTagIds((current) => toggleSelection(current, item.id))
                }
                style={[
                  localStyles.formChip,
                  selected && localStyles.formChipSelected,
                ]}
              >
                <Text
                  style={[
                    localStyles.formChipText,
                    selected && localStyles.formChipTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={localStyles.formButtonsRow}>
        <Pressable style={localStyles.formCancelButton} onPress={onCancel}>
          <Text style={localStyles.formCancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[
            localStyles.formSaveButton,
            (!isValid || submitting) && localStyles.formSaveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!isValid || submitting}
        >
          <Text style={localStyles.formSaveButtonText}>
            {submitting ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
