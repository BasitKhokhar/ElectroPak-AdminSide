import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';

const StatsDisplay = () => {
  const [totalSales, setTotalSales] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Total Sales
    fetch('http://192.168.100.7:5005/api/lastMonthSales')
      .then(response => response.json())
      .then(data => {
        setTotalSales(data.totalSales);
      })
      .catch(error => console.error('Error fetching total sales:', error));

    // Fetch Total Orders
    fetch('http://192.168.100.7:5005/api/totalOrders')
      .then(response => response.json())
      .then(data => {
        setTotalOrders(data.totalOrders);
      })
      .catch(error => console.error('Error fetching total orders:', error));

    // Fetch Total Users
    fetch('http://192.168.100.7:5005/api/totalUsers')
      .then(response => response.json())
      .then(data => {
        setTotalUsers(data.totalUsers);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching total users:', error));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Total Sales</Text>
        <Text style={styles.value}>${totalSales}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total Orders</Text>
        <Text style={styles.value}>{totalOrders}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total Users</Text>
        <Text style={styles.value}>{totalUsers}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white'
  },
  value: {
    fontSize: 18,
    color: 'white',
  },
});

export default StatsDisplay;
