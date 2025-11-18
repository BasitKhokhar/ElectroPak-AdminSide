import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import UpdateProduct from './UpdateProduct';
import Constants from 'expo-constants';
import colors from '../Themes/colors';  // ✅ THEME COLORS

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const AllProducts = ({ refreshTrigger }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetch(`${API_BASE_URL}/products`)
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
                    fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' })
                        .then(response => response.json())
                        .then(data => {
                            Alert.alert(data.message);
                            setProducts(products.filter(product => product.id !== id));
                        })
                        .catch(error => Alert.alert('Error', error.message));
                },
                style: 'destructive',
            },
        ]);
    };

    const handleUpdate = (updatedProduct) => {
        setProducts(products.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
        ));
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;
    }

    return (
        <ScrollView style={[styles.scrollView, { backgroundColor: colors.bodybackground }]}>
            <View style={[styles.container, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>

                <Text style={[styles.title, { color: colors.text }]}>All Products List</Text>

                <TextInput
                    style={[
                        styles.searchInput,
                        { borderColor: colors.border, color: colors.text }
                    ]}
                    placeholder="Search by product name"
                    placeholderTextColor={colors.mutedText}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />

                <View style={[styles.row, styles.headerRow, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.cell, { flex: 2, color: colors.text }]}>Image</Text>
                    <Text style={[styles.cell, { flex: 3, color: colors.text }]}>Name</Text>
                    <Text style={[styles.cell, { flex: 2, color: colors.text }]}>Price</Text>
                    <Text style={[styles.cell, { flex: 2, color: colors.text }]}>Stock</Text>
                    <Text style={[styles.cell, { flex: 2, color: colors.text }]}>Subcat</Text>
                    <Text style={[styles.cell, { flex: 2, color: colors.text }]}>Actions</Text>
                </View>

                {displayedProducts.map((item) => (
                    <View key={item.id} style={[styles.row, { borderBottomColor: colors.border }]}>
                        <Image source={{ uri: item.image_url }} style={styles.productImage} />
                        <Text style={[styles.cell, { flex: 3, color: colors.text }]}>{item.name}</Text>
                        <Text style={[styles.cell, { flex: 2, color: colors.text }]}>{item.price}</Text>
                        <Text style={[styles.cell, { flex: 2, color: colors.text }]}>{item.stock}</Text>
                        <Text style={[styles.cell, { flex: 2, color: colors.text }]}>{item.subcategory_id}</Text>

                        <View style={[styles.cell, styles.actionButtons]}>
                            <TouchableOpacity onPress={() => setEditingProduct(item)}>
                                <FontAwesome name="edit" size={20} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <FontAwesome name="trash" size={20} color={colors.error} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {editingProduct && (
                    <UpdateProduct
                        product={editingProduct}
                        onClose={() => setEditingProduct(null)}
                        onUpdate={handleUpdate}
                    />
                )}

                {/* Pagination */}
                <View style={styles.paginationContainer}>
                    {[...Array(totalPages)].map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setCurrentPage(index + 1)}
                            style={[
                                styles.pageButton,
                                { backgroundColor: colors.secondary },
                                currentPage === index + 1 && { backgroundColor: colors.primary }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.pageButtonText,
                                    { color: colors.text },
                                    currentPage === index + 1 && { color: "#fff", fontWeight: 'bold' }
                                ]}
                            >
                                {index + 1}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: { flex: 1 },

    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 10,
        borderWidth: 1,
        paddingBottom: 10,
    },

    title: { 
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 20,
        alignSelf: 'center',
    },

    searchInput: { 
        borderWidth: 1,
        padding: 8,
        marginBottom: 10,
        borderRadius: 8,
        width: '70%',
        alignSelf: 'center',
    },

    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },

    headerRow: { 
        fontWeight: 'bold',
        paddingVertical: 10,
        borderRadius: 6,
        marginBottom: 5
    },

    cell: { 
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: 5,
    },

    productImage: { 
        width: 45,
        height: 50,
        borderRadius: 6,
        flex: 2
    },

    actionButtons: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        flex: 2 
    },

    paginationContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginVertical: 20 
    },

    pageButton: { 
        padding: 10, 
        marginHorizontal: 5, 
        borderRadius: 6 
    },

    pageButtonText: { 
        fontSize: 16 
    },
});

export default AllProducts;
