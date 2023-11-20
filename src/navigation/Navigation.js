import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../Screens/SplashScreen';
import SignupScreen from '../Screens/SignupScreen';
import OtpScreen from '../Screens/OtpScreen';
import AccountCreatedScreen from '../Screens/AccountCreatedScreen';
import MemberIdHintScreen from '../Screens/MemberIdHintScreen';
import ChooseLanguageScreen from '../Screens/ChooseLanguageScreen';
import Toast from 'react-native-toast-message';
import LoginScreen from '../Screens/LoginScreen';
import RegistrationFormScreen from '../Screens/RegistrationFormScreen';
import ChoosePlanScreen from '../Screens/ChoosePlanScreen';
import PaymentScreen from '../Screens/PaymentScreen';
import HomeScreen from '../Screens/HomeScreen';
import OfferScreen from '../Screens/OfferScreen';
import AllCategoryScreen from '../Screens/AllCategoryScreen';
import JobsScreen from '../Screens/JobsScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import WorkDetailScreen from '../Screens/WorkDetailsScreen';
import ChooseSkillScreen from '../Screens/ChooseSkillScreen';
import EmployeeDetailsScreen from '../Screens/EmployeeDetailsScreen';
import JobRequestScreen from '../Screens/JobRequestScreen';
import MonthlyWorkDetailScreen from '../Screens/MonthlyWorkDetailsScreen';
import AttendanceScreen from '../Screens/AttendanceScreen';
import ChooseEmployeeTypeScreen from '../Screens/ChooseEmployeeTypeScreen';
import LeaveApplicationScreen from '../Screens/LeaveApplicationScreen';
import MembershipHistoryScreen from '../Screens/MembershipHistoryScreen';

const Stack = createNativeStackNavigator();


const AppNavigator = () => {
  return (
    <NavigationContainer>
            

      <Stack.Navigator initialRouteName="SplashScreen"  screenOptions={{
          headerShown: false, // Hide the top bar by default
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="AccountCreatedScreen" component={AccountCreatedScreen} />
        <Stack.Screen name="MemberIdHintScreen" component={MemberIdHintScreen} />
        <Stack.Screen name="ChooseLanguageScreen" component={ChooseLanguageScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegistrationFormScreen" component={RegistrationFormScreen} />
        <Stack.Screen name="ChooseSkillScreen" component={ChooseSkillScreen} />

        <Stack.Screen name="ChoosePlanScreen" component={ChoosePlanScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />

        <Stack.Screen name="OfferScreen" component={OfferScreen} />
        <Stack.Screen name="AllCategoryScreen" component={AllCategoryScreen} />
        <Stack.Screen name="JobsScreen" component={JobsScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="WorkDetailScreen" component={WorkDetailScreen} />
        <Stack.Screen name="EmployeeDetailScreen" component={EmployeeDetailsScreen} />
        <Stack.Screen name="JobRequestScreen" component={JobRequestScreen} />

        <Stack.Screen name="MonthlyWorkDetailScreen" component={MonthlyWorkDetailScreen} />
        <Stack.Screen name="AttendaceScreen" component={AttendanceScreen} />

        <Stack.Screen name="ChooseEmployeeTypeScreen" component={ChooseEmployeeTypeScreen} />
        <Stack.Screen name="LeaveApplicationScreen" component={LeaveApplicationScreen} />
        <Stack.Screen name="MembershipHistoryScreen" component={MembershipHistoryScreen} />


     

      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default AppNavigator;
