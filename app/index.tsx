import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../App.style";
import { ProfilCard } from "../components/ProfilCard/ProfilCard";

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.profileCard}>
        <ProfilCard
          firstName="Witold"
          lastName="Światowy"
          title="Software Engineer"
          age={30}
          car={{ brand: "Mustang", year: 1969 }}
          isOpenToWork={true}
          doSomething={() => console.log("Hello from ProfilCard!")}
        />
        <ProfilCard
          firstName="John"
          lastName="Doe"
          title="Product Manager"
          doSomething={() => console.log("Hello from ProfilCard!")}
        />
        <ProfilCard
          firstName="Jane"
          lastName="Smith"
          title="Designer"
          doSomething={() => console.log("Hello from ProfilCard!")}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
