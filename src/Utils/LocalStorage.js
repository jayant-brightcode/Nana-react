import AsyncStorage from '@react-native-async-storage/async-storage';


// Save token to AsyncStorage
export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
       

    } catch (error) {
        console.error('Error saving token to AsyncStorage:', error);
    }
};



// Get token from AsyncStorage
export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        return token;
    } catch (error) {
        console.error('Error getting token from AsyncStorage:', error);
        return null;
    }
};

// Save token to AsyncStorage
export const saveLanguage = async (token) => {
    try {
        await AsyncStorage.setItem('language', token);
    } catch (error) {
        console.error('Error saving token to AsyncStorage:', error);
    }
};

// Get token from AsyncStorage
export const getSavedLanguage = async () => {
    try {
        const language = await AsyncStorage.getItem('language');
        return language;
    } catch (error) {
        console.error('Error getting token from AsyncStorage:', error);
        return null;
    }
};



// Remove token from AsyncStorage
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
    } catch (error) {
        console.error('Error removing token from AsyncStorage:', error);
    }
};