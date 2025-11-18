import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const Subcategories = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId } = route.params;
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Received categoryId:', categoryId);
    if (!categoryId) return;

    const fetchSubcategories = async () => {
      try {
        const response = await fetch(`http://192.168.100.5:5004/categories/${categoryId}/subcategories`);
        const data = await response.json();
        setSubcategories(data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>Subcategories</Text>
      <FlatList
        key={'fixed-columns'} // Unique key to prevent re-rendering issues
        data={subcategories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              width: screenWidth / 3 - 15,
              margin: 5,
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              padding: 10,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate('Products', { subcategoryId: item.id })}
          >
            <Image 
              source={{ uri: item.image_url }}
              style={{ width: '100%', height: 80, borderRadius: 5, marginBottom: 5 }}
              resizeMode="cover"
            />
            <Text style={{ fontSize: 16, textAlign: 'center' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Subcategories;
