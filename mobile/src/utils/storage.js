import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// --- SecureStore: sensitive auth data (encrypted on-device) ---
export const saveToken = (token) => SecureStore.setItemAsync('auth_token', token);
export const getToken = () => SecureStore.getItemAsync('auth_token');
export const deleteToken = () => SecureStore.deleteItemAsync('auth_token');

// --- AsyncStorage: non-sensitive user profile data ---
export const saveUser = (user) =>
  AsyncStorage.setItem('user_data', JSON.stringify(user));

export const getUser = async () => {
  const raw = await AsyncStorage.getItem('user_data');
  return raw ? JSON.parse(raw) : null;
};

export const deleteUser = () => AsyncStorage.removeItem('user_data');

// --- AsyncStorage: note photos (base64, keyed by note _id) ---
export const savePhoto = (noteId, base64) =>
  AsyncStorage.setItem(`photo_${noteId}`, base64);

export const getPhoto = (noteId) => AsyncStorage.getItem(`photo_${noteId}`);

export const deletePhoto = (noteId) => AsyncStorage.removeItem(`photo_${noteId}`);
