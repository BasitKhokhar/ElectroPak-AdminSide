import React, { useState } from "react";
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity, Button, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const colors = ["White", "Half White", "Chrome", "Light Pink", "Light Grey", "Burgundy"];

const ProductModal = ({ product, onClose, userId }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleAddToCart = async () => {
    const productWithOptions = {
      ...product,
      selectedColor: selectedColor || "None", // Default to "None" if no color is selected
      quantity: 1,
      user_id: userId,
    };

    try {
      const response = await fetch("http://192.168.100.5:5004/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productWithOptions),
      });

      if (response.ok) {
        onClose();
      } else {
        console.error("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <FontAwesome name="times" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <Image source={{ uri: product.image_url }} style={styles.productImage} />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productStock}>Stock: {product.stock}</Text>
          <Text style={styles.productPrice}>Price: {product.price}</Text>

          {/* Color Selection */}
          <View style={styles.colorSelector}>
            <Text style={styles.label}>Select Color:</Text>
            <View style={styles.colorOptions}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorBox, selectedColor === color && styles.selectedColor]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text style={styles.colorText}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Button title="Add to Cart" onPress={handleAddToCart} color="#4CAF50" style={styles.cartbutton} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    backgroundColor: "#121212",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  productImage: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 10,
    resizeMode: "contain",
  },
  productName: { fontSize: width * 0.05, fontWeight: "bold", color: "#fff", marginVertical: 10, textAlign: "center" },
  productStock: { fontSize: width * 0.04, color: "#b0b0b0", textAlign: "center" },
  productPrice: { fontSize: width * 0.045, fontWeight: "bold", color: "#4CAF50", textAlign: "center" },
  colorSelector: {
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  colorBox: {
    backgroundColor: "#1e1e1e",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  selectedColor: {
    backgroundColor: "#4CAF50",
  },
  colorText: {
    color: "#fff",
    fontSize: width * 0.035,
  },
  cartbutton:{
    
  }
});

export default ProductModal;
