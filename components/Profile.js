import { View, Text, StyleSheet, Image, TextInput, Pressable, TouchableOpacity, Alert} from "react-native";
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {validateEmail, isAlphabetic, isNumeric} from "../components/utils";


import SplashScreen from "../components/Splash";


function ProfileScreen({navigation}){

    // State to track loading status
    const [isLoading, setIsLoading] = useState(true);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    const [checkbox3, setCheckbox3] = useState(false);
    const [checkbox4, setCheckbox4] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
    const [isLastNameValid, setIsLastNameValid] = useState(false);
    const [isFirstNameChanged, setIsFirstNameChanged] = useState(false)
    const [isLastNameChanged, setIsLastNameChanged] = useState(false)
    const [isEmailChanged, setIsEmailChanged] = useState(false)
    const [isPhoneNumberChanged, setIsPhoneNumberChanged] = useState(false)
    const [image, setImage] = useState(null);
    const [isImageChanged, setIsImageChanged] = useState(false)


    // Handle email input change
    const handleEmailChange = (text) => {
        setEmail(text);
        setIsEmailValid(validateEmail(text));
        setIsEmailChanged(true)
    };
    // Handle first name input change with alphabetic validation
    const handleFirstNameChange = (text) => {
        setFirstName(text);
        setIsFirstNameValid(isAlphabetic(text));
        setIsFirstNameChanged(true)
    };
    // Handle first name input change with alphabetic validation
    const handleLastNameChange = (text) => {
            setLastName(text);
            setIsLastNameValid(isAlphabetic(text));
            setIsLastNameChanged(true)
    };
    // Handle first name input change with alphabetic validation
    const handlePhoneNumberChange = (text) => {
            setPhoneNumber(text);
            setIsPhoneNumberValid(isNumeric(text));
            setIsPhoneNumberChanged(true)
    };

    const formatPhoneNumber = (text) => {
        const cleaned = ('' + text).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
          const formatted = `(${match[1]}${match[2] ? `) ${match[2]}` : ''}${match[3] ? `-${match[3]}` : ''}`;
          handlePhoneNumberChange(formatted);
        } else {
          handlePhoneNumberChange(text);
        }
    };

    // Effect to get AsyncStorage
    useEffect(() => {
        const checkdata = async () => {
            try {
                const dataFirstName = await AsyncStorage.getItem("firstName");
                const dataEmail = await AsyncStorage.getItem("email");
                const dataLastName = await AsyncStorage.getItem("lastName");
                const dataPhoneNumber = await AsyncStorage.getItem("phoneNumber");
                const checkbox1 = await AsyncStorage.getItem("checkbox1");
                const checkbox2 = await AsyncStorage.getItem("checkbox2");
                const checkbox3 = await AsyncStorage.getItem("checkbox3");
                const checkbox4 = await AsyncStorage.getItem("checkbox4");
                setFirstName(dataFirstName);
                setEmail(dataEmail);
                setLastName(dataLastName);
                setPhoneNumber(dataPhoneNumber);
                setCheckbox1(checkbox1 === "true");
                setCheckbox2(checkbox2 === "true");
                setCheckbox3(checkbox3 === "true");
                setCheckbox4(checkbox4 === "true");
            } catch (error) {
                console.log('Error reading data :', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkdata(); 
    }, []);

    const Checkbox = ({ label, checked, onPress }) => {
        return (
            <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
                <View style={[styles.checkbox, checked && styles.checkedCheckbox]}>
                    {checked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>{label}</Text>
            </TouchableOpacity>
        );
    };

    const handleSave = async () => {
        try {
            await AsyncStorage.clear();

            const userDetails = [
                ["checkbox1", String(checkbox1)],
                ["checkbox2", String(checkbox2)],
                ["checkbox3", String(checkbox3)],
                ["checkbox4", String(checkbox4)]
            ]
            if (isEmailValid) { userDetails.push(["email", email]) }
            if (isFirstNameValid) { userDetails.push(["firstName", firstName]) }
            if (isPhoneNumberValid) { userDetails.push(["phoneNumber", phoneNumber]) }
            if (isLastNameValid) { userDetails.push(["lastName", lastName]) }
            if (image !== null) { userDetails.push(["profileImage", image]) }
            await AsyncStorage.multiSet(userDetails);

            // Navigate to the Home screen
            navigation.navigate("Home");

        } catch (error) {
            console.log('Error saving data :', error);
        }
    };

    const handleDiscard = async () => {
        try {
            setLastName(null);
            setPhoneNumber(null);
            setCheckbox1(false);
            setCheckbox2(false);
            setCheckbox3(false);
            setCheckbox4(false);
            setImage(null);

            await AsyncStorage.clear();
            await AsyncStorage.setItem("firstName", firstName)
            await AsyncStorage.setItem("email", email)

            console.log('Profile status and user details removed');

            // Navigate to the Home screen
            navigation.navigate("Home");

        } catch (error) {
            console.log('Error saving data :', error);
        }
    };

    const handleSaveCriteria = () => {

        var flag = true
        if (isFirstNameChanged) {
            if (!isFirstNameValid) {
                flag = false
            }
        }
        if (isLastNameChanged) {
            if (lastName !== "") {
                if(!isLastNameValid) {
                    flag = false
                }
            }
        }
        if (isEmailChanged) {
            if (!isEmailValid) {
                flag = false
            }
        }
        if (isPhoneNumberChanged) {
            if (phoneNumber !== "") {
                if(!isPhoneNumberValid) {
                    flag = false
                }
            }
        }
        return flag
    }

    const pickImage = async () => {
        // Request permission to access media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access gallery is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        
        if (!result.canceled && result.assets.length > 0) {
            const imageUri = result.assets[0].uri; // Access the URI from the first asset
            setImage(imageUri); // Set the image URI in the state
            setIsImageChanged(true);
            console.log("the image uri is: ", imageUri); // Log the correct image URI
        }
    };
    
    const removeImage = () => {
        setImage(null);
        setIsImageChanged(false);
    };

    useEffect(() => {
        const getProfileImageURI = async () => {
            try {
                const imageURI = await AsyncStorage.getItem("profileImage");
                return imageURI;
            } catch (error) {
                console.error('Error during fetching image URI:', error);
            }
        };
    
        getProfileImageURI().then((result) => {
            if (result) {
                console.log("result is:", result); // This will log the correct result
                setImage(result); // Set the image
            }
        });
    }, []);


    const handleLogout = async () => {
        await AsyncStorage.clear();
        navigation.navigate("Onboarding")
    }
    if (isLoading) {return <SplashScreen />;}
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={require("../assets/Images/app/Logo.png")} style={styles.logo}/>
                </View>
                {image ? (
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: image }} style={styles.avatar}/>
                    </View>                
                ) : (
                    <View style={styles.avatarContainer}>
                        <View style={[styles.placeholder, styles.avatar]}>
                            <Text style={styles.placeholderText}>{firstName[0]}</Text>
                        </View>
                    </View>  
                )}
                
            </View>

            <Text style={styles.section1Text}>Personal information</Text>
            <View style={styles.section1}>
                
                {image ? (
                    <Image style={styles.personalImage} source={{ uri: image }} />
                ) : (
                    <View style={[styles.placeholder, styles.personalImage]}>
                        <Text style={styles.placeholderText}>{firstName[0]}</Text>
                    </View>
                )}

                <Pressable 
                    style={styles.imageChangeButton} 
                    onPress={pickImage}
                >
                    <Text style={styles.imageChangeButtonText}>Change</Text>
                </Pressable>




                <Pressable 
                    style={styles.imageRemoveButton} 
                    onPress={removeImage}
                    disabled={false}
                >
                    <Text style={styles.imageRemoveButtonText}>Remove</Text>
                </Pressable>
            </View>

            <View style={styles.section2}>

                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput 
                    style={[styles.inputBox, !isFirstNameValid && (isFirstNameChanged) && styles.inputError]} 
                    placeholder="Bizhan" 
                    onChangeText={handleFirstNameChange} 
                    value={firstName}
                />

                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput 
                    style={[styles.inputBox, !isLastNameValid && (isLastNameChanged && lastName!=="") && styles.inputError]} 
                    placeholder="Zahedi" 
                    onChangeText={handleLastNameChange} 
                    value={lastName}
                />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput 
                    style={[styles.inputBox, !isEmailValid && isEmailChanged && styles.inputError]} 
                    placeholder="example@gmail.com" 
                    onChangeText={handleEmailChange} 
                    keyboardType="email-address"
                    value={email}
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                    style={[styles.inputBox, !isPhoneNumberValid && (isPhoneNumberChanged && phoneNumber!=="") && styles.inputError]}
                    placeholder="(xxx) xxx-xxxx"
                    onChangeText={formatPhoneNumber}
                    value={phoneNumber}
                    keyboardType="phone-pad"
                    maxLength={14}
                    autoCorrect={false}
                    autoComplete="tel"
                />
            </View>

            <View style={styles.section3}>
                <Text style={styles.section3TextTop}>Email notifications</Text>
                <Checkbox
                    label="Order Statuses"
                    checked={checkbox1}
                    onPress={() => setCheckbox1(!checkbox1)}
                />
                <Checkbox
                    label="Password changes"
                    checked={checkbox2}
                    onPress={() => setCheckbox2(!checkbox2)}
                />
                <Checkbox
                    label="Special offers"
                    checked={checkbox3}
                    onPress={() => setCheckbox3(!checkbox3)}
                />
                <Checkbox
                    label="Newsletter"
                    checked={checkbox4}
                    onPress={() => setCheckbox4(!checkbox4)}
                />
            </View>    

            <View style={styles.section4}>
                <Pressable 
                    style={styles.logoutButton} 
                    onPress={handleLogout}
                    disabled={false}
                >
                    <Text style={styles.logoutText}>Log out</Text>
                </Pressable>
            </View>

            <View style={styles.section5}>
                <Pressable 
                    style={styles.discardButton} 
                    onPress={handleDiscard}
                    disabled={false}
                >
                    <Text style={styles.discardButtonText}>Discard changes</Text>
                </Pressable>
                {handleSaveCriteria()
                ? (
                    <Pressable 
                    style={styles.saveButton} 
                    onPress={handleSave}
                    disabled={false}
                    >
                        <Text style={styles.saveButtonText}>Save changes</Text>
                    </Pressable>
                ):(
                    <Pressable 
                    style={styles.saveButtonError} 
                    onPress={handleSave}
                    disabled={true}
                    >
                        <Text style={styles.saveButtonTextError}>Save changes</Text>
                    </Pressable>
                )}
                
            </View>

        </View>

    )
}


export default ProfileScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#FFFFFF",
    },

    ////////////////////////////////////////////////////
    header: {
        flex: 0.1,
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        marginTop: "1%",
        position: 'relative'
    },
    logoContainer: {
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: -100 }]
    },
    avatarContainer: {
        position: 'absolute',
        right: 20,
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: "contain",
    },
    avatar: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        borderWidth: 2, 
        borderColor: '#495E57',
        borderRadius: 30

    },
    ////////////////////////////////////////////////////
    section1: {
        flex: 0.2,
        flexDirection: "row",
        alignSelf: "left",
        marginLeft: "5%",
        marginBottom: "0%",
        justifyContent: 'center',  
        alignItems: 'center', 
    },
    personalImage: {
        height: 100,
        width: 100,
        resizeMode: "contain",
        borderRadius: 50
    },
    section1Text: {
        fontFamily: "Karla",
        fontSize: 20,
        marginLeft: '5%',
        alignSelf: "left"
    },
    imageRemoveButton: {
        marginLeft: "5%",
        borderColor: "#495E57",
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: '#FFFFFF'
    },
    imageRemoveButtonDisabled: {
        backgroundColor: '#d3d3d3', 
    },
    imageRemoveButtonText: {
        fontFamily: "Karla",
        fontSize: 20,
        padding: "2%",
        paddingLeft: "5%",
        paddingRight: "5%",
        color: "#495E57"
    },
    imageRemoveButtonTextDisabled: {
        color: "gray"
    },
    imageChangeButton: {
        marginLeft: "5%",
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: "#495E57"
    },
    imageChangeButtonText: {
        fontFamily: "Karla",
        fontSize: 20,
        padding: "2%",
        paddingLeft: "5%",
        paddingRight: "5%",
        color: "#F5F5F5"
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },    
    placeholderText: {
        fontSize: 40,
        color: '#555',
    },
    ////////////////////////////////////////////////////
    section2: {
        flex: 0.4,  
        paddingHorizontal: '5%',
        alignSelf: 'stretch',
        marginBottom: "15%"
    },
    inputLabel: {
        fontFamily: "Karla",
        fontSize: 15,
        marginBottom: '2%',
    },
    inputBox: {
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: "3%",
        marginBottom: '3%',
        width: '100%',
    },
    inputError: {
        borderColor: 'red'
    },
    ////////////////////////////////////////////////////
    section3: {
        flex: 0.25,
        alignSelf: "left",
        marginLeft: "5%",
    },
    section3TextTop: {
        fontFamily: "Karla",
        fontSize: 20,
        alignSelf: "left",
        marginBottom: "3%",

    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: "2%",
    },
    checkbox: {
        width: 15,
        height: 15,
        borderWidth: 2,
        borderColor: "#495E57",
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkedCheckbox: {
        backgroundColor: "#495E57",
    },
    checkmark: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontFamily: "Karla",
        fontSize: 16,
    },
    ////////////////////////////////////////////////////
    section4: {
        flex: 0.1,
        alignSelf: 'stretch',
    },
    logoutButton: {
        marginLeft: "5%",
        marginRight: "5%",
        borderColor: "#495E57",
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: "#F4CE14"
    },
    logoutText: {
        alignSelf: 'center',
        fontFamily: "Karla",
        fontSize: 20,
        padding: "2%",
        paddingLeft: "5%",
        paddingRight: "5%",
        color: "#495E57"
    },
    ////////////////////////////////////////////////////
    section5: {
        flex: 0.1,
        flexDirection: 'row',
    },
    saveButton: {
        height: "75%",
        width: "40%",
        marginLeft: "5%",
        marginRight: "5%",
        borderColor: "#495E57",
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: "#495E57"
    },
    saveButtonError: {
        height: "75%",
        width: "40%",
        marginLeft: "5%",
        marginRight: "5%",
        borderColor: "#495E57",
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: "#FFFFFF"
    },
    saveButtonText: {
        alignSelf: 'center',
        fontFamily: "Karla",
        fontSize: 20,
        padding: "5%",
        paddingLeft: "5%",
        paddingRight: "5%",
        color: "#FFFFFF"
    },
    saveButtonTextError: {
        alignSelf: 'center',
        fontFamily: "Karla",
        fontSize: 20,
        padding: "5%",
        paddingLeft: "5%",
        paddingRight: "5%",
        color: "#495E57"
    },
    discardButton: {
        height: "75%",
        width: "40%",
        marginLeft: "5%",
        marginRight: "5%",
        borderColor: "#495E57",
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: "#FFFFFF"
    },
    discardButtonText: {
        alignSelf: 'center',
        fontFamily: "Karla",
        fontSize: 20,
        padding: "5%",
        paddingLeft: "5%",
        paddingRight: "5%",
        color: "#495E57"
    },


});


