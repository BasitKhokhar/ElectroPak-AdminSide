import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates'; 

import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
export default function UpdateOnSaleProducts({ product, onClose, onUpdate }) {
    const [productDetails, setProductDetails] = useState({
        name: '',
        price: '',
        New_price:'',
        stock: '',
        subcategoryId: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (product) {
            setProductDetails({
                name: product.name,
                price: product.price.toString(),
                New_price: product.New_price.toString(),
                stock: product.stock.toString(),
                subcategoryId: product.subcategory_id.toString(),
                imageUrl: product.image_url
            });
        }
    }, [product]);

    const handleChange = (name, value) => {
        setProductDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        const updatedProduct = {
            ...productDetails,
            subcategory_id: productDetails.subcategoryId,
            image_url: productDetails.imageUrl
        };

        fetch(`${API_BASE_URL}/onsale_products/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct),
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                onUpdate(data);
                onClose();
                //    Updates.reloadAsync();
            })
            .catch(error => console.error('Error updating product:', error));
    };

    return (
        <Modal transparent animationType="slide" visible={!!product}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Update On Sale Product</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Product Name"
                        value={productDetails.name}
                        onChangeText={text => handleChange('name', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        value={productDetails.price}
                        keyboardType="numeric"
                        onChangeText={text => handleChange('price', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New_Price"
                        value={productDetails.New_price}
                        keyboardType="numeric"
                        onChangeText={text => handleChange('New_price', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Stock"
                        value={productDetails.stock}
                        keyboardType="numeric"
                        onChangeText={text => handleChange('stock', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Subcategory ID"
                        value={productDetails.subcategoryId}
                        keyboardType="numeric"
                        onChangeText={text => handleChange('subcategoryId', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Image URL"
                        value={productDetails.imageUrl}
                        onChangeText={text => handleChange('imageUrl', text)}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    updateButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});