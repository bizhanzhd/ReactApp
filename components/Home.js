import { Keyboard, View, Text, StyleSheet, Image, TextInput, FlatList, TouchableOpacity, TouchableWithoutFeedback, Pressable, Alert, Filter} from "react-native";
import React, { useEffect, useState, useCallback } from 'react';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as dbFunctions from "../components/db";
import { useFocusEffect } from '@react-navigation/native';

const loadFonts = async () => {
    await Font.loadAsync({
        'Karla': require('../assets/Fonts/Karla-Regular.ttf'),
        'Markazi': require('../assets/Fonts/MarkaziText-Regular.ttf'),
    });
};


function HomeScreen({navigation}){

    // state to track categories
    const [filters, setFilters] = useState([]); // To hold filter labels
    const [activeFilters, setActiveFilters] = useState([]); // To hold active states
    const [groupedEntriesByCategory, setgroupedEntriesByCategory] = useState({});
    const [groupedEntriesByName, setgroupedEntriesByName] = useState({});
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEntries, setFilteredEntries] = useState({});
    const [nameFirst, setNameFirst] = useState(null);
    const [imageURI, setImageURI] = useState(null);
    const imageMap = {
        "lemonDessert.jpg": require("../assets/Images/app/lemonDessert.jpg"),
        "grilledFish.jpg": require("../assets/Images/app/grilledFish.jpg"),
        "pasta.jpg": require("../assets/Images/app/pasta.jpg"),
        "greekSalad.jpg": require("../assets/Images/app/greekSalad.jpg"),
        "bruschetta.jpg": require("../assets/Images/app/bruschetta.jpg"),
    };

    // Effect to load database
    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                await dbFunctions.createTable(); // Create the table
                await dbFunctions.fetchDataAndPopulateDB(); // Fetch and populate the database
                
                const uniqueCategories = await dbFunctions.fetchUniqueCategories(); // Fetch unique categories
                setFilters(uniqueCategories); // Set filters with unique categories
                setActiveFilters(new Array(uniqueCategories.length).fill(false)); // Initialize active filters
                
                const groupedEntriesByCategory = await dbFunctions.getEntriesByCategory(); // Get entries by category
                setgroupedEntriesByCategory(groupedEntriesByCategory); // Set the grouped entries
                // console.log('Grouped entries by categories:', groupedEntriesByCategory); // Log grouped entries

                const groupedEntriesByName = await dbFunctions.getEntriesByName(); // Get entries by category
                setgroupedEntriesByName(groupedEntriesByName); // Set the grouped entries
                // console.log('Grouped entries by names:', groupedEntriesByName); // Log grouped entries
    
            } catch (error) {
                console.error('Error during database initialization:', error);
            }
        };
        initializeDatabase();
    }, []);

    // Effect to load AsyncStorage
    useFocusEffect(
        useCallback(() => {
          const getProfileName = async () => {
            try {
              const name = await AsyncStorage.getItem("firstName");
              return name;
            } catch (error) {
              console.error('Error during fetching Name:', error);
            }
          };
      
          const getProfileImageURI = async () => {
            try {
              const imageUri = await AsyncStorage.getItem("profileImage");
              return imageUri;
            } catch (error) {
              console.error('Error during fetching image URI:', error);
            }
          };
      
          // Fetch the profile data when the screen is focused
          getProfileName().then((result) => {
            setNameFirst(result[0]);
          });
      
          getProfileImageURI().then((result) => {
            setImageURI(result);
          });
      

        }, [])
    );

    // State to track font loading
    const [fontsLoaded, setFontsLoaded] = useState(false);

    // Effect to load fonts
    useEffect(() => {
        loadFonts()
            .then(() => setFontsLoaded(true))
            .catch(error => console.log(error)); // Handle any errors
    }, []);

    const toggleFilter = (index) => {
      const updatedActiveFilters = [...activeFilters];
      updatedActiveFilters[index] = !updatedActiveFilters[index]; // Toggle the filter state
      setActiveFilters(updatedActiveFilters);
    };

    const handleOutsidePress = () => {
        if (isSearchVisible) {
            setIsSearchVisible(false);
            Keyboard.dismiss(); // Dismiss the keyboard if it's open
        }
    };

    const renderItemList = (item) => {
        return (
            
            <View style={styles.categoryAndImage}>
                <View style={styles.categoryContainer}>
                    <Text style={styles.flatListTopic}>{item.name}</Text>
                    <Text style={styles.flatListDescription}>{item.description}</Text>
                    <Text style={styles.flatListPrice}>${item.price}</Text>
                </View>
                <View style={styles.imageContainer}>
                    <Image style={styles.flatListImage} source={imageMap[item.image]} />
                </View>
            </View>
        )
    };

    const searchEntriesByName = (searchTerm, entries) => {
        // Create a regular expression pattern from the search term, using 'i' flag for case-insensitive matching
        const regex = new RegExp(searchTerm, 'i');
    
        // Filter the entries and gather matching values into an array
        const results = Object.keys(entries).reduce((acc, name) => {
            if (regex.test(name)) {
                acc.push(...entries[name]); // Gather the values (items) into the results array
            }
            return acc;
        }, []);
    
        return results; // Return the array of matched entries
    };

    // Main View
    return (
        
        <View style={styles.container}>
            <View style={styles.header}>

            <View style={styles.logoContainer}>
                <Image source={require("../assets/Images/app/Logo.png")} style={styles.logo} />
            </View>

            {imageURI ? (
                <View style={styles.avatarContainer}>
                    <Pressable onPress={() => navigation.navigate("Profile")}>
                        <Image source={{ uri: imageURI }} style={styles.avatar} />
                    </Pressable>
                </View>              
            ) : (
                <View style={styles.avatarContainer}>
                    <Pressable onPress={() => navigation.navigate("Profile")}>
                        <View style={[styles.placeholder, styles.avatar]}>
                            <Text style={styles.placeholderText}>{nameFirst}</Text>
                        </View>
                    </Pressable>
                </View>  
            )}

            
            {/* <View style={styles.avatarContainer}>
                <Pressable onPress={() => navigation.navigate("Profile")}>
                    <Image source={require("../assets/Images/app/Profile.png")} style={styles.avatar} />
                </Pressable>
            </View> */}





            </View>
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.body}>
                    <Text style={styles.bodyTextTopic}>Little Lemon</Text>
                    <Text style={styles.bodyTextSubTopic}>Chicago</Text>
                    <View style={styles.subTopicContainer}>
                        <Text style={styles.bodyText}>We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                        <Image style={styles.subTopicImage} source={require("../assets/Images/app/Hero image.png")} />
                    </View>

                    {/* Conditionally render the Pressable (search button) or the search bar */}
                    {!isSearchVisible ? (
                        <Pressable style={styles.search} onPress={() => setIsSearchVisible(true)}>
                            <Image style={styles.searchBotton} source={require("../assets/Images/app/search.png")} />
                        </Pressable>
                    ) : (
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search..."
                            autoFocus={true}
                            onChangeText={text => {
                                setSearchTerm(text);
                                const results = searchEntriesByName(text, groupedEntriesByName); // Assuming groupedEntries contains your items
                                setFilteredEntries(results);
                            }}
                        />
                    )}
                </View>
            </TouchableWithoutFeedback>

            <Text style={styles.upperFilterText}>Order for Delivery!</Text>
            <View style={styles.filtersContainer}>
                {filters.map((filter, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => toggleFilter(index)}
                        style={[styles.filterBox, activeFilters[index] && styles.activeFilter]}>
                        <Text style={[styles.filterText, activeFilters[index] && styles.activeFilterText]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.containerFlatList}>
            <FlatList
                data={
                    (isSearchVisible) && (filteredEntries.length === 0)
                        ? [] // Return an empty array if search is visible and no entries are found
                        : (isSearchVisible) && (filteredEntries.length > 0)
                            ? filteredEntries // Use the filtered entries if there are any
                            : activeFilters.every((isActive) => !isActive)
                                ? filters.flatMap((filter) => groupedEntriesByCategory[filter] || [])
                                : filters.filter((_, index) => activeFilters[index]).flatMap((filter) => groupedEntriesByCategory[filter] || [])
                }
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => renderItemList(item)}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No items to display</Text>}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                keyboardShouldPersistTaps="handled" // Ensure taps on items are registered
            />
            </View>
        </View>
        
    );
}

export default HomeScreen;



const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#FFFFFF",
    },
    //////////////////////////////////////////////////////////////
    header: {
        flex: 0.1,
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
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
        borderRadius: 30,
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
    //////////////////////////////////////////////////////////////
    body: {
        flex: 0.42,  // Adjust this value if needed
        alignItems: 'center',
        justifyContent: 'top',  // Center the content vertically
        backgroundColor: '#495E57',
        width: '100%',
        marginBottom: "2%"
    },
    bodyTextTopic: {
        marginBottom: -20,
        fontFamily: "Markazi",
        fontSize: 60,
        alignSelf: "left",
        width: "70%",
        marginLeft: 10,
        color: "#F4CE14"
    },
    bodyTextSubTopic: {
        fontFamily: "Markazi",
        marginBottom: 5,
        fontSize: 40,
        alignSelf: "left",
        width: "70%",
        marginLeft: 10,
        color: '#d3d3d3'
    },
    bodyText: {
        fontFamily: "Karla",
        fontSize: 20,
        alignSelf: "left",
        width: "60%",
        marginLeft: 10,
        color: '#d3d3d3',
        marginRight: 0
    },    
    subTopicContainer: {
        flexDirection: 'row', 
        alignSelf: 'left', 
        marginBottom: 5, 
    },
    subTopicImage: {
        width: 150, 
        height: 150, 
        resizeMode: 'cover',
        borderRadius: 16,
        marginTop: -30
    },
    search: {
        alignSelf: "left",
    },
    searchBotton:{
        height: 50,
        width: 50,
        resizeMode: 'contain',
        backgroundColor: '#d3d3d3',
        alignSelf: "left",
        marginLeft: "7%",
        borderRadius: 30,
        marginBottom: "5%"
    },
    searchBar: {
        height: 50,
        width: "92%",
        borderColor: '#d3d3d3',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf: "left",
        marginLeft: "3%",
        borderRadius: 30,
        marginBottom: "3%",
        marginTop: "1%"
    },
    //////////////////////////////////////////////////////////////
    filtersContainer: {
        flex: 0.055,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: "left",
        marginLeft: "5%"
    },
    upperFilterText: {
        fontFamily: "Karla",
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 5,
        alignSelf: "left",
        marginLeft: "5%",
    },
    filterBox: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 16,
        marginRight: 10,
        backgroundColor: "#e6e6e6",
    },
    activeFilter: {
        backgroundColor: '#495E57',
    },
    filterText: {
        color: 'black',
    },
    activeFilterText: {
        color: "#e6e6e6",
    },
    //////////////////////////////////////////////////////////////
    containerFlatList:{
        flex: 0.475,
        marginTop: "2%",
        marginLeft: "3%",
    },
    categoryAndImage: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    categoryContainer: {
        padding: 8,
        flex: 0.7,
    },
    flatListTopic: {
        fontFamily: "Karla",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: "1%",
        alignSelf: "left"

    },
    flatListDescription: {
        fontFamily: "Karla",
        fontSize: 13,
        marginBottom: "1%",
        alignSelf: "left"
    },
    flatListPrice: {
        fontFamily: "Karla",
        fontSize: 17,
        alignSelf: "left"
    },
    flatListImage: {
        height: 80,
        width: 80,
        resizeMode: "cover",
        borderRadius: 10
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 0.3,
        paddingRight: "3%",
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc', // Color of the separator
        marginVertical: 8, // Add some spacing between items
    },
    emptyMessage: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
        color: '#888',
    },
});