import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems } = route.params;
  const [userId, setUserId] = useState(null);

  // Calculate subtotal, shipping charges, and total amount
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharges = subtotal < 200000 ? 5000 : 0;
  const totalAmount = subtotal + shippingCharges;

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);

  return (
    <View style={styles.container}>
  <FlatList
    showsVerticalScrollIndicator={false} 
    ListHeaderComponent={
      <>
        <Text style={styles.header}>All Items</Text>
      </>
    }
    data={cartItems}
    keyExtractor={(item) => item.cart_id.toString()}
    renderItem={({ item, index }) => (
      <View style={styles.cartItem}>
        <View style={styles.itemDetails}>
          <Text style={styles.itemNo}>{index + 1}.</Text>
          <Image source={{ uri: item.image_url }} style={styles.image} />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>Price: {item.price} Rupees</Text>
            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
          </View>
          <Text style={styles.itemTotal}>Total: {item.price * item.quantity} Rupees</Text>
        </View>
      </View>
    )}
    ListFooterComponent={
      <>
        {/* Price Summary */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Subtotal: {subtotal} Rupees</Text>
          <Text style={styles.priceText}>Shipping Charges: {shippingCharges} Rupees</Text>
          <Text style={styles.totalAmount}>Total: {totalAmount} Rupees</Text>
        </View>

        {/* Proceed to Payment */}
        <TouchableOpacity 
          style={styles.paymentButton} 
          onPress={() => navigation.navigate('PaymentScreen', { 
            user_id: userId, 
            subtotal, 
            shipping_charges: shippingCharges, 
            total_amount: totalAmount, 
            cart_items: cartItems 
          })}
        >
          <Text style={styles.paymentText}>Proceed to Payment</Text>
        </TouchableOpacity>

        {/* Enter User Details */}
        <TouchableOpacity 
          style={styles.formButton} 
          onPress={() => navigation.navigate('UserDetailsScreen', { 
            user_id: userId, 
            subtotal, 
            shipping_charges: shippingCharges, 
            total_amount: totalAmount, 
            cart_items: cartItems 
          })}
        >
          <Text style={styles.formButtonText}>Enter Details and Confirm Order</Text>
        </TouchableOpacity>
      </>
    }
  />
</View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: '#f9f9f9' 
  },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  cartItem: { backgroundColor: 'white', borderRadius: 10, padding: 10, marginBottom: 10 },
  itemTextContainer: { marginHorizontal: 10 },
  itemDetails: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 50, height: 50, borderRadius: 10 },
  priceContainer: { padding: 15, backgroundColor: '#fff', borderRadius: 10, marginVertical: 10 },
  priceText: { fontSize: 16, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#ff5733', marginTop: 5 },
  paymentButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  paymentText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  formButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  formButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#ff5733', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});


export default CheckoutScreen;
