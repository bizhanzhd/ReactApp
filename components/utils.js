

// Regular expression for validating email format
const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};
// Regular expression for validating alphabetic characters
const isAlphabetic = (text) => {
    return /^[A-Za-z]+$/.test(text);
};
// Regular expression for validating numeric characters
const isNumeric = (text) => {
    const cleaned = text.replace(/\D/g, ''); // Remove non-numeric characters
    return /^[0-9]+$/.test(cleaned) && cleaned.length === 10; // Validate if it's all digits and exactly 10 digits
  };

const ImagePickerObj = ()  => {
    
  
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };
};

  

export {
    validateEmail,
    isAlphabetic,
    isNumeric,
    ImagePickerObj
}