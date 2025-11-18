import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import * as Updates from 'expo-updates';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
export default function UpdatePlumber({ plumber, onClose, onUpdate }) {
    const [plumberDetails, setPlumberDetails] = useState({
        name: '',
        contact: '',
        image_url: '',
        status: ''
    });

    useEffect(() => {
        if (plumber) {
            setPlumberDetails({
                name: plumber.name || '',
                contact: plumber.contact?.toString() || '',
                image_url: plumber.image_url || '',
                status: plumber.status || 'In Progress'
            });
        }
    }, [plumber]);

    const handleChange = (name, value) => {
        setPlumberDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        fetch(`${API_BASE_URL}/plumbers/${plumber.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(plumberDetails),
        })
            .then(res => res.json())
            .then(data => {
                onUpdate(data);
                onClose();
            })
            .catch(error => {
                console.error('Error updating plumber:', error);
            });
    };
    return (
        <Modal transparent={true} visible={true} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Update Plumber</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Plumber Name"
                        value={plumberDetails.name}
                        onChangeText={(value) => handleChange('name', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contact"
                        keyboardType="numeric"
                        value={plumberDetails.contact}
                        onChangeText={(value) => handleChange('contact', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Experience (e.g., 5 years)"
                        value={plumberDetails.experience}
                        onChangeText={(value) => handleChange('experience', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Image URL"
                        value={plumberDetails.image_url}
                        onChangeText={(value) => handleChange('image_url', value)}
                    />

                    <Picker
                        selectedValue={plumberDetails.status}
                        onValueChange={(value) => handleChange('status', value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Free" value="Free" />
                        <Picker.Item label="At Work" value="At Work" />
                        <Picker.Item label="At Leave" value="At Leave" />
                    </Picker>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.updateButton]}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    picker: {
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'red',
    },
    updateButton: {
        backgroundColor: 'blue',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
