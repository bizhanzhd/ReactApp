import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import OnboardingScreen from "./components/Onboarding";
import HomeScreen from "./components/Home";
import SplashScreen from "./components/Splash";
import ProfileScreen from "./components/Profile";

const Stack = createNativeStackNavigator()

function App () {

    // State to track onboarding completion
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null); 

    // State to track loading status
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkOnboardingStatus = async () => {
            try {
                const onboardingStatus = await AsyncStorage.getItem('isOnboardingCompleted');
                //setIsOnboardingCompleted(onboardingStatus === 'true'); // Convert to boolean
                setIsOnboardingCompleted(false)
            } catch (error) {
                console.log('Error reading onboarding status:', error);
            } finally {
                setIsLoading(false); // Set loading to false after checking
            }
        };

        checkOnboardingStatus(); // Call the function
    }, []);

    if (isLoading) {return <SplashScreen />;}
    return(
    
        isOnboardingCompleted ? (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Profile" component={ProfileScreen}/>
                <Stack.Screen name="Onboarding" component={OnboardingScreen}/>
            </Stack.Navigator>

        ) : (
            <Stack.Navigator initialRouteName="Onboarding">
                <Stack.Screen name="Onboarding" component={OnboardingScreen}/>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Profile" component={ProfileScreen}/>
            </Stack.Navigator>
        )

    )
};
export default App;