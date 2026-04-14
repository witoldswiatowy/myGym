import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { styles } from "./layout.style";

export default function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const goToExercises = () => {
    closeMenu();
    router.push("/exercises");
  };

  const goToAboutMe = () => {
    closeMenu();
    router.push("/about-me");
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="workout/index"
          options={{
            title: "Workout",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "barbell" : "barbell-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history/index"
          options={{
            title: "History",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="planner/index"
          options={{
            title: "Planner",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="menu/index"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              openMenu();
            },
          }}
          options={{
            title: "Menu",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "menu" : "menu-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="exercises/index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="about-me/index"
          options={{
            href: null,
          }}
        />
      </Tabs>

      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.backdrop} onPress={closeMenu}>
          <View style={styles.sheet}>
            <Pressable style={styles.option} onPress={goToExercises}>
              <Text style={styles.optionText}>Exercises</Text>
            </Pressable>
            <Pressable style={styles.option} onPress={goToAboutMe}>
              <Text style={styles.optionText}>About Me</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
