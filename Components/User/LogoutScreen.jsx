
// export default LogoutScreen;
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LogoutScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Remove the saved userId
      await AsyncStorage.removeItem("userId");

      // Reset the navigation stack so user cannot go back
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>
      <Text style={styles.text}>Are you sure you want to logout?</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Confirm Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center", 
    backgroundColor: "#f5f5f5", padding: 20
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  text: { fontSize: 18, marginBottom: 20, color: "#555" },
  logoutButton: {
    paddingVertical: 10, paddingHorizontal: 20,
    backgroundColor: "#ff4d4d", borderRadius: 5,
  },
  logoutText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default LogoutScreen;
