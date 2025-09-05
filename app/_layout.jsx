import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Home'
          }}
        />
        <Stack.Screen 
          name="login" 
          options={{
            title: 'Login'
          }}
        />
        <Stack.Screen 
          name="register" 
          options={{
            title: 'Register'
          }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          options={{
            title: 'Admin Dashboard'
          }}
        />
        <Stack.Screen 
          name="onboarding_screen" 
          options={{
            title: 'Onboarding'
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}