// import React, { useEffect, useState } from 'react';
// import {
//     View, Text, Image, TouchableOpacity, ScrollView,
//     Alert, TextInput, ActivityIndicator, StyleSheet
// } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
// import UpdatePlumber from './UpdatePlumber';
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
// export default function Plumbers() {
//     const [plumbers, setPlumbers] = useState([]);
//     const [selectedPlumber, setSelectedPlumber] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [refreshing, setRefreshing] = useState(false);
//     const rowsPerPage = 10;

//     useEffect(() => {
//         fetchPlumbers();
//     }, []);

//     const fetchPlumbers = () => {
//         setLoading(true);
//         fetch(`${API_BASE_URL}/plumbers`)
//             .then(response => response.json())
//             .then(data => {
//                 setPlumbers(data);
//                 setLoading(false);
//             })
//             .catch(error => {
//                 console.error('Error fetching plumbers:', error);
//                 setLoading(false);
//             });
//     };

//     const handleDelete = (id) => {
//         Alert.alert('Confirm', 'Are you sure you want to delete this plumber?', [
//             { text: 'Cancel', style: 'cancel' },
//             {
//                 text: 'Delete',
//                 onPress: () => {
//                     fetch(`${API_BASE_URL}/plumbers/${id}`, { method: 'DELETE' })
//                         .then(() => setPlumbers(plumbers.filter(plumber => plumber.id !== id)))
//                         .catch(error => Alert.alert('Error', error.message));
//                 },
//                 style: 'destructive',
//             },
//         ]);
//     };

//     const handleRefresh = () => {
//         setRefreshing(true);
//         fetchPlumbers();
//         setRefreshing(false);
//     };

//     const indexOfLast = currentPage * rowsPerPage;
//     const indexOfFirst = indexOfLast - rowsPerPage;
//     const filteredPlumbers = plumbers
//         .filter(plumber => plumber.name.toLowerCase().includes(searchTerm.toLowerCase()))
//         .slice(indexOfFirst, indexOfLast);

//     const totalPages = Math.ceil(plumbers.length / rowsPerPage);

//     const handleScroll = (event) => {
//         const offsetY = event.nativeEvent.contentOffset.y;
//         if (offsetY <= 0) {
//             // User has scrolled to the top, trigger refresh
//             handleRefresh();
//         }
//     };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//         );
//     }

//     return (
//         <View style={{ flex: 1 }}>
//             <ScrollView
//                 style={styles.container}
//                 showsVerticalScrollIndicator={false}
//                 onScroll={handleScroll}
//                 scrollEventThrottle={16} // Throttle the scroll event for performance
//                 refreshing={refreshing}
//                 onRefresh={handleRefresh}
//             >
//                 <Text style={styles.title}>All Electricians</Text>
//                 <TextInput
//                     placeholder="Search by name"
//                     value={searchTerm}
//                     onChangeText={setSearchTerm}
//                     style={styles.searchInput}
//                 />

//                 {filteredPlumbers.map(plumber => (
//                     <View key={plumber.id} style={styles.card}>
//                         <View style={styles.cardHeader}>
//                             <Text style={styles.name}>{plumber.name}</Text>
//                             <Image source={{ uri: plumber.image_url }} style={styles.image} />
//                         </View>

//                         <View style={styles.cardBody}>
//                             <Text style={styles.info}><FontAwesome name="phone" size={16} /> {plumber.contact}</Text>
//                             <Text style={styles.info}><FontAwesome name="star" size={16} /> {plumber.experience} Experience</Text>
//                             <Text style={styles.infostatus}><FontAwesome name="check-circle" size={16} /> Status: {plumber.status}</Text>
//                         </View>

//                         <View style={styles.actions}>
//                             <TouchableOpacity onPress={() => setSelectedPlumber(plumber)} style={styles.actionButton}>
//                                 <FontAwesome name="edit" size={20} color="blue" />
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={() => handleDelete(plumber.id)} style={styles.actionButton}>
//                                 <FontAwesome name="trash" size={20} color="red" />
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 ))}

//                 <View style={styles.paginationContainer}>
//                     {[...Array(totalPages)].map((_, index) => (
//                         <TouchableOpacity
//                             key={index}
//                             onPress={() => setCurrentPage(index + 1)}
//                             style={[styles.pageButton, currentPage === index + 1 && styles.activePageButton]}
//                         >
//                             <Text style={[styles.pageButtonText, currentPage === index + 1 && styles.activePageText]}>
//                                 {index + 1}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </ScrollView>

//             {selectedPlumber && (
//                 <UpdatePlumber
//                     plumber={selectedPlumber}
//                     onClose={() => setSelectedPlumber(null)}
//                     onUpdate={(updatedPlumber) => {
//                         setPlumbers(prev =>
//                             prev.map(p => (p.id === updatedPlumber.id ? updatedPlumber : p))
//                         );
//                         setSelectedPlumber(null);
//                     }}
//                 />
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, paddingHorizontal: 15,paddingTop:10, backgroundColor: '#F5F5F5', marginBottom: 80 },
//     title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
//     searchInput: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         padding: 10,
//         borderRadius: 5,
//         backgroundColor: '#fff',
//         marginBottom: 15,
//         width: '60%',
//         alignSelf: 'center'
//     },
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 15,
//         marginBottom: 15,
//         elevation: 5
//     },
//     cardHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 10
//     },
//     image: { width: 60, height: 60, borderRadius: 30 },
//     name: { fontSize: 18, fontWeight: 'bold' },
//     cardBody: { marginBottom: 10 },
//     info: { fontSize: 14, marginBottom: 5, color: '#333' },
//     infostatus:{fontWeight:'900', color:'green'},
//     actions: { flexDirection: 'row', justifyContent:'space-between', marginTop: 10 },
//     actionButton: { padding: 10 },
//     paginationContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
//     pageButton: {
//         padding: 10,
//         marginHorizontal: 5,
//         borderRadius: 5,
//         backgroundColor: 'gray'
//     },
//     activePageButton: { backgroundColor: 'black' },
//     pageButtonText: { color: '#000' },
//     activePageText: { color: '#fff' },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     }
// });
import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, TouchableOpacity, ScrollView,
    Alert, TextInput, ActivityIndicator, StyleSheet
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import UpdatePlumber from './UpdatePlumber';
import Constants from 'expo-constants';
import colors from '../Themes/colors';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function Plumbers() {
    const [plumbers, setPlumbers] = useState([]);
    const [selectedPlumber, setSelectedPlumber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchPlumbers();
    }, []);

    const fetchPlumbers = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/plumbers`)
            .then(response => response.json())
            .then(data => {
                setPlumbers(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching plumbers:', error);
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        Alert.alert('Confirm', 'Are you sure you want to delete this electrician?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                onPress: () => {
                    fetch(`${API_BASE_URL}/plumbers/${id}`, { method: 'DELETE' })
                        .then(() => setPlumbers(plumbers.filter(plumber => plumber.id !== id)))
                        .catch(error => Alert.alert('Error', error.message));
                },
                style: 'destructive',
            },
        ]);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPlumbers();
        setRefreshing(false);
    };

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;

    const filteredPlumbers = plumbers
        .filter(plumber => plumber.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(plumbers.length / rowsPerPage);

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY <= 0) handleRefresh();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bodybackground }}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshing={refreshing}
                onRefresh={handleRefresh}
            >
                <Text style={styles.title}>All Electricians</Text>

                <TextInput
                    placeholder="Search by name"
                    placeholderTextColor={colors.mutedText}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    style={styles.searchInput}
                />

                {filteredPlumbers.map(plumber => (
                    <View key={plumber.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.name}>{plumber.name}</Text>
                            <Image source={{ uri: plumber.image_url }} style={styles.image} />
                        </View>

                        <View style={styles.cardBody}>
                            <Text style={styles.info}>
                                <FontAwesome name="phone" size={16} color={colors.primary} /> {plumber.contact}
                            </Text>
                            <Text style={styles.info}>
                                <FontAwesome name="star" size={16} color={colors.primary} /> {plumber.experience} Experience
                            </Text>
                            <Text style={styles.infostatus}>
                                <FontAwesome name="check-circle" size={16} color="green" /> Status: {plumber.status}
                            </Text>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => setSelectedPlumber(plumber)} style={styles.actionButton}>
                                <FontAwesome name="edit" size={20} color={colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(plumber.id)} style={styles.actionButton}>
                                <FontAwesome name="trash" size={20} color={colors.error} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* Pagination */}
                <View style={styles.paginationContainer}>
                    {[...Array(totalPages)].map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setCurrentPage(index + 1)}
                            style={[
                                styles.pageButton,
                                currentPage === index + 1 && styles.activePageButton
                            ]}
                        >
                            <Text
                                style={[
                                    styles.pageButtonText,
                                    currentPage === index + 1 && styles.activePageText
                                ]}
                            >
                                {index + 1}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {selectedPlumber && (
                <UpdatePlumber
                    plumber={selectedPlumber}
                    onClose={() => setSelectedPlumber(null)}
                    onUpdate={(updatedPlumber) => {
                        setPlumbers(prev =>
                            prev.map(p => (p.id === updatedPlumber.id ? updatedPlumber : p))
                        );
                        setSelectedPlumber(null);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: colors.bodybackground
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.text,
        marginBottom: 15
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.border,
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.cardsbackground,
        marginBottom: 15,
        width: '60%',
        alignSelf: 'center',
        color: colors.text
    },
    card: {
        backgroundColor: colors.cardsbackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 2, height: 2 },
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    name: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    image: { width: 60, height: 60, borderRadius: 30 },
    cardBody: { marginBottom: 10 },
    info: { fontSize: 14, marginBottom: 5, color: colors.mutedText },
    infostatus: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
    actions: { flexDirection: 'row', justifyContent: 'space-between' },
    actionButton: { padding: 10 },
    paginationContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
    pageButton: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: colors.secondary
    },
    activePageButton: {
        backgroundColor: colors.primary
    },
    pageButtonText: { color: colors.text },
    activePageText: { color: "#fff" },
    loadingContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: colors.bodybackground
    }
});
