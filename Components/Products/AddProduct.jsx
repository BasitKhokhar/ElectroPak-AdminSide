import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Constants from 'expo-constants';
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
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Add New Product</Text>
            <TextInput placeholder="Product Name" value={product.name} onChangeText={(text) => handleChange('name', text)} style={styles.input} />
            <TextInput placeholder="Price" value={product.price} onChangeText={(text) => handleChange('price', text)} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Subcategory ID" value={product.subcategory_id} onChangeText={(text) => handleChange('subcategory_id', text)} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Stock" value={product.stock} onChangeText={(text) => handleChange('stock', text)} style={styles.input} />
            
            {product.image && <Image source={{ uri: product.image }} style={{ width: 100, height: 100, alignSelf: 'center' }} />}
            <TouchableOpacity onPress={pickImage} style={styles.buttonimage}>
                <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Product</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    buttonimage:{ backgroundColor: 'green',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',},
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
};

export default AddProduct;
