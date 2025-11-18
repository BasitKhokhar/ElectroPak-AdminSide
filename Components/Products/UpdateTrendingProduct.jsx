import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import * as Updates from 'expo-updates'; 

import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function UpdateTrendingProduct({ product, onClose, onUpdate }) {
    const [productDetails, setProductDetails] = useState({
        name: '',
        price: '',
        stock: '',
        subcategoryId: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (product) {
            setProductDetails({
                name: product.name,
                price: product.price.toString(),
                stock: product.stock.toString(),
                subcategoryId: product.subcategory_id.toString(),
                imageUrl: product.image_url
            });
        }
    }, [product]);

    const handleChange = (name, value) => {
        setProductDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        const updatedProduct = {
            name: productDetails.name,
            price: parseFloat(productDetails.price),
            stock: parseInt(productDetails.stock),
            subcategory_id: parseInt(productDetails.subcategoryId),
            image_url: productDetails.imageUrl,
        };

        fetch(`${API_BASE_URL}/trending_products/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        })
            .then((response) => response.json())
            .then((data) => {
                onUpdate(data);
                onClose();
                // Updates.reloadAsync();
            })
            .catch((error) => {
                console.error('Error updating product:', error);
            });
    };

    return (
        <Modal transparent={true} visible={true} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Update Trending Product</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Product Name"
                        value={productDetails.name}
                        onChangeText={(value) => handleChange('name', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        keyboardType="numeric"
                        value={productDetails.price}
                        onChangeText={(value) => handleChange('price', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Stock"
                        keyboardType="numeric"
                        value={productDetails.stock}
                        onChangeText={(value) => handleChange('stock', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Subcategory ID"
                        keyboardType="numeric"
                        value={productDetails.subcategoryId}
                        onChangeText={(value) => handleChange('subcategoryId', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Image URL"
                        value={productDetails.imageUrl}
                        onChangeText={(value) => handleChange('imageUrl', value)}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.updateButton]}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    updateButton: {
        backgroundColor: 'blue',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});