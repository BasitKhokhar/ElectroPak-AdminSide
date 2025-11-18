import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import colors from "../Themes/colors";
import Icon from "react-native-vector-icons/FontAwesome"; // 👈 Add icon library

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // 👈 Added for toggle

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateInputs = () => {
    setEmailError(!isValidEmail(email));
    setPasswordError(password.length < 8);
    return isValidEmail(email) && password.length >= 8;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.userId) {
          await AsyncStorage.setItem("userId", data.userId.toString());
          navigation.replace("Main");
        } else {
          Alert.alert("Error", "Invalid credentials");
        }
      })
      .catch(() => Alert.alert("Error", "Login failed"));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardsbackground,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Login</Text>

        {/* Email */}
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.mutedText}
          value={email}
          onChangeText={setEmail}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
            emailError && { borderColor: colors.error },
          ]}
          keyboardType="email-address"
        />

        {emailError && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            Invalid email format
          </Text>
        )}

        {/* Password with eye icon */}
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.mutedText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={[
              styles.input,
              styles.passwordInput,
              { borderColor: colors.border, color: colors.text },
              passwordError && { borderColor: colors.error },
            ]}
          />

          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon
              name={passwordVisible ? "eye-slash" : "eye"}
              size={20}
              color={colors.mutedText}
            />
          </TouchableOpacity>
        </View>

        {passwordError && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            Password must be at least 8 characters
          </Text>
        )}

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>Login</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
  },

  card: {
    padding: 25,
    borderRadius: 14,
    borderWidth: 1.2,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    padding: 13,
    paddingLeft: 15,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
  },

  passwordWrapper: {
    position: "relative",
    width: "100%",
  },

  passwordInput: {
    paddingRight: 45, // space for eye icon
  },

  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 22,
  },

  errorText: {
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
  },

  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default LoginScreen;
