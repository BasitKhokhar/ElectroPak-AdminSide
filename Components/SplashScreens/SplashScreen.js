import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Animatable from "react-native-animatable";

const SplashScreen = ({ navigation }) => {
  const fullText = "Welcome to Basit Sanitary Store App";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1)); // Add one letter at a time
      index++;
      if (index === fullText.length) clearInterval(interval); // Stop animation when done
    }, 100); // Speed of typing effect

    setTimeout(() => {
      navigation.replace("Main"); // Navigate to Main screen after delay
    }, 5000); // 4 seconds delay

    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeIn" duration={2000} style={styles.welcomeText}>
        {displayedText}
      </Animatable.Text>
      <ActivityIndicator size="large" color="#10B981" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" },
  welcomeText: { fontSize: 32, fontWeight: "bold", color: "#10B981", textAlign: "center" },
  loader: { marginTop: 20 },
});

export default SplashScreen;
