import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import colors from "../Themes/colors";  // ✅ THEME IMPORT

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function DashboardOrders() {

    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/feworders`)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Orders</Text>

                <TouchableOpacity 
                    style={styles.viewAllButton}
                    onPress={() => navigation.navigate('Orders')}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Image</Text>
                <Text style={styles.headerText}>Name</Text>
                <Text style={styles.headerText}>City</Text>
                <Text style={styles.headerText}>Total</Text>
                <Text style={styles.headerText}>Status</Text>
            </View>

            {/* Orders Rows */}
            {products.map(product => (
                <View key={product.order_id} style={styles.productRow}>
                    <Image source={{ uri: product.receipt_url }} style={styles.productImage} />
                    <Text style={styles.cellText}>{product.name}</Text>
                    <Text style={styles.cellText}>{product.city}</Text>
                    <Text style={styles.cellText}>{product.total_amount}</Text>

                    <Text 
                        style={[
                            styles.cellText, 
                            { 
                                color: product.status === "Delivered" ? "green" : colors.error,
                                fontWeight: "bold"
                            }
                        ]}
                    >
                        {product.status}
                    </Text>
                </View>
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
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

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
});
