import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// User Screens
import { AddWorkoutScreen } from '../screens/user/AddWorkoutScreen';
import { HomeScreen } from '../screens/user/HomeScreen';
import { IMCScreen } from '../screens/user/IMCScreen';
import { ProfileScreen } from '../screens/user/ProfileScreen';
import { ScienceIAScreen } from '../screens/user/ScienceIAScreen';
import { SplitDetailScreen } from '../screens/user/SplitDetailScreen';
import { ViewWorkoutsScreen } from '../screens/user/ViewWorkoutsScreen';

// Coach Screens
import { CoachHomeScreen } from '../screens/coach/CoachHomeScreen';

// Admin Screens
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';

const Stack = createStackNavigator();

export const MainNavigator = () => {
  const { userRole } = useContext(AuthContext);

  const getInitialRoute = () => {
    switch (userRole) {
      case 'admin':
        return 'AdminHome';
      case 'coach':
        return 'CoachHome';
      default:
        return 'Home';
    }
  };

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false 
      }}
      initialRouteName={getInitialRoute()}
    >
      {/* User Routes */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} />
      <Stack.Screen name="ViewWorkouts" component={ViewWorkoutsScreen} />
      <Stack.Screen name="IMC" component={IMCScreen} />
      <Stack.Screen name="ScienceIA" component={ScienceIAScreen} />
      <Stack.Screen name="SplitDetail" component={SplitDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

      {/* Coach Routes */}
      <Stack.Screen name="CoachHome" component={CoachHomeScreen} />

      {/* Admin Routes */}
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
    </Stack.Navigator>
  );
};