import React, { useEffect } from "react";
import { View, ScrollView, Text, FlatList, StyleSheet } from "react-native";
import UserNameDisplay from "./User/UserNameDisplay";
import TotalSales from "./Dashboard/TotalSales";
import TotalOrders from "./Dashboard/TotalOrders";
import TotalUsers from "./Dashboard/TotalUsers";
import OnSaleProducts from "./Dashboard/OnSaleProducts";
import TrendingProducts from "./Dashboard/TrendingPrdct";
import Products from "./Dashboard/Products";
import DashboardOrders from "./Dashboard/dashboardOrders";
const HomeScreen = ({ navigation }) => {
  // useEffect(() => {
  //   if (navigation) {
  //     navigation.setOptions({ headerShown: false });
  //   }
  // }, [navigation]);

  // const sections = [
  //   { key: "UserName", component: (
  //     <View >
  //       <Text style={{ marginVertical:20,marginHorizontal:15 }}>
  //         <UserNameDisplay />
  //       </Text>
  //     </View>
  //   ) },
  //   { key: "Totalsales", component: (
  //     <View style={{ marginTop: 0 }}> 
  //       <TotalSales/>
  //     </View>
  //   ) },
  //   { key: "Totalorders", component: <TotalOrders /> },
  //   { key: "totalusers", component: <TotalUsers /> },
  //   { key: "fewproducts", component: <Products /> },
  //   { key: "fewonsaleproducts", component: <OnSaleProducts /> },
  //   { key: "fewontrendingproducts", component: <TrendingProducts /> },
  //   { key: "DashboardOrders", component: <DashboardOrders /> },
  // ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{ marginVertical:20,marginHorizontal:15 }} >
        <UserNameDisplay />
      </View>

      <TotalSales />
      <TotalOrders />
      <TotalUsers />
      <Products />
      {/* <OnSaleProducts />
      <TrendingProducts /> */}
      <DashboardOrders />
    </ScrollView>
    // <FlatList
    //   data={sections}
    //   showsVerticalScrollIndicator={false}
    //   renderItem={({ item }) => item.component}
    //   keyExtractor={(item) => item.key}
    //   contentContainerStyle={styles.listContainer} // Ensures everything is spaced properly
    // />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 90, 
  },
  trendingContainer: {
    marginBottom: 0,
    padding: 10,
    backgroundColor: "#f8f8f8", 
    borderRadius: 10, 
    elevation: 3, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default HomeScreen;
