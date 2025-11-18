import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductModal from "../Products/ProductModal";

const Products = ({ route }) => {
  const { subcategoryId } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Error fetching userId from AsyncStorage:", error);
      }
    };
    
    fetchUserId();
    fetchProducts();
  }, [subcategoryId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://192.168.100.5:5004/subcategories/${subcategoryId}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Products</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 5, backgroundColor: "#fff", padding: 10, borderRadius: 10 }}>
              <Image source={{ uri: item.image_url }} style={{ width: "100%", height: 150, borderRadius: 10 }} />
              <Text style={{ fontSize: 16, fontWeight: "bold", marginVertical: 5 }}>{item.name}</Text>
              <Text style={{ fontSize: 14, color: "gray" }}>Rs.{item.price}</Text>
              <TouchableOpacity onPress={() => handleOpenModal(item)} style={{ alignSelf: "flex-end", marginTop: 5 }}>
                <FontAwesome name="shopping-cart" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          userId={userId} 
        />
      )}
    </View>
  );
};

export default Products;
