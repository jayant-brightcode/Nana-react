import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator,StatusBar } from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { getToken } from "../Utils/LocalStorage.js";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { Remote } from "../Utils/Remote.js";



// const languages = [
//     { id: 1, name: 'English' },
//     { id: 2, name: 'Spanish' },
//     { id: 3, name: 'French' },
//     { id: 4, name: 'English' },
//     { id: 5, name: 'Spanish' },
//     { id: 6, name: 'French' },
//     { id: 7, name: 'English' },
//     { id: 8, name: 'Spanish' },
//     { id: 9, name: 'French' },
//     { id: 10, name: 'English' },
//     { id: 11, name: 'Spanish' },
//     { id: 13, name: 'French' },
//     { id: 123, name: 'English' },
//     { id: 12, name: 'Spanish' },
//     { id: 33, name: 'French' },
//     // Add more languages as needed
//   ];













const ChooseSkillScreen = () => {

    const navigation = useNavigation()

    const [selectedItem, setSelectedItem] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selected_skill, set_selected_skill] = useState([]);


    useEffect(() => {
        getLanguages();
    }, []);





    const handleItemPress = (item) => {
        setSelectedItem(item);
        Toast.show({
            type: 'success',
            text1: `Selected Language: ${item.name}`,
        });
        add_skill(item._id)
        selected_skill.push(item)


    };



    const getLanguages = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
           

            const response = await fetch(Remote.BASE_URL + "skill", {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });

            if (response.ok) {
                const data = await response.json();
              
                setLanguages(data.skill);
                setLoading(false)






            } else {
                console.error('Error:', response.status, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };

    const add_skill = async (skill_id) => {



       
       


        try {
         
            const token = await getToken();
            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/add_skill";
            

            const userData = {
                skill_id: skill_id

            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
                body: JSON.stringify(userData),
            });


            const responsedata = await response.json();

           
            
            


            if (response.ok) {
                // Handle success
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)
                


              
            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }





    };

    const delete_skill = async (skill_id) => {



        try {
            const token = await getToken();
            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/delete_skill";
  

            const userData = {
                skill_id: skill_id

            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
                body: JSON.stringify(userData),
            });


            const responsedata = await response.json();






            if (response.ok) {
                // Handle success
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)




            } else {
                // Handle error
                Toast.show({
                    type: 'success',
                    text1: responsedata.error,
                });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }





    };


 return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.blue}></StatusBar>
            <View style={styles.content}>
                <Text style={styles.text}>Choose releavent {'\n'}Skills</Text>
                <View style={styles.imageContainer}>
                    <Image source={require('../../assets/images/otp.png')} style={styles.image} />
                </View>
            </View>

            <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginTop: 20, marginStart: 20 }}>Select upto 5 matching skills</Text>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

           <View style={{flexDirection:'row',flexWrap:'wrap',margin:10}}>
         
      
          {selected_skill.map((item, index) => (
          
         <View style={styles.container2}>
             <Text style={styles.label}>{item.name}</Text>
                  
                  <TouchableOpacity style={styles.closeButton} onPress={() => {

                 
                       delete_skill(item._id)
                      selected_skill.splice(index, 1);
                      set_selected_skill([...selected_skill]);
                      
                      
                     


                  }}>
                 <Text style={styles.closeText}>X</Text>
             </TouchableOpacity>
              </View>))}
         </View>
 
            <FlatList style={{ marginTop: 20, marginBottom: 100 }}
                data={languages}
                numColumns={2} // Set the number of columns you want in your grid
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.itemContainer,
                            selectedItem === item && styles.selectedItem, // Apply selected style
                        ]}
                        onPress={() => handleItemPress(item)}
                    >
                        <Text style={styles.languageName}>{item.name}</Text>
                    </TouchableOpacity>

                )}
            />

         

            <View style={styles.footer}>



                <TouchableOpacity style={styles.button} onPress={() => {


                        if(selected_skill.length<1){
                            Toast.show({
                                type: 'success',
                                text1: `choose atleast 1 skill`,
                            });
                        } else if (selected_skill.length > 5) {
                                Toast.show({
                                    type: 'success',
                                    text1: `you can select maximum 5 skills`,
                                });
                            }else{
                            navigation.navigate("ProfileScreen")
                            }

               


                }}>
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Keep going</Text>
                        {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                    </View>

                </TouchableOpacity>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Set your desired background color
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center', // Center the text vertically
        backgroundColor: Colors.blue,
    },
    container2: {
        flex:0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        padding:10,
        margin: 4,
        alignSelf:'flex-start'
     
       


    },
    text: {
        color: Colors.white,
        fontSize: 23,
        fontWeight: 'bold',
        marginStart: 30,

    },
    imageContainer: {
        marginTop: 20,
        flex: 1,
        height:'40%',
        marginEnd: 10,
        alignItems: 'flex-end', // Align the image to the right
    },
    image: {
        width: 100,
        height: 80,
    },
    selectedItem: {
        backgroundColor: Colors.blue, // Highlight the selected item
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 50, // Adjust the height of each item
    },
    languageName: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        width: "100%",
        alignSelf: 'flex-end',

        padding: 20,
    },
    buttonContent: {
        flexDirection: 'row', // Align text and icon horizontally
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,

        marginRight: 5, // Adjust the spacing between text and icon
    },
    icon: {
        width: 40,
        height: 40,
        // Change the icon color
    },
    button: {
        backgroundColor: Colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop: 10
    },
    label: {
        marginRight: 8,
   
    },
    closeButton: {
        padding: 8,
    
        backgroundColor: '#bdbdbd',
    },
    closeText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ChooseSkillScreen