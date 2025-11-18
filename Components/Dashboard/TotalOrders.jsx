import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const screenWidth = Dimensions.get('window').width;

const TotalOrders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/totalOrders`)
      .then(response => response.json())
      .then(data => {
        setOrdersData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders data:', error);
        setLoading(false);
      });
  }, []);

  const displayEveryNth = 3; // Show every 3rd label

  const chartData = {
    labels: ordersData.map((item, index) =>
      index % displayEveryNth === 0 ? item.date.substring(5) : ''
    ),
    datasets: [
      {
        data: ordersData.map(item => parseInt(item.total_orders)),
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const dynamicWidth = ordersData.length * 40; // Each point ~40px apart

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
          Last Month's Orders
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6384" />
        ) : (
          <ScrollView horizontal>
            <LineChart
              data={chartData}
              width={Math.max(dynamicWidth, screenWidth - 40)}
              height={180}
              yAxisLabel=""
              chartConfig={{
                backgroundGradientFrom: '#0D47A1',
                backgroundGradientTo: '#1976D2',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 10 },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#FF6384',
                },
              }}
              style={{ borderRadius: 10 }}
              bezier
            />
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

export default TotalOrders;
