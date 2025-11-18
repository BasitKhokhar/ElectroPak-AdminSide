// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// const UserScreen = () => {
//   const [userData, setUserData] = useState(null);
//   const [userImage, setUserImage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const storedUserId = await AsyncStorage.getItem("userId");
//       console.log("User ID in UserScreen is:", storedUserId);
      
//       if (storedUserId) {
//         try {
//           const response = await fetch(`${API_BASE_URL}/users/${storedUserId}`);
//           if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
          
//           const data = await response.json();
//           setUserData(data);
//              console.log(data)
//           // Fetch user image separately
//           const imageResponse = await fetch(`${API_BASE_URL}/user_images/${storedUserId}`);
//           if (imageResponse.ok) {
//             const imageData = await imageResponse.json();
//             setUserImage(imageData.image_url);
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//       setLoading(false);
//     };
//     fetchUserData();
//   }, []);
//  console.log("userdata in userscreen",userData)
//   return (
//     <View style={styles.container}>
//     {loading ? (
//       <ActivityIndicator size="large" color="#0000ff" />
//     ) : userData ? (
//       <View style={styles.profileContainer}>
//         {/* Profile Header */}
//         <View style={styles.header}>
//         <Text style={styles.title}>{userData.Name}</Text>
//           <View style={styles.imageContainer}>
//             {userImage ? (
//               <Image source={{ uri: userImage }} style={styles.profileImage} />
//             ) : (
//               <View style={styles.defaultProfileCircle} />
//             )}
//           </View>
          
//         </View>

//         {/* Sections */}
//         <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("AccountDetail", { userData })}>
//           <Text style={styles.sectionText}>Account Detail</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("CustomerSupport") }>
//           <Text style={styles.sectionText}>Customer Support</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("CustomerSupport") }>
//           <Text style={styles.sectionText}>FAQs</Text>
//         </TouchableOpacity>
//         {/* <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("CustomerSupport") }>
//           <Text style={styles.sectionText}>About Owners</Text>
//         </TouchableOpacity> */}
//         <TouchableOpacity style={[styles.section, styles.logout]} onPress={() => navigation.navigate("Logout") }>
//           <Text style={styles.sectionText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     ) : (
//       <Text style={styles.text}>No user data found.</Text>
//     )}
//   </View>
// );
// };

// const styles = StyleSheet.create({
// container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", },
// profileContainer: { width: "100%",height:"100%", padding: 20, backgroundColor: "#fff", borderRadius: 10, elevation: 5,  },
// header: { flexDirection: "row", alignItems: "center",marginBottom:50, justifyContent: "space-between", width: "100%" },
// title: { fontSize: 26, fontWeight: "bold", color: "#333" },
// section: { width: "100%", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ddd", alignItems: "flex-start" },
// sectionText: { fontSize: 18, color: "#333" },
// logout: { borderBottomWidth: 0 },
// text: { fontSize: 18, marginVertical: 5, color: "#555" },

// // Profile Image Styles
// imageContainer: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
// profileImage: { width: "100%", height: "100%", borderRadius: 50 },
// defaultProfileCircle: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, borderColor: "#000", backgroundColor: "#fff" },
// });



// export default UserScreen;
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';
import colors from "../Themes/colors";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserScreen = () => {
  const [userData, setUserData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");

      if (storedUserId) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/${storedUserId}`);
          if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
          
          const data = await response.json();
          setUserData(data);

          // Fetch user image separately
          const imageResponse = await fetch(`${API_BASE_URL}/user_images/${storedUserId}`);
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            setUserImage(imageData.image_url);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : userData ? (
        <View style={[styles.profileContainer, { backgroundColor: colors.cardsbackground }]}>
          
          {/* Profile Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{userData.Name}</Text>

            <View style={styles.imageContainer}>
              {userImage ? (
                <Image source={{ uri: userImage }} style={styles.profileImage} />
              ) : (
                <View style={[styles.defaultProfileCircle, { borderColor: colors.primary }]} />
              )}
            </View>
          </View>

          {/* Sections */}
          <TouchableOpacity
            style={[styles.section, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate("AccountDetail", { userData })}
          >
            <Text style={[styles.sectionText, { color: colors.text }]}>Account Detail</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.section, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate("CustomerSupport")}
          >
            <Text style={[styles.sectionText, { color: colors.text }]}>Customer Support</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.section, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate("CustomerSupport")}
          >
            <Text style={[styles.sectionText, { color: colors.text }]}>FAQs</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.section, styles.logout]}
            onPress={() => navigation.navigate("Logout")}
          >
            <Text style={[styles.sectionText, { color: colors.error }]}>Logout</Text>
          </TouchableOpacity>

        </View>
      ) : (
        <Text style={[styles.text, { color: colors.mutedText }]}>No user data found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    width: "100%",
    height: "100%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  section: {
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    alignItems: "flex-start",
  },
  sectionText: {
    fontSize: 18,
  },
  logout: {
    borderBottomWidth: 0,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },

  // Profile Image
  imageContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 50, 
    overflow: "hidden" 
  },
  profileImage: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 50 
  },
  defaultProfileCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: "#fff",
  },
});

export default UserScreen;
