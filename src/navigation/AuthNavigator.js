import { createStackNavigator } from '@react-navigation/stack';
import { BiomechanicsScreen } from '../screens/auth/BiomechanicsScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { PhysicalDataScreen } from '../screens/auth/PhysicalDataScreen';
import { RecommendationsScreen } from '../screens/auth/RecommendationsScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false 
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      {/* Flujo de Onboarding para usuarios */}
      <Stack.Screen name="PhysicalData" component={PhysicalDataScreen} />
      <Stack.Screen name="Biomechanics" component={BiomechanicsScreen} />
      <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
    </Stack.Navigator>
  );
};