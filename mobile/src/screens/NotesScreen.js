import { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, TextInput, ActivityIndicator, Image, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../hooks/useNotes';
import { getPhoto, deletePhoto } from '../utils/storage';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

export default function NotesScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { notes, loading, fetchNotes, removeNote } = useNotes();
  const [search, setSearch] = useState('');
  const [photos, setPhotos] = useState({});

  // Refresh notes whenever this screen comes into focus (e.g. returning from editor)
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  // Load locally-stored photos for each note
  useEffect(() => {
    if (notes.length === 0) return;
    const loadPhotos = async () => {
      const pairs = await Promise.all(
        notes.map(async (n) => [n._id, await getPhoto(n._id)])
      );
      const map = {};
      pairs.forEach(([id, uri]) => { if (uri) map[id] = uri; });
      setPhotos(map);
    };
    loadPhotos();
  }, [notes]);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleDelete = (note) => {
    Alert.alert('Delete Note', `Delete "${note.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeNote(note._id);
            await deletePhoto(note._id);
            setPhotos((prev) => {
              const next = { ...prev };
              delete next[note._id];
              return next;
            });
          } catch {
            Alert.alert('Error', 'Could not delete the note.');
          }
        },
      },
    ]);
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.content || '').toLowerCase().includes(search.toLowerCase())
  );

  const renderNote = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.color || '#fff4b3', width: CARD_WIDTH }]}
      onPress={() => navigation.navigate('NoteEditor', { note: item })}
      onLongPress={() => handleDelete(item)}
      activeOpacity={0.82}
    >
      {photos[item._id] ? (
        <Image source={{ uri: photos[item._id] }} style={styles.cardPhoto} />
      ) : null}
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      {item.content ? (
        <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text>
      ) : null}
      {item.location ? (
        <Text style={styles.cardLocation} numberOfLines={1}>📍 {item.location}</Text>
      ) : null}
      <Text style={styles.cardDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.title}>My Notes</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor="#bbb"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Note list */}
      {loading && notes.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f5c518" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>{search ? '🔍' : '📝'}</Text>
          <Text style={styles.emptyText}>
            {search ? 'No notes match your search.' : 'No notes yet.\nTap + to create one!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderNote}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NoteEditor', {})}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f0' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  greeting: { fontSize: 13, color: '#aaa', marginBottom: 2 },
  title: { fontSize: 28, fontWeight: '800', color: '#333' },
  logoutBtn: {
    backgroundColor: '#f5f5f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  logoutText: { color: '#666', fontSize: 13, fontWeight: '600' },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f5f5f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  listContent: { padding: 12, paddingBottom: 90 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: {
    borderRadius: 18,
    padding: 14,
    minHeight: 120,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPhoto: { width: '100%', height: 80, borderRadius: 10, marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 4 },
  cardContent: { fontSize: 13, color: '#555', lineHeight: 18 },
  cardLocation: { fontSize: 11, color: '#777', marginTop: 5 },
  cardDate: { fontSize: 10, color: '#bbb', marginTop: 8, alignSelf: 'flex-end' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#aaa', fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 40 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5c518',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f5c518',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 7,
  },
  fabIcon: { color: '#fff', fontSize: 30, fontWeight: '300', lineHeight: 34 },
});
