import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
export default function OnSaleProducts() {
     const navigation = useNavigation();
    const [onSaleProducts, setOnSaleProducts] = useState([]);

    useEffect(() => {
        fetchOnSaleProducts();
    }, []);

    const fetchOnSaleProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/onsale_prdcts`); // Replace with your actual API URL
            const data = await response.json();
            setOnSaleProducts(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* View All Button */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>OnSale Products</Text>
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => navigation.navigate('Products')} // Navigate to "Products" screen
                >
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal>
                <View>
                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerText, styles.imageColumn]}>Image</Text>
                        <Text style={[styles.headerText, styles.nameColumn]}>Name</Text>
                        <Text style={[styles.headerText, styles.oldPriceColumn]}>Old Price</Text>
                        <Text style={[styles.headerText, styles.newPriceColumn]}>New Price</Text>
                        <Text style={[styles.headerText, styles.stockColumn]}>Stock</Text>
                    </View>

                    {/* Table Rows */}
                    <FlatList
                        data={onSaleProducts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.tableRow}>
                                <Image source={{ uri: item.image_url }} style={styles.productImage} />
                                <Text style={[styles.cell, styles.nameColumn]}>{item.name}</Text>
                                <Text style={[styles.cell, styles.oldPriceColumn]}>{item.price}</Text>
                                <Text style={[styles.cell, styles.newPriceColumn]}>{item.New_price}</Text>
                                <Text style={[styles.cell, styles.stockColumn]}>{item.stock}</Text>
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        margin: 10,
        width: '95%', // Takes 95% of screen width
        alignSelf: 'center', // Centers the container
        overflow: 'hidden',
    },
    headerContainer: {
        flexDirection: 'row', // Aligns items in a row
        justifyContent: 'space-between', // Spreads elements apart
        alignItems: 'center', // Aligns items vertically
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    viewAllText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tableContainer: {
        width: '100%',
        // Ensures full width inside container
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
        backgroundColor: '#f1f1f1',
        marginTop: 10, // To avoid overlap with "View All"
        width: '110%', // Ensures full width inside container
        justifyContent: 'space-between', // Distributes columns evenly
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1, // Flexible columns
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        width: '110%', // Ensures row takes full width of container
        justifyContent: 'space-between', // Distributes columns properly
    },
    cell: {
        fontSize: 12,
        textAlign: 'center',
        flex: 1, // Allows smooth column resizing
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    imageColumn: {
        flex: 1, // Adjusts image column size
    },
    nameColumn: {
        flex: 1,
        width: 70// More space for product name
    },
    oldPriceColumn: {
        flex: 1,
        color: 'red',
        textDecorationLine: 'line-through',
    },
    newPriceColumn: {
        flex: 1,
        color: 'green',
        fontWeight: 'bold',
    },
    stockColumn: {
        flex: 0.5, // Keeps stock column smaller
    },
});


