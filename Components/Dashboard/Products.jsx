import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import colors from "../Themes/colors";   

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function Products() {

    const navigation = useNavigation();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/allproducts`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>All Products</Text>

                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => navigation.navigate("Products")}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Image</Text>
                <Text style={styles.headerText}>Name</Text>
                <Text style={styles.headerText}>Price</Text>
                <Text style={styles.headerText}>Stock</Text>
            </View>

            {/* Table Rows */}
            {products.map(item => (
                <View key={item.id} style={styles.productRow}>
                    <Image source={{ uri: item.image_url }} style={styles.productImage} />
                    <Text style={styles.cellText}>{item.name}</Text>
                    <Text style={styles.cellText}>Rs {item.price}</Text>
                    <Text style={styles.cellText}>{item.stock}</Text>
                </View>
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    /* Main container */
    container: {
        backgroundColor: colors.cardsbackground,
        borderRadius: 12,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        margin: 10,
        width: '95%',
        alignSelf: 'center',
    },

    /* Header Row */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },

    viewAllButton: {
        backgroundColor: colors.primary,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
    },

    viewAllText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    /* Table Header */
    headerContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderBottomColor: colors.border,
        paddingVertical: 10,
        backgroundColor: colors.secondary,
        borderRadius: 6,
        marginTop: 5,
    },

    headerText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        color: colors.text,
        fontSize: 13,
    },

    /* Table Row */
    productRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },

    cellText: {
        flex: 1,
        textAlign: 'center',
        color: colors.text,
        fontSize: 12.5,
    },

    productImage: {
        width: 45,
        height: 45,
        borderRadius: 6,
        marginHorizontal: 8,
    },

});
