import { Screen } from "@/src/components/common/Screen";
import AddExerciseModal from "@/src/components/exercises/add-exercise-modal";
import ExerciseTableHeader from "@/src/components/exercises/exercise-table-header";
import ExerciseTableRow from "@/src/components/exercises/exercise-table-row";
import { localStyles } from "@/src/components/exercises/exercises.style";
import { useExercisesScreen } from "@/src/hooks/use-exercises-screen";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ExercisesScreen() {
  const {
    exercises,
    lookups,
    sortKey,
    sortDir,
    searchQuery,
    setSearchQuery,
    isAddModalVisible,
    setIsAddModalVisible,
    handleSort,
    handleSaveExercise,
    handleResetToSeed,
  } = useExercisesScreen();

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
              data={exercises}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={localStyles.noResultsText}>No results found</Text>
              }
              renderItem={({ item }) => (
                <ExerciseTableRow
                  exercise={item}
                  muscleNameById={lookups.muscleNameById}
                  muscleColorById={lookups.muscleColorById}
                  equipmentNameById={lookups.equipmentNameById}
                  tagNameById={lookups.tagNameById}
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
        <Pressable onPress={handleResetToSeed}>
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
