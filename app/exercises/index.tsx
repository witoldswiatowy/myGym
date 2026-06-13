import { Screen } from "@/src/components/common/Screen";
import AddExerciseModal, {
  ExerciseFormValues,
} from "@/src/components/exercises/add-exercise-modal";
import ExerciseTableHeader from "@/src/components/exercises/exercise-table-header";
import ExerciseTableRow from "@/src/components/exercises/exercise-table-row";
import { localStyles } from "@/src/components/exercises/exercises.style";
import { EQUIPMENT } from "@/src/data/equipment.data";
import { MUSCLE_GROUPS } from "@/src/data/muscle-groups.data";
import { MUSCLES } from "@/src/data/muscles.data";
import { TAGS } from "@/src/data/tags.data";
import { useDebouncedValue } from "@/src/hooks/use-debounced-value";
import { Exercise } from "@/src/models/Exercise";
import { ExerciseRepository } from "@/src/repositories/exercise.repository";
import { filterExercises } from "@/src/search/filter-exercises";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type SortKey = "name" | "primaryMuscle" | "equipment" | "tags";
type SortDir = "asc" | "desc";

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 200);

  useEffect(() => {
    ExerciseRepository.getAll().then(setExercises);
  }, []);

  const muscleNameById = useMemo(
    () => Object.fromEntries(MUSCLES.map((m) => [m.id, m.name])),
    [],
  );

  const muscleNameEnById = useMemo(
    () => Object.fromEntries(MUSCLES.map((m) => [m.id, m.nameEn])),
    [],
  );

  const muscleGroupIndexById = useMemo(
    () => Object.fromEntries(MUSCLE_GROUPS.map((g, i) => [g.id, i])),
    [],
  );

  const muscleGroupIdByMuscleId = useMemo(
    () => Object.fromEntries(MUSCLES.map((m) => [m.id, m.muscleGroupId])),
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

  const filteredExercises = useMemo(
    () =>
      filterExercises(exercises, {
        query: debouncedSearchQuery,
        muscleNameById,
        muscleNameEnById,
      }),
    [exercises, debouncedSearchQuery, muscleNameById, muscleNameEnById],
  );

  const sortedExercises = useMemo(() => {
    return [...filteredExercises].sort((a, b) => {
      if (sortKey === "primaryMuscle") {
        const groupIdA = muscleGroupIdByMuscleId[a.primaryMuscleId] ?? "";
        const groupIdB = muscleGroupIdByMuscleId[b.primaryMuscleId] ?? "";

        const groupIndexA = muscleGroupIndexById[groupIdA] ?? 999;
        const groupIndexB = muscleGroupIndexById[groupIdB] ?? 999;

        if (groupIndexA !== groupIndexB) {
          const groupCmp = groupIndexA - groupIndexB;
          return sortDir === "asc" ? groupCmp : -groupCmp;
        }

        const muscleNameA = muscleNameById[a.primaryMuscleId] ?? "";
        const muscleNameB = muscleNameById[b.primaryMuscleId] ?? "";
        const muscleCmp = muscleNameA.localeCompare(muscleNameB, "pl");
        return sortDir === "asc" ? muscleCmp : -muscleCmp;
      }

      let valA: string;
      let valB: string;

      if (sortKey === "equipment") {
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
    filteredExercises,
    sortKey,
    sortDir,
    muscleNameById,
    muscleGroupIdByMuscleId,
    muscleGroupIndexById,
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
    <Screen title="Exercise Library">
      <View style={localStyles.content}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Szukaj: ćwiczenie, mięsień, alias..."
          placeholderTextColor="#98A2B3"
          autoCorrect={false}
          autoCapitalize="none"
          style={localStyles.searchInput}
        />

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
              ListEmptyComponent={
                <Text style={localStyles.noResultsText}>No results found</Text>
              }
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
