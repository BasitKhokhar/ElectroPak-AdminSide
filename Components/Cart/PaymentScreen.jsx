import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const navigation = useNavigation();

  // Function to check if an app is installed before opening
  const openApp = async (appUrl, fallbackUrl) => {
    try {
      const supported = await Linking.canOpenURL(appUrl);
      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        Alert.alert("App Not Found", `Please install the app or use the following link:\n${fallbackUrl}`);
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open the app.");
    }
  };

  // Open JazzCash
  const openJazzCash = () => {
    openApp('jazzcash://', 'https://www.jazzcash.com.pk/');
  };

  // Open EasyPaisa
  const openEasyPaisa = () => {
    openApp('easypaisa://', 'https://easypaisa.com.pk/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Payment Method</Text>

      <TouchableOpacity style={styles.paymentButton} onPress={openJazzCash}>
        <Text style={styles.paymentText}>Pay with JazzCash</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.paymentButton} onPress={openEasyPaisa}>
        <Text style={styles.paymentText}>Pay with EasyPaisa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  
  paymentButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center', marginBottom: 10 },
  paymentText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  backButton: { backgroundColor: '#000', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center', marginTop: 20 },
  backText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default PaymentScreen;
