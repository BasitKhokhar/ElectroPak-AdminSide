import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import TrendingProducts from './TrendingProducts';
import OnSaleProducts from './OnSaleProducts';
import AllProducts from './Products';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
import { useNavigation } from '@react-navigation/native';
import colors from '../Themes/colors';

const Products = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshing(true);
        setRefreshKey(prev => prev + 1);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= 0) {
            handleRefresh();
        }
    };

    return (
        <ScrollView
            style={[styles.scrollView, { backgroundColor: colors.bodybackground }]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            showsVerticalScrollIndicator={false}
        >
            <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
                
                {/* 🔹 All Products Component */}
                <AllProducts refreshTrigger={refreshKey} />

                {/* 🔹 Add Product Button */}
                <TouchableOpacity
                    style={[styles.viewAllButton, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('AddProduct')}
                >
                    <Text style={[styles.viewAllText, { color: "#fff" }]}>
                        Add New Product
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Loading Overlay */}
            {refreshing && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 10, 
        paddingBottom: 70 
    },

    scrollView: { 
        flex: 1 
    },

    viewAllButton: {
        padding: 12,
        borderRadius: 10,
        width: '60%',
        alignSelf: 'center',
        marginVertical: 50,
        elevation: 3,
    },

    viewAllText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 16,
    },

    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        zIndex: 10,
    },
});

export default Products;
