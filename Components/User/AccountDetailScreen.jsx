import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Import storage from the config file
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const AccountDetailScreen = ({ route }) => {
  const { userData } = route.params;
  const [uploading, setUploading] = useState(false);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImageToFirebase(result.assets[0].uri);
    }
  };

  // Upload image to Firebase and get URL
  const uploadImageToFirebase = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = await AsyncStorage.getItem("userId");
      const fileRef = ref(storage, `profileImages/${userId}.jpg`);

      await uploadBytes(fileRef, blob);
      const imageUrl = await getDownloadURL(fileRef);

      saveImageUrlToDatabase(userId, imageUrl);
    } catch (error) {
      console.error("Image upload error:", error);
    }
    setUploading(false);
  };

  // Save image URL in MySQL database
  const saveImageUrlToDatabase = async (userId, imageUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}/upload-profile-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, image_url: imageUrl }),
      });

      const data = await response.json();
      console.log("Image upload response:", data);
    } catch (error) {
      console.error("Error saving image URL:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Detail</Text>

      <TouchableOpacity onPress={pickImage} style={styles.uploadButton} disabled={uploading}>
        {uploading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.uploadText}>Upload Profile Image</Text>}
      </TouchableOpacity>

      <Text style={styles.text}>Name: {userData.Name}</Text>
      <Text style={styles.text}>Email: {userData.email}</Text>
      <Text style={styles.text}>Admin: {userData.admin}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  text: { fontSize: 18, marginVertical: 5, color: "#555" },
  uploadButton: { backgroundColor: "#007BFF", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginBottom: 20 },
  uploadText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default AccountDetailScreen;
