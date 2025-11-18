import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import UpdateTrendingProduct from './UpdateTrendingProduct';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
export default function TrendingProducts({ refreshTrigger }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        fetch(`${API_BASE_URL}/trending_products`)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, [refreshTrigger]);

    const handleDelete = (id) => {
        Alert.alert('Confirm', 'Are you sure you want to delete this product?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: () => {
                    fetch(`http://192.168.100.7:5005/trending_products/${id}`, { method: 'DELETE' })
                        .then(() => setProducts(products.filter(product => product.id !== id)))
                        .catch(error => Alert.alert('Error', error.message));
                },
                style: 'destructive',
            },
        ]);
    };

    const handleUpdate = (updatedProduct) => {
        setProducts(products.map(product => (product.id === updatedProduct.id ? updatedProduct : product)));
    };

    const indexOfLastProduct = currentPage * rowsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
    const currentProducts = products
        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / rowsPerPage);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Trending Products List</Text>
            <TextInput
                placeholder="Search by product name"
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={styles.searchInput}
            />
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Image</Text>
                <Text style={styles.headerText}>Name</Text>
                <Text style={styles.headerText}>Price</Text>
                <Text style={styles.headerText}>Stock</Text>
                <Text style={styles.headerText}>Actions</Text>
            </View>

            {currentProducts.map(product => (
                <View key={product.id} style={styles.productRow}>
                    <Image source={{ uri: product.image_url }} style={styles.cellImage} />
                    <Text style={styles.cellText}>{product.name}</Text>
                    <Text style={styles.cellText}>{product.price}</Text>
                    <Text style={styles.cellText}>{product.stock}</Text>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={() => setEditingProduct(product)}>
                            <FontAwesome name="edit" size={20} color="blue" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(product.id)}>
                            <FontAwesome name="trash" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <View style={styles.paginationContainer}>
                {[...Array(totalPages)].map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setCurrentPage(index + 1)}
                        style={[styles.pageButton, currentPage === index + 1 && styles.activePageButton]}
                    >
                        <Text style={[styles.pageButtonText, currentPage === index + 1 && styles.activePageText]}>{index + 1}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {editingProduct && (
                <UpdateTrendingProduct product={editingProduct} onClose={() => setEditingProduct(null)} onUpdate={handleUpdate} />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,paddingHorizontal:5,
        backgroundColor: '#DCDCDC',
        borderRadius:10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
        width: '60%',
        alignSelf: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
       backgroundColor: 'gray',
        paddingVertical: 10,
    },
    headerText: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    cellText: {
        flex: 1,
        textAlign: 'center',
    },
    cellImage: {
        width: 40,
        height: 45,
        borderRadius: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    pageButton: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: 'gray',
    },
    activePageButton: {
        backgroundColor: 'black',
    },
    pageButtonText: {
        color: '#000',
    },
    activePageText: {
        color: '#fff',
    },
});