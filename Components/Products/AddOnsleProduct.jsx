import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../firebase';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
export default function AddOnSaleProduct() {
    const [product, setProduct] = useState({
        name: '',
        image: null,
        price: '',
        New_price: '',
        subcategory_id: '',
        stock: ''
    });
    const [loading, setLoading] = useState(false);
    const storage = getStorage(app);

    // Handle input changes
    const handleChange = (key, value) => {
        setProduct({ ...product, [key]: value });
    };

    // Pick image from gallery
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

    // Upload image to Firebase and submit product details
    const handleSubmit = async () => {
        if (!product.image) {
            Alert.alert("Please select an image");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(product.image);
            const blob = await response.blob();
            const storageRef = ref(storage, `OnSaleProducts/${Date.now()}`);
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
                        New_price: product.New_price,
                        subcategory_id: product.subcategory_id,
                        stock: product.stock,
                    };
                    
                    console.log("Sending product data:", newProduct);
                    const res = await fetch(`${API_BASE_URL}/api/onsale_products`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newProduct),
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        Alert.alert(data.message);
                        setProduct({ name: '', image: null, price: '', New_price: '', subcategory_id: '', stock: '' });
                    } else {
                        Alert.alert("Error adding product");
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Add On Sale Product</Text>
            <TextInput placeholder="Product Name" value={product.name} onChangeText={(value) => handleChange('name', value)} style={styles.input} />
            
            
            
            <TextInput placeholder="Old Price" value={product.price} onChangeText={(value) => handleChange('price', value)} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="New Price" value={product.New_price} onChangeText={(value) => handleChange('New_price', value)} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Subcategory ID" value={product.subcategory_id} onChangeText={(value) => handleChange('subcategory_id', value)} keyboardType="numeric" style={styles.input} />
            <TextInput placeholder="Stock" value={product.stock} onChangeText={(value) => handleChange('stock', value)} style={styles.input} />
            <TouchableOpacity onPress={pickImage} style={styles.buttonimage}>
                <Text style={{ color: 'white',fontWeight:'bold' }}>Pick an Image</Text>
            </TouchableOpacity>
            {product.image && <Image source={{ uri: product.image }} style={styles.image} />}
            <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: 'white', textAlign: 'center',fontWeight:'bold' }}>Add Product</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = {
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonimage:{ backgroundColor: 'green',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',},
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
};
