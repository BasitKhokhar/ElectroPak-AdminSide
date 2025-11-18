import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';
import colors from "../Themes/colors";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const screenWidth = Dimensions.get('window').width;

const TotalSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lastMonthSales`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Last Month Sales:", data);  // ⬅ Console log full data
        setSalesData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching sales data:", err);
        setLoading(false);
      });
  }, []);

  // Format date (DD/MM)
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const chartLabels = salesData.map(item => formatDate(item.date));
  const chartValues = salesData.map(item => parseFloat(item.sales));

  // Dynamic width based on days
  const dynamicWidth = Math.max(screenWidth - 40, chartLabels.length * 60);

  return (
    <View style={{ padding: 20, backgroundColor: colors.bodybackground }}>
      <Text style={styles.header}>Last Month's Sales</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [
                {
                  data: chartValues,
                  color: () => colors.primary,
                  strokeWidth: 3,
                }
              ],
            }}

            width={dynamicWidth}
            height={200}

            bezier  // 🔵 Makes the smooth mountain shape

            withShadow={true}

            chartConfig={{
              backgroundGradientFrom: colors.secondary,
              backgroundGradientTo: colors.primary,
              decimalPlaces: 0,
              color: () => colors.primary,
              labelColor: () => colors.text,

              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: colors.accent,
              },

              fillShadowGradient: colors.primary, // mountain fill
              fillShadowGradientOpacity: 0.25,     // transparency
            }}

            style={{
              borderRadius: 16,
              marginTop: 10,
            }}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
    color: colors.text,
  },
});

export default TotalSales;
