import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuthStore } from '../../src/store/useAuthStore';
import { logoutAPI } from '../../src/utils/handle-api';
import { globalStyles } from '../../src/styles/global';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  
  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (e) {
      console.warn("Logout request failed, clearing local state anyway");
    } finally {
      logout();
      // O redirecionamento será tratado pelo RootLayout baseado na ausência do token
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user.name}</Text>
          
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{user.email}</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
  },
  header: {
    paddingVertical: 12,
    backgroundColor: globalStyles.primaryColor,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
