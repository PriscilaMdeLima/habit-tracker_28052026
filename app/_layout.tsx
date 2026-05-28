import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const { token, _hasHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Espera a hidratação do storage e a prontidão da navegação
    if (!_hasHydrated || !isNavigationReady) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!token && !inAuthGroup) {
      // Se não estiver logado e tentar acessar área protegida, vai para login
      router.replace('/login');
    } else if (token && inAuthGroup) {
      // Se estiver logado e tentar acessar login/signup, vai para a home
      router.replace('/(tabs)');
    }
  }, [token, _hasHydrated, segments, isNavigationReady]);

  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5C6BC0" />
      </View>
    );
  }

  return (
    <Stack 
      screenOptions={{ headerShown: false }}
      onLayout={() => setIsNavigationReady(true)}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Criar Conta' }} />
      <Stack.Screen name="habit/[id]" options={{ title: 'Detalhes do Hábito', headerShown: true }} />
    </Stack>
  );
}
