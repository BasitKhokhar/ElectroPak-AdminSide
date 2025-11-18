import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Constants from 'expo-constants';
import { colors } from "../Themes/colors";   // <<--- THEME IMPORT

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        price: '',
        subcategory_id: '',
        stock: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setProduct({ ...product, [name]: value });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setProduct({ ...product, image: result.assets[0].uri });
        }
    };

    const handleSubmit = async () => {
        if (!product.image) {
            Alert.alert("Error", "Please select an image");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(product.image);
            const blob = await response.blob();
            const storageRef = ref(storage, `Newitems/${new Date().toISOString()}`);
            const uploadTask = uploadBytesResumable(storageRef, blob);
            
            uploadTask.on(
                "state_changed",
                null,
                (error) => {
                    console.error("Upload error:", error);
                    setLoading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const newProduct = {
                        name: product.name,
                        image_url: downloadURL,
                        price: product.price,
                        subcategory_id: product.subcategory_id,
                        stock: product.stock,
                    };

                    const apiResponse = await fetch(`${API_BASE_URL}/api/products`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newProduct),
                    });

                    if (apiResponse.ok) {
                        const data = await apiResponse.json();
                        Alert.alert("Success", data.message);
                        setProduct({ name: '', price: '', subcategory_id: '', stock: '', image: null });
                    } else {
                        Alert.alert("Error", "Failed to add product");
                    }
                    setLoading(false);
                }
            );
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 20, backgroundColor: colors.bodybackground, flex: 1 }}>
            <Text style={{ 
                fontSize: 20, 
                fontWeight: 'bold', 
                textAlign: 'center', 
                marginBottom: 10,
                color: colors.text 
            }}>
                Add New Product
            </Text>

            <TextInput 
                placeholder="Product Name"
                value={product.name}
                onChangeText={(text) => handleChange('name', text)}
                style={styles.input}
                placeholderTextColor={colors.mutedText}
            />

            <TextInput 
                placeholder="Price"
                value={product.price}
                onChangeText={(text) => handleChange('price', text)}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={colors.mutedText}
            />

            <TextInput 
                placeholder="Subcategory ID"
                value={product.subcategory_id}
                onChangeText={(text) => handleChange('subcategory_id', text)}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={colors.mutedText}
            />

            <TextInput 
                placeholder="Stock"
                value={product.stock}
                onChangeText={(text) => handleChange('stock', text)}
                style={styles.input}
                placeholderTextColor={colors.mutedText}
            />
            
            {product.image && (
                <Image 
                    source={{ uri: product.image }} 
                    style={{ width: 100, height: 100, alignSelf: 'center', marginVertical: 10 }} 
                />
            )}

            {/* Image Button */}
            <TouchableOpacity onPress={pickImage} style={styles.buttonSecondary}>
                <Text style={styles.buttonSecondaryText}>Select Image</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity onPress={handleSubmit} style={styles.buttonPrimary} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : (
                    <Text style={styles.buttonPrimaryText}>Add Product</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        padding: 12,
        marginVertical: 6,
        borderRadius: 8,
        backgroundColor: colors.cardsbackground,
        color: colors.text,
    },

    buttonSecondary: { 
        backgroundColor: colors.secondary,
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },

    buttonSecondaryText: {
        color: colors.accent,
        fontSize: 16,
        fontWeight: '600',
    },

    buttonPrimary: {
        backgroundColor: colors.primary,
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },

    buttonPrimaryText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold',
    }
};

export default AddProduct;
