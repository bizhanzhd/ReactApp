import { View, Text, StyleSheet, Image, TextInput, Pressable, Alert} from "react-native";
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {validateEmail, isAlphabetic} from "../components/utils";

const loadFonts = async () => {
    await Font.loadAsync({
        'Karla': require('../assets/Fonts/Karla-Regular.ttf'),
        'Markazi': require('../assets/Fonts/MarkaziText-Regular.ttf'),
    });
};

function OnboardingScreen({navigation}){
    
    // State to track font loading
    const [fontsLoaded, setFontsLoaded] = useState(false);

    // Effect to load fonts
    useEffect(() => {
        loadFonts()
            .then(() => setFontsLoaded(true))
            .catch(error => console.log(error)); // Handle any errors
    }, []);

    // States to control text inputs
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);

    // Check if the button should be enabled
    const isButtonEnabled = isFirstNameValid && isEmailValid && firstName !== "" && email !== "";

    // Handle email input change
    const handleEmailChange = (text) => {
        setEmail(text);
        setIsEmailValid(validateEmail(text));
    };
    // Handle first name input change with alphabetic validation
    const handleFirstNameChange = (text) => {
            setFirstName(text);
            setIsFirstNameValid(isAlphabetic(text));
    };
    // Function to handle pressing the Next button
    const handlePressNext = async () => {
        if (isButtonEnabled) {
            try {
                // Save user details and onboarding completion flag to AsyncStorage in one operation
                const userDetails = [
                    ['isOnboardingCompleted', 'true'],
                    ['firstName', firstName],
                    ['email', email],
                ];
                await AsyncStorage.multiSet(userDetails);
    
                console.log('Onboarding status and user details saved:', { firstName, email });
    
                // Navigate to the Home screen
                navigation.navigate("Home");
            } catch (error) {
                console.log('Error saving onboarding status and user details:', error);
            }
        }
    };
    
    // Main View
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require("../assets/Images/app/Logo.png")} style={styles.logo}/>
            </View>
            <View style={styles.body}>
                <Text style={styles.bodyText}>Let us get to know you</Text>
                
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput 
                    style={[styles.inputBox, !isFirstNameValid && firstName !== "" && styles.inputError]} 
                    placeholder="Bizhan" 
                    onChangeText={handleFirstNameChange} 
                    value={firstName}
                />
                {!isFirstNameValid && <Text style={styles.errorText}>Please enter a valid name (letters only).</Text>}

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput 
                    style={[styles.inputBox, !isEmailValid && email !== "" && styles.inputError]} 
                    placeholder="example@gmail.com" 
                    onChangeText={handleEmailChange} 
                    value={email}
                />
                {!isEmailValid && <Text style={styles.errorText}>Please enter a valid email address.</Text>}
            </View>

            <Pressable 
                style={[styles.buttonView, !isButtonEnabled && styles.buttonDisabled]} 
                onPress={handlePressNext}
                disabled={!isButtonEnabled}
            >
                <Text style={[styles.buttonText, !isButtonEnabled && styles.buttonTextDisabled]}>Next</Text>
            </Pressable>

        </View>
    )
}

export default OnboardingScreen;


const styles = StyleSheet.create({
    container: {
        flex : 1,
        alignItems: 'center',
        backgroundColor:"#FFFFFF"
    },
    header: {
        flex:0.1,
        backgroundColor:"#FFFFFF",
        alignItems: 'center',
        width:"100%",
        marginBottom: 20
    },
    logo: {
        width:200,
        height: 100,
        resizeMode: "contain",
    },
    body: {
        flex: 0.8,
        marginTop: 40,
        marginBottom: 20,
        alignItems: 'center'
    },
    bodyText: {
        fontFamily: "Karla",
        fontSize: 30,
        marginBottom: 150
    },
    inputLabel: {
        fontFamily: "Karla",
        fontSize: 20,
        marginBottom: 10
    },
    inputBox: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 10,
        marginBottom: 50,
        width: 200
    },
    inputError: {
        borderColor: 'red'
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    buttonView: {
        alignSelf: 'flex-end',
        marginRight: 30,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: "#495E57"
    },
    buttonDisabled: {
        backgroundColor: '#d3d3d3', 
    },
    buttonText: {
        fontFamily: "Karla",
        fontSize: 20,
        padding:10,
        paddingLeft: 30,
        paddingRight: 30,
        color: "#F5F5F5"
    },
    buttonTextDisabled: {
        color: "gray"
    }
});