import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Image, Platform, KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { createNote, updateNote } from '../services/api';
import { savePhoto, deletePhoto, getPhoto } from '../utils/storage';

const NOTE_COLORS = ['#fff4b3', '#d4edda', '#cce5ff', '#f8d7da', '#e2d9f3', '#ffecd2'];

export default function NoteEditorScreen({ route, navigation }) {
  const note = route.params?.note;
  const isEditing = Boolean(note?._id);

  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const [color, setColor] = useState(note?.color ?? '#fff4b3');
  const [location, setLocation] = useState(note?.location ?? '');
  const [photo, setPhoto] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load any saved photo for this note when editing
  useEffect(() => {
    if (isEditing) {
      getPhoto(note._id).then((p) => { if (p) setPhoto(p); });
    }
  }, []);

  // --- Location ---
  const handleGetLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Enable location access in Settings to tag notes.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [place] = await Location.reverseGeocodeAsync(pos.coords);
      const label = [place.city, place.region, place.country].filter(Boolean).join(', ');
      setLocation(label);
    } catch {
      Alert.alert('Location Error', 'Could not retrieve your location. Try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  // --- Camera / Photo Library ---
  const handleAddPhoto = () => {
    Alert.alert('Add Photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Enable camera access in Settings.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            base64: true,
            quality: 0.5,
            allowsEditing: true,
          });
          if (!result.canceled) {
            setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
          }
        },
      },
      {
        text: 'Photo Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Enable photo library access in Settings.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            quality: 0.5,
            allowsEditing: true,
          });
          if (!result.canceled) {
            setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // --- Save ---
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please add a title to your note.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        color,
        location,
      };

      let savedNote;
      if (isEditing) {
        const { data } = await updateNote(note._id, payload);
        savedNote = data;
      } else {
        const { data } = await createNote(payload);
        savedNote = data;
      }

      // Persist (or remove) photo locally in AsyncStorage
      if (photo && savedNote?._id) {
        await savePhoto(savedNote._id, photo);
      } else if (!photo && isEditing) {
        await deletePhoto(note._id);
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.msg || 'Could not save the note.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: color }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Note' : 'New Note'}</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={saving}>
            {saving
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={styles.saveBtnText}>Save</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Note title..."
            placeholderTextColor="#bbb"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            returnKeyType="next"
          />

          {/* Content input */}
          <TextInput
            style={styles.contentInput}
            placeholder="Write your note here..."
            placeholderTextColor="#bbb"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.divider} />

          {/* Color picker */}
          <Text style={styles.sectionLabel}>NOTE COLOR</Text>
          <View style={styles.colorRow}>
            {NOTE_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  color === c && styles.colorDotSelected,
                ]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>

          {/* Location section */}
          <Text style={styles.sectionLabel}>LOCATION</Text>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleGetLocation}
            disabled={locationLoading}
          >
            {locationLoading
              ? <ActivityIndicator size="small" color="#666" style={{ marginRight: 10 }} />
              : <Text style={styles.actionIcon}>📍</Text>
            }
            <Text style={[styles.actionText, location && styles.actionTextFilled]}>
              {location || 'Tap to tag your current location'}
            </Text>
            {location ? (
              <TouchableOpacity
                onPress={() => setLocation('')}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>

          {/* Photo section */}
          <Text style={styles.sectionLabel}>PHOTO</Text>
          <TouchableOpacity style={styles.actionRow} onPress={handleAddPhoto}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={[styles.actionText, photo && styles.actionTextFilled]}>
              {photo ? 'Change attached photo' : 'Attach a photo (camera or library)'}
            </Text>
            {photo ? (
              <TouchableOpacity
                onPress={() => setPhoto(null)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>

          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoPreview} resizeMode="cover" />
          ) : null}

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
  },
  backBtn: { paddingVertical: 4 },
  backText: { fontSize: 16, color: '#555' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#444' },
  saveBtn: {
    backgroundColor: '#f5c518',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    minWidth: 64,
    alignItems: 'center',
    shadowColor: '#f5c518',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  body: { flex: 1, paddingHorizontal: 20 },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    paddingTop: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.07)',
    marginBottom: 14,
  },
  contentInput: {
    fontSize: 16,
    color: '#444',
    lineHeight: 25,
    minHeight: 160,
    paddingBottom: 16,
  },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.07)', marginVertical: 14 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: '#555',
    transform: [{ scale: 1.18 }],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 12,
    padding: 13,
    marginBottom: 14,
  },
  actionIcon: { fontSize: 18, marginRight: 10 },
  actionText: { flex: 1, fontSize: 14, color: '#aaa' },
  actionTextFilled: { color: '#444' },
  clearIcon: { color: '#aaa', fontSize: 14, paddingLeft: 8 },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    marginBottom: 16,
  },
});
