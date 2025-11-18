import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import colors from "../Themes/colors";   // ✅ THEME IMPORT

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserNameDisplay = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");

      if (storedUserId) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/${storedUserId}`);
          if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {userData ? (
        <>
          <Text style={[styles.text, { color: colors.cardsbackground }]}>
            Welcome, {userData.Name}!
          </Text>

          <Image
            source={{ uri: userData.image_url }}
            style={[
              styles.profileImage,
              { borderColor: colors.cardsbackground }
            ]}
          />
        </>
      ) : (
        <Text style={[styles.text, { color: colors.cardsbackground }]}>
          Loading...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    elevation: 2,
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
  },

  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default UserNameDisplay;
