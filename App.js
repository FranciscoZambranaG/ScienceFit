import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { MainNavigator } from './src/navigation/MainNavigator';

function AppContent() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  // Verifica si el usuario existe y si completó el onboarding
  const shouldShowMainNavigator = user && user.onboardingCompleted;

  return (
    <NavigationContainer>
      {shouldShowMainNavigator ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}