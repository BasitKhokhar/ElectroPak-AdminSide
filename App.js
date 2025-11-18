import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

import SignupScreen from "./Components/Authentication/Signup";
import LoginScreen from "./Components/Authentication/Login";
import HomeScreen from "./Components/Home";
import ProductsScreen from "./Components/Products/ProductsScreen";
import OrdersScreen from "./Components/Orders/OrdersScreen";
import CheckoutScreen from "./Components/Cart/CheckoutScreen";
import AddressScreen from "./Components/Cart/AddressScreen";
import PaymentScreen from "./Components/Cart/PaymentScreen";
import Categories from "./Components/Categories/Categories";
import Subcategories from "./Components/Categories/Subcategories";
import Products from "./Components/Categories/Products";
import SearchScreen from "./Components/Products/SearchScreen";
import SplashScreen1 from "./Components/SplashScreens/SplashScreen1";
import UserDetailsScreen from "./Components/Cart/UserDetailsScreen";
import UserScreen from "./Components/User/UserScreen";
import AccountDetailScreen from "./Components/User/AccountDetailScreen";
import CustomerSupportScreen from "./Components/User/CustomerSupportScreen";
import Technicians from "./Components/Technicians/Technicians";
import LogoutScreen from "./Components/User/LogoutScreen";
import AddProduct from "./Components/Products/AddProduct";
import AddTrendingProduct from "./Components/Products/AddTrendingProduct";
import AddOnSaleProduct from "./Components/Products/AddOnsleProduct";

import logoImage from "./assets/logo2.png";
import colors from "./Components/Themes/colors";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* ------------------------------
   MAIN LAYOUT
--------------------------------*/
const MainLayout = ({ navigation, children, cartCount, currentScreen }) => {
  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Image source={logoImage} style={styles.logo} />
      </View>

      <View style={styles.body}>{children}</View>

      {/* Bottom Tabs */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.primary,
            borderTopColor: colors.border,
          },
        ]}
      >
        {[
          { name: "Home", icon: "home" },
          { name: "Products", icon: "shopping-bag" },
          { name: "Orders", icon: "receipt-long" },
          { name: "Electricians", icon: "home-repair-service" },
          { name: "Setting", icon: "person" },
        ].map(({ name, icon }) => (
          <TouchableOpacity
            key={name}
            style={styles.footerButton}
            onPress={() => navigation.navigate(name)}
          >
            <Icon
              name={icon}
              size={26}
              color={
                currentScreen === name
                  ? colors.cardsbackground
                  : "rgba(255,255,255,0.6)"
              }
            />

            <Text
              style={{
                color:
                  currentScreen === name
                    ? colors.cardsbackground
                    : "rgba(255,255,255,0.6)",
                marginTop: 4,
                fontWeight: "600",
              }}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/* ------------------------------
   BOTTOM NAVIGATION
--------------------------------*/
const BottomTabs = ({ cartCount }) => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}>
      <Tab.Screen name="Home">
        {({ navigation }) => (
          <MainLayout navigation={navigation} cartCount={cartCount} currentScreen="Home">
            <HomeScreen />
          </MainLayout>
        )}
      </Tab.Screen>

      <Tab.Screen name="Products">
        {({ navigation }) => (
          <MainLayout navigation={navigation} cartCount={cartCount} currentScreen="Products">
            <ProductsScreen />
          </MainLayout>
        )}
      </Tab.Screen>

      <Tab.Screen name="Orders">
        {({ navigation }) => (
          <MainLayout navigation={navigation} cartCount={cartCount} currentScreen="Orders">
            <OrdersScreen />
          </MainLayout>
        )}
      </Tab.Screen>

      <Tab.Screen name="Electricians">
        {({ navigation }) => (
          <MainLayout navigation={navigation} cartCount={cartCount} currentScreen="Electricians">
            <Technicians />
          </MainLayout>
        )}
      </Tab.Screen>

      <Tab.Screen name="Setting">
        {({ navigation }) => (
          <MainLayout navigation={navigation} cartCount={cartCount} currentScreen="Setting">
            <UserScreen />
          </MainLayout>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

/* ------------------------------
          MAIN APP
--------------------------------*/
const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkLogin = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setInitialRoute(storedUserId ? "Main" : "Login");
    };

    checkLogin();
  }, []);

  // Show loading until we know where to navigate
  if (!initialRoute) {
    return <SplashScreen1 />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signup" component={SignupScreen} />

        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="Main">
          {(props) => <BottomTabs {...props} cartCount={cartCount} />}
        </Stack.Screen>

        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="AddressScreen" component={AddressScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="Subcategories" component={Subcategories} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
        <Stack.Screen name="AccountDetail" component={AccountDetailScreen} />
        <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="AddTrendingProduct" component={AddTrendingProduct} />
        <Stack.Screen name="AddOnsaleProduct" component={AddOnSaleProduct} />
        <Stack.Screen name="Logout" component={LogoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

/* ------------------------------
            STYLES
-------------------------------*/
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { width: 140, height: 50, resizeMode: "contain" },
  body: { flex: 1 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    paddingBottom: 30,
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerButton: { alignItems: "center" },
});
