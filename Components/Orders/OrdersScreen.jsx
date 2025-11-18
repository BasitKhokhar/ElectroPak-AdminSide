// import React, { useEffect, useState } from "react";
// import {
//   View, Text, Image, FlatList, TouchableOpacity,
//   ActivityIndicator, Modal, StyleSheet, Alert
// } from "react-native";
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// const OrdersScreen = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [orderDetails, setOrderDetails] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [imageModalVisible, setImageModalVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showStatusPicker, setShowStatusPicker] = useState(null);

//     const [refreshing, setRefreshing] = useState(false);
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/orders`);
//       const data = await response.json();
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       Alert.alert("Error", "Failed to load orders.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrderDetails = async (orderId) => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
//       const data = await response.json();
//       setOrderDetails(data);
//       setSelectedOrder(orderId);
//       setModalVisible(true);
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//       Alert.alert("Error", "Failed to load order details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openImageModal = (imageUrl) => {
//     setSelectedImage(imageUrl);
//     setImageModalVisible(true);
//   };

//   const updateStatus = async (orderId, newStatus) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/orders/status/${orderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         Alert.alert("Success", "Status updated successfully!");
//         fetchOrders(); // refresh orders
//       } else {
//         throw new Error(result.error || "Failed to update status.");
//       }
//     } catch (error) {
//       console.error("Status update error:", error);
//       Alert.alert("Error", "Could not update status.");
//     } finally {
//       setShowStatusPicker(null);
//     }
//   };


//   const downloadImage = async (imageUrl) => {
//     try {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert("Permission Required", "Allow media access to save images.");
//         return;
//       }

//       const fileUri = FileSystem.documentDirectory + imageUrl.split('/').pop();
//       const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
//       await MediaLibrary.createAssetAsync(uri);
//       Alert.alert("Download Complete", "Image saved successfully!");
//     } catch (error) {
//       console.error("Error downloading image:", error);
//       Alert.alert("Error", "Failed to download image.");
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchOrders();
//     setRefreshing(false);
// };
// const handleScroll = (event) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     if (offsetY <= 0) {
//         // User has scrolled to the top, trigger refresh
//         handleRefresh();
//     }
// };


//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>All Orders</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <FlatList
//         style={styles.flatList}
//           data={orders}
//           onScroll={handleScroll}
//           refreshing={refreshing}
//           onRefresh={handleRefresh}
//           showsVerticalScrollIndicator={false}
//           keyExtractor={(item) => item.order_id.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.orderItem}>
//               <View style={styles.row}>
//                 <View style={styles.column}>
//                   <Text style={styles.orderText}>Order ID: {item.order_id}</Text>
//                   <Text style={styles.orderText}>Name: {item.name}</Text>
//                   <Text style={styles.orderText}>Phone: {item.phone}</Text>
//                   <Text style={styles.orderText}>Address: {item.address}</Text>
//                   <Text style={styles.orderText}>Sub Total: {item.subtotal}</Text>
//                   <Text style={styles.orderText}>Shipping: {item.shipping_charges}</Text>
//                   <Text style={styles.orderText}>Total: {item.total_amount}</Text>
//                   <Text style={styles.orderText}>Status:</Text>
//                 </View>
//                 <View style={styles.column}>
//                   <TouchableOpacity onPress={() => openImageModal(item.receipt_url)}>
//                     <Image source={{ uri: item.receipt_url }} style={styles.image} />
//                   </TouchableOpacity>
//                 </View>

//               </View>
//               <View style={styles.row}>
              
//                 <TouchableOpacity
//                   onPress={() => setShowStatusPicker(item.order_id)}
//                   style={[styles.status, styles[item.status.toLowerCase().replace(' ', '')]]}
//                 >
//                   <Text style={styles.buttonText}>{item.status}</Text>
//                 </TouchableOpacity>

//                 {showStatusPicker === item.order_id && (
//                   <View style={styles.statusOptions}>
//                     {["In Progress", "Verified", "Completed"].map((statusOption) => (
//                       <TouchableOpacity
//                         key={statusOption}
//                         onPress={() => updateStatus(item.order_id, statusOption)}
//                         style={styles.optionButton}
//                       >
//                         <Text>{statusOption}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 )}
//                 {/* <Text style={[styles.status, styles[item.status.toLowerCase().replace(' ', '')]]}>
//                   {item.status}
//                 </Text> */}
//                 <TouchableOpacity
//                   style={styles.detailButton}
//                   onPress={() => fetchOrderDetails(item.order_id)}
//                 >
//                   <Text style={styles.buttonText}>Detail</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         />
//       )}

//       {/* Order Details Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Order Details (ID: {selectedOrder})</Text>
//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <FlatList
//                 data={orderDetails}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={({ item, index }) => (
//                   <View style={styles.detailItem}>
//                     <Text>{index + 1}    {item.name}   -   {item.quantity}   x   {item.price}</Text>
//                   </View>
//                 )}
//               />
//             )}
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.buttonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Image Full-Screen Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={imageModalVisible}
//         onRequestClose={() => setImageModalVisible(false)}
//       >
//         <View style={styles.imageModalContainer}>
//           <TouchableOpacity
//             style={styles.closeImageButton}
//             onPress={() => setImageModalVisible(false)}
//           >
//             {/* <Text style={styles.closeImageText}>✖</Text> */}
//           </TouchableOpacity>
//           <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
//           {/* <TouchableOpacity
//             style={styles.downloadButton}
//             onPress={() => downloadImage(selectedImage)}
//           >
//             <Text style={styles.buttonText}>Download</Text>
//           </TouchableOpacity> */}
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1,paddingBottom:100,paddingTop:10 },
//   heading: { alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
//   flatList:{paddingHorizontal:15,paddingTop:8},
//   row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
//   orderItem: {
//     padding: 15,
//     marginBottom: 20,
//     backgroundColor: "#f8f8f8",
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 2, height: 2 }, 
//     shadowRadius: 5, 
//     elevation: 5, 
//   },
//   orderText: { fontSize: 16, fontWeight: '600' },
//   image: { width: 100, height: 100, resizeMode: "cover", borderRadius: 5 },
//   status: { backgroundColor: 'green', color: 'white', fontWeight: "bold", alignSelf: 'center', padding: 10, borderRadius: 5 },
//   detailButton: { padding: 10, backgroundColor: "blue", borderRadius: 5, alignItems: "center", width: '30%' },
//   buttonText: { color: "white", fontWeight: "bold" },
//   modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
//   modalContent: { width: "90%", backgroundColor: "white", padding: 20, borderRadius: 10 },
//   modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
//   detailItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
//   closeButton: { marginTop: 20, padding: 10, backgroundColor: "red", borderRadius: 5, alignItems: "center" },
//   imageModalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
//   fullScreenImage: { width: "90%", height: "80%", resizeMode: "contain" },
//   closeImageButton: { position: "absolute", top: 40, right: 20 },
//   closeImageText: { color: "white", fontSize: 24 },
//   downloadButton: { marginTop: 20, padding: 10, backgroundColor: "green", borderRadius: 5, alignItems: "center" },
//   statusOptions: {
//     backgroundColor: "#f0f0f0",
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 5,
//   },
  
//   optionButton: {
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
// });

// export default OrdersScreen;
import React, { useEffect, useState } from "react";
import {
  View, Text, Image, FlatList, TouchableOpacity,
  ActivityIndicator, Modal, StyleSheet, Alert
} from "react-native";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Constants from 'expo-constants';
import colors from "../Themes/colors";  // 🔹 THEME IMPORT

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showStatusPicker, setShowStatusPicker] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      const data = await response.json();
      setOrderDetails(data);
      setSelectedOrder(orderId);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/status/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Status updated successfully!");
        fetchOrders();
      } else {
        throw new Error(result.error || "Failed to update status.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not update status.");
    } finally {
      setShowStatusPicker(null);
    }
  };

  const downloadImage = async (imageUrl) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Required", "Allow media access to save images.");
        return;
      }

      const fileUri = FileSystem.documentDirectory + imageUrl.split('/').pop();
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      await MediaLibrary.createAssetAsync(uri);

      Alert.alert("Download Complete", "Image saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to download image.");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    setRefreshing(false);
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) handleRefresh();
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <Text style={[styles.heading, { color: colors.text }]}>All Orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          style={styles.flatList}
          data={orders}
          onScroll={handleScroll}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.order_id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.orderItem, { backgroundColor: colors.cardsbackground, shadowColor: colors.border }]}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={[styles.orderText, { color: colors.text }]}>Order ID: {item.order_id}</Text>
                  <Text style={[styles.orderText, { color: colors.text }]}>Name: {item.name}</Text>
                  <Text style={[styles.orderText, { color: colors.text }]}>Phone: {item.phone}</Text>
                  <Text style={[styles.orderText, { color: colors.text }]}>Address: {item.address}</Text>
                  <Text style={[styles.orderText, { color: colors.text }]}>Sub Total: {item.subtotal}</Text>
                  <Text style={[styles.orderText, { color: colors.text }]}>Shipping: {item.shipping_charges}</Text>
                  <Text style={[styles.orderText, { color: colors.text }]}>Total: {item.total_amount}</Text>
                </View>

                <TouchableOpacity onPress={() => openImageModal(item.receipt_url)}>
                  <Image source={{ uri: item.receipt_url }} style={styles.image} />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => setShowStatusPicker(item.order_id)}
                  style={[styles.status, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.buttonText}>{item.status}</Text>
                </TouchableOpacity>

                {showStatusPicker === item.order_id && (
                  <View style={[styles.statusOptions, { backgroundColor: colors.secondary }]}>
                    {["In Progress", "Verified", "Completed"].map((statusOption) => (
                      <TouchableOpacity
                        key={statusOption}
                        onPress={() => updateStatus(item.order_id, statusOption)}
                        style={styles.optionButton}
                      >
                        <Text style={{ color: colors.text }}>{statusOption}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.detailButton, { backgroundColor: colors.accent }]}
                  onPress={() => fetchOrderDetails(item.order_id)}
                >
                  <Text style={styles.buttonText}>Detail</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Order Details Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardsbackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Order Details (ID: {selectedOrder})
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <FlatList
                data={orderDetails}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.detailItem}>
                    <Text style={{ color: colors.text }}>
                      {index + 1}. {item.name} - {item.quantity} x {item.price}
                    </Text>
                  </View>
                )}
              />
            )}

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.error }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Modal */}
      <Modal visible={imageModalVisible} transparent animationType="fade">
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.closeImageButton}
            onPress={() => setImageModalVisible(false)}
          />
          <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} />
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 100, paddingTop: 10 },
  heading: { alignSelf: "center", fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  flatList: { paddingHorizontal: 15, paddingTop: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  orderItem: {
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    shadowOpacity: 0.10,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  orderText: { fontSize: 15, fontWeight: "600" },
  image: { width: 100, height: 100, borderRadius: 6 },
  status: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  detailButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: { color: "white", fontWeight: "700" },

  statusOptions: {
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  optionButton: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "90%", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  detailItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },

  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  imageModalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  fullScreenImage: { width: "90%", height: "80%", resizeMode: "contain" },
  closeImageButton: { position: "absolute", top: 40, right: 20, padding: 20 },
});

export default OrdersScreen;
