import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import * as Updates from 'expo-updates'; 

import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const UpdateProduct = ({ product, onClose, onUpdate }) => {
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
                price: String(product.price),
                stock: String(product.stock),
                subcategoryId: String(product.subcategory_id),
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

    const handleSubmit = async () => {
        const updatedProduct = {
            name: productDetails.name,
            price: Number(productDetails.price),
            stock: Number(productDetails.stock),
            subcategory_id: Number(productDetails.subcategoryId),
            image_url: productDetails.imageUrl,
        };

        fetch(`${API_BASE_URL}/products/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(async (data) => {
                onUpdate(data);
                Alert.alert('Success', 'Product updated successfully');

                onClose();

                // Reload the app to apply changes
                try {
                    // await Updates.reloadAsync();
                } catch (error) {
                    console.error('Error reloading app:', error);
                }
            })
            .catch((error) => {
                console.error('Error updating product:', error);
                Alert.alert('Error', 'Failed to update product');
            });
    };

    return (
        <Modal transparent animationType="slide" visible={!!product}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Update Product</Text>
                    
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
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',
        marginRight: 10,
    },
    updateButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default UpdateProduct;
