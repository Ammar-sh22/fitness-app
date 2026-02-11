// App.tsx
import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import { LoadingScreen } from './src/core/components/Layout/LoadingScreen';

import { LoginScreen } from './src/features/auth/LoginScreen';
import { RegisterScreen } from './src/features/auth/RegisterScreen';
import { HomeScreen } from './src/features/home/HomeScreen';
import { DiscoverScreen } from './src/features/home/DiscoverScreen';
import { ProviderPackagesScreen } from './src/features/subscriptions/ProviderPackagesScreen';
import { SubscriptionsScreen } from './src/features/subscriptions/SubscriptionsScreen';
import { ChatsScreen } from './src/features/chat/ChatsScreen';
import { SingleChatScreen } from './src/features/chat/SingleChatScreen';
import { TasksScreen } from './src/features/tasks/TasksScreen';
import { TaskDetailsScreen } from './src/features/tasks/TaskDetailsScreen';
import {
  ProfileScreen,
  FallbackProfileScreen,
} from './src/features/profile/ProfileScreen';
import { CheckoutScreen } from './src/features/subscriptions/CheckoutScreen';
import { SideNavbar } from './src/core/components/Layout/SideNavbar';
import { navigate, navigationRef } from './src/navigation/RootNavigation';
import { useAppStore } from './src/store/appStore';

import { COLORS } from './src/core/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* Splash / loading (optional) */
const SplashScreen: React.FC<any> = ({ navigation }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), 1000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return <LoadingScreen message="Preparing your fitness app..." />;
};

/* Custom tab bar with icon tabs + menu */
type CustomTabBarProps = BottomTabBarProps & {
  onToggleMenu: () => void;
};

const getTabIcon = (name: string, focused: boolean) => {
  const tintColor = focused ? COLORS.brand : COLORS.gray700;

  switch (name) {
    case 'Home':
      return (
        <Image
          source={require('./src/core/components/Icons/homeIcon.png')}
          style={{ width: 22, height: 22, tintColor, resizeMode: 'contain' }}
        />
      );
    case 'Tasks':
      return (
        <Image
          source={require('./src/core/components/Icons/TasksIcon.png')}
          style={{ width: 22, height: 22, tintColor, resizeMode: 'contain' }}
        />
      );
    case 'Chat':
      return (
        <Image
          source={require('./src/core/components/Icons/ChatIcon.png')}
          style={{ width: 22, height: 22, tintColor, resizeMode: 'contain' }}
        />
      );
    case 'Profile':
      return (
        <Image
          source={require('./src/core/components/Icons/profileIcon.png')}
          style={{ width: 22, height: 22, tintColor, resizeMode: 'contain' }}
        />
      );
    default:
      return null;
  }
};

const CustomTabBar: React.FC<CustomTabBarProps> = (props) => {
  const { state, navigation, onToggleMenu } = props;

  return (
    <View style={tabStyles.wrapper}>
      <View style={tabStyles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={onPress}
              style={tabStyles.tabButton}
            >
              {getTabIcon(route.name, isFocused)}
            </TouchableOpacity>
          );
        })}

        {/* Menu / more icon */}
        <TouchableOpacity
          style={tabStyles.toggleButton}
          onPress={onToggleMenu}
        >
          <Image
            source={require('./src/core/components/Icons/moreIcon.png')}
            style={{ width: 24, height: 24, tintColor: COLORS.brand, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* Bottom tabs + global SideNavbar */
const MainTabs: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => (
          <CustomTabBar
            {...props}
            onToggleMenu={() => setMenuOpen((v) => !v)}
          />
        )}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Chat" component={ChatsScreen} />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen || FallbackProfileScreen}
        />
      </Tab.Navigator>

      <SideNavbar
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigateDiscover={() => navigate('Discover')}
        onNavigateSubscriptions={() => navigate('Subscriptions')}
      />
    </>
  );
};

/* Auth stack: Login / Register */
const AuthStack: React.FC = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

/* App stack: main app after login */
const AppStack: React.FC = () => (
  <Stack.Navigator
    initialRouteName="MainTabs"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen
      name="ProviderPackages"
      component={ProviderPackagesScreen}
    />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="Tasks" component={TasksScreen} />
    <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    <Stack.Screen name="SingleChat" component={SingleChatScreen} />
    <Stack.Screen name="Discover" component={DiscoverScreen} />
    <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} />
  </Stack.Navigator>
);

/* Root app: choose stack depending on currentUser */
export default function App() {
  const currentUser = useAppStore((s) => s.currentUser);

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        {currentUser ? <AppStack /> : <AuthStack />}
      </View>
    </NavigationContainer>
  );
}



const tabStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingTop: 4,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
