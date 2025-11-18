import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';
import colors from "../Themes/colors";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const TotalUsers = () => {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom pie colors for more attractive bluish theme
  const pieColors = [
    "#89CFF0", "#0F5AD1", "#56CCF2", "#2F80ED",
    "#00C6FF", "#0B7DA0", "#89CFF0"
  ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/totalUsers`)
      .then(res => res.json())
      .then(data => {
        setUsersData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users data:', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const chartData = usersData.map((item, index) => ({
    name: formatDate(item.date),
    population: item.total_users,
    color: pieColors[index % pieColors.length],
    legendFontColor: colors.text,
    legendFontSize: 12,
  }));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bodybackground }}>
      <View style={{ padding: 20 }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 15,
          color: colors.text
        }}>
          User Registrations in the Last Month
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: colors.secondary,
              backgroundGradientTo: colors.cardsbackground,
              color: (opacity = 1) => `rgba(10, 10, 10, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
      </View>
    </ScrollView>
  );
};

export default TotalUsers;
