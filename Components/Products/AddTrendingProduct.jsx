import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../firebase';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const storage = getStorage(app);

const AddTrendingProduct = () => {
    const [product, setProduct] = useState({
        name: '',
        image: null,
        price: '',
        subcategory_id: '',
        stock: ''
    });
    
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = async () => {
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
            const filename = product.image.substring(product.image.lastIndexOf('/') + 1);
            const storageRef = ref(storage, `TrendingProducts/${filename}`);
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
                    
                    const response = await fetch(`${API_BASE_URL}/api/trending_products`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newProduct),
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        Alert.alert("Success", data.message);
                        setProduct({ name: '', image: null, price: '', subcategory_id: '', stock: '' });
                    } else {
                        Alert.alert("Error", "Error adding product");
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
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Add New Trending Product</Text>
            <TextInput placeholder="Product Name" value={product.name} onChangeText={(value) => handleChange('name', value)} style={{ borderWidth: 1,borderColor: '#ccc', padding: 8, marginBottom: 10 }} />
            <TextInput placeholder="Price" value={product.price} keyboardType="numeric" onChangeText={(value) => handleChange('price', value)} style={{ borderWidth: 1,borderColor: '#ccc', padding: 8, marginBottom: 10 }} />
            <TextInput placeholder="Subcategory ID" value={product.subcategory_id} keyboardType="numeric" onChangeText={(value) => handleChange('subcategory_id', value)} style={{ borderWidth: 1,borderColor: '#ccc', padding: 8, marginBottom: 10 }} />
            <TextInput placeholder="Stock" value={product.stock} onChangeText={(value) => handleChange('stock', value)} style={{ borderWidth: 1,borderColor: '#ccc', padding: 8, marginBottom: 10 }} />

            <TouchableOpacity onPress={handleImageChange} style={{ marginBottom: 10, backgroundColor: 'green',borderRadius:5, padding: 10, alignItems: 'center' }}>
                <Text style={{ color: 'white',fontWeight:'bold' }}>Select Product Image</Text>
            </TouchableOpacity>

            {product.image && <Image source={{ uri: product.image }} style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 10 }} />}

            <Button title={loading ? "Uploading..." : "Add Product"} onPress={handleSubmit} disabled={loading} />
            {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 10 }} />}
        </View>
    );
};

export default AddTrendingProduct;
