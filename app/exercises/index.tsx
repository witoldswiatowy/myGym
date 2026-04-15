import { styles } from "@/app/app.style";
import { Screen } from "@/src/components/common/Screen";
import AddExerciseModal, {
  ExerciseFormValues,
} from "@/src/components/exercises/add-exercise-modal";
import ExerciseTableHeader from "@/src/components/exercises/exercise-table-header";
import ExerciseTableRow from "@/src/components/exercises/exercise-table-row";
import { localStyles } from "@/src/components/exercises/exercises.style";
import { EQUIPMENT } from "@/src/data/equipment.data";
import { MUSCLES } from "@/src/data/muscles.data";
import { TAGS } from "@/src/data/tags.data";
import { Exercise } from "@/src/models/Exercise";
import { ExerciseRepository } from "@/src/repositories/exercise.repository";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SortKey = "name" | "primaryMuscle" | "equipment" | "tags";
type SortDir = "asc" | "desc";

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    ExerciseRepository.getAll().then(setExercises);
  }, []);

  const muscleNameById = useMemo(
    () => Object.fromEntries(MUSCLES.map((m) => [m.id, m.name])),
    [],
  );

  const muscleColorById = useMemo(
    () => Object.fromEntries(MUSCLES.map((m) => [m.id, m.colorHex])),
    [],
  );

  const equipmentNameById = useMemo(
    () => Object.fromEntries(EQUIPMENT.map((e) => [e.id, e.name])),
    [],
  );

  const tagNameById = useMemo(
    () => Object.fromEntries(TAGS.map((t) => [t.id, t.name])),
    [],
  );

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedExercises = useMemo(() => {
    return [...exercises].sort((a, b) => {
      let valA: string;
      let valB: string;

      if (sortKey === "primaryMuscle") {
        valA = muscleNameById[a.primaryMuscleId] ?? "";
        valB = muscleNameById[b.primaryMuscleId] ?? "";
      } else if (sortKey === "equipment") {
        valA = equipmentNameById[a.equipmentIds[0]] ?? "";
        valB = equipmentNameById[b.equipmentIds[0]] ?? "";
      } else if (sortKey === "tags") {
        valA = tagNameById[a.tagIds[0]] ?? "";
        valB = tagNameById[b.tagIds[0]] ?? "";
      } else {
        valA = a.name;
        valB = b.name;
      }

      const cmp = valA.localeCompare(valB, "pl");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [
    exercises,
    sortKey,
    sortDir,
    muscleNameById,
    equipmentNameById,
    tagNameById,
  ]);

  async function handleSaveExercise(values: ExerciseFormValues) {
    const baseId = values.nameEn.trim().toLowerCase().replace(/\s+/g, "_");
    const uniqueSuffix = Date.now().toString(36);

    const newExercise: Exercise = {
      id: baseId ? baseId + "_" + uniqueSuffix : "exercise_" + uniqueSuffix,
      name: values.name.trim(),
      nameEn: values.nameEn.trim(),
      primaryMuscleId: values.primaryMuscleId,
      secondaryMuscleIds: values.secondaryMuscleIds.filter(
        (id) => id !== values.primaryMuscleId,
      ),
      equipmentIds: values.equipmentIds,
      tagIds: values.tagIds,
    };

    await ExerciseRepository.add(newExercise);
    setExercises((prev) => [...prev, newExercise]);
    setIsAddModalVisible(false);
  }

  return (
    <Screen>
      <View style={[styles.headerLogoContainer, { paddingTop: insets.top }]}>
        <Image
          source={require("@/assets/images/myGym.png")}
          style={styles.logoImageSmall}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.headerTitle}>Exercise Library</Text>

      <View style={localStyles.content}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <ExerciseTableHeader
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <FlatList
              data={sortedExercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ExerciseTableRow
                  exercise={item}
                  muscleNameById={muscleNameById}
                  muscleColorById={muscleColorById}
                  equipmentNameById={equipmentNameById}
                  tagNameById={tagNameById}
                />
              )}
            />
          </View>
        </ScrollView>

        <Pressable
          style={({ pressed }) => [
            localStyles.addButton,
            pressed && localStyles.addButtonPressed,
          ]}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Text style={localStyles.addButtonText}>+ Add exercise</Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            await ExerciseRepository.resetToSeed();
            const fresh = await ExerciseRepository.getAll();
            setExercises(fresh);
          }}
        >
          <Text>Reset do seed</Text>
        </Pressable>
      </View>

      <AddExerciseModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSave={handleSaveExercise}
      />
    </Screen>
  );
}
