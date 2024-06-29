import React, { useState,useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView ,ActivityIndicator,Modal, SafeAreaView} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import { Rating, AirbnbRating } from 'react-native-ratings';

const languages = [
    { id: 1, name: 'I am a Employee (Job Seekers)' },
    { id: 2, name: 'I am a Employer' },


    // Add more languages as needed
];

const jobs_list = [
    { id: 1, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 2, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },
    { id: 3, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 4, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },
    { id: 5, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 6, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.pink },
    { id: 7, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.fadeOrange },
    { id: 8, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.pink },
    { id: 9, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 10, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },
    { id: 11, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 12, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/design.png'), cols: Colors.pink },




]


const CartScreen = ()=>{
    

    const navigation = useNavigation()

    const [cart, set_cart] = useState([])
    const [loading, setLoading] = useState(false);
    const [c_type, set_c_type] = useState('');
    const [selectedItem, setSelectedItem] = useState([]);
    const [isUserTypeDialogVisible, setUserTypeDialogVisible] = useState(false);

    useEffect(() => {
       get_cart();
    }, []);

    useEffect(() => {
        getMyProfile();
     }, []);




    const getMyProfile = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_profile"



            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();
                console.log("profile details", data.profile_details.customer_type)


                set_c_type(data.profile_details.customer_type)
               
                if (data.profile_details.customer_type == "employee") {
                    setSelectedItem(languages[0])
                }
                if (data.profile_details.customer_type == "employer") {
                    setSelectedItem(languages[1])
                }
                if (data.profile_details.customer_type == "both") {
                    setSelectedItem(languages[2])
                }



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

    const handleUserType = (item) => {
        setSelectedItem(item);
        Toast.show({
            type: 'success',
            text1: `Selected Category: ${item.name}`,
        });

        if (item.id == 1) {
            set_c_type("employee")
            const data = {
                screen: ""
            }



            update_category("employee")





        }
        if (item.id == 2) {
            set_c_type("employer")
            const data = {
                screen: ""
            }


            update_category("employer")

        }

        if (item.id == 3) {
            set_c_type("both")
            const data = {
                screen: ""
            }
            if (page.screen == "profile") {
                update_category("both")
            } else {
                navigation.navigate("RegistrationFormScreen", { page: data })
            }
        }





    };

    const openUserTypeDialog = () => {

        setUserTypeDialogVisible(true);
        


    };

    const closeUserTypeDialog = () => {
        setUserTypeDialogVisible(false);
    };

    const update_category = async (cust) => {



        try {


            if(cust=="employee"){
                Toast.show({
                    type: 'success',
                    text1: 'select employer to send the request',
                });

                return;
            }


            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/update_custome_type";

            const userData = {
                customer_type: cust


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
            console.log(responsedata)


            if (response.ok) {
                // Handle success
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
                setLoading(false)

                set_c_type("employer")


                

                closeUserTypeDialog()
                openDialog("employer")








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

    const renderJobItem = ({ item }) => { 

        console.log(item)
        
     const skillsString = item.to_user_id.skills.map(skill => skill.name).join(', ');
   
         

        
        return (
        <TouchableOpacity onPress={() => {

        }}>

            <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10 }}>
                <View
                    style={{
                        width: 50,
                        height: 80,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        backgroundColor: item.grayview,
                        alignItems: 'center',
                        marginStart:8,
                        justifyContent: 'center', // Center the content vertically
                    }}
                >
                        <Image style={{ width: 50, height: 50, borderRadius:50 }} source={{ uri: Remote.BASE_URL + item.to_user_id.profile }} />
                </View>
                    <View style={{ flex: 1, marginLeft: 14, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.to_user_id.name}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}><Text style={{ fontWeight: 'light' }}>Skills - </Text>{skillsString}</Text>
                  

                    </View>

                <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
                    <TouchableOpacity onPress={()=>{
                               navigation.navigate("EmployeeDetailScreen", { user: item.to_user_id })
                    }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/next.png')} />

                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>


    )};





    const get_cart = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_cart"

            // const queryParams = {
            //     category_id: category._id,

            // };

          

            // // Construct the URL with query parameters
            // const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;


            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_cart(data.cart);

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

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

    <View style={styles.container}>



        <View style={styles.topbar}>
            <View style={{ flexDirection: 'row', marginTop: Platform.OS=="android"?10:0, padding: 10, alignItems: 'center' }}>
                <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
                <View style={{ marginStart: 15, flex: 1 }}>
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>My Cart</Text>

                </View>


            </View>

        </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View>

                <FlatList

                    data={cart}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                />
            </View>


            <Modal visible={isUserTypeDialogVisible} animationType="fade" transparent>
                   
                   <View style={styles.modalContainer}>
                       <View style={styles.dialogContainer}>
   
                   <View>
   
                   <Text style={{marginStart:10}}>Change your type to Employer</Text>
   
                       <FlatList style={{ marginTop: 10, marginBottom: 20 }}
                           data={languages}
   
                           keyExtractor={(item) => item.id.toString()}
                           renderItem={({ item }) => (
                               <TouchableOpacity
                                   style={[
                                       styles.itemContainer,
                                       selectedItem === item && styles.selectedItem, // Apply selected style
                                       { flexDirection: 'row', justifyContent: 'space-between' }
                                   ]}
                                   onPress={() => handleUserType(item)}
                               >
                                   <Text style={[{ fontSize: 14 }, { color: selectedItem === item ? Colors.textcolor : Colors.dark_gray }, { fontWeight: selectedItem === item ? 'bold' : 'medium' }]}>{item.name}</Text>
                                   <Image
                                       source={selectedItem === item ? require('../../assets/images/green_right.png') : require('../../assets/images/blue_right.png')}
                                       style={{ width: 20, height: 20 }}
                                   />
   
                               </TouchableOpacity>
   
                           )}
                       />
                   </View>
                  
                  
                   <View style={styles.buttonContainer}>
                       <TouchableOpacity style={styles.button} onPress={closeUserTypeDialog}>
                           <Text style={styles.buttonText}>Close</Text>
                       </TouchableOpacity>
                   </View>
   
                   </View>
                   </View>
               </Modal>


        </View>
        </SafeAreaView>

    )

}






const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.white
    },
    selectedItem: {
        borderColor: Colors.blue,
        backgroundColor:Colors.blue
    },
    itemContainer: {

        flex: 1,
        padding: 10,
        borderColor: Colors.white,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 50, // Adjust the height of each item
    },
    planItem: {
        flexDirection: 'coloumn',
        justifyContent: 'space-between',
        padding: 10,
        width: 75,
        height:75,
        backgroundColor: Colors.navcolor,
        alignItems: 'center'

    },
    planYear: {
        fontSize: 11,

        fontWeight: 'bold',
    },
    planPrice: {
        fontSize: 16,
        width: 100,
        textAlign: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.white,
        color: Colors.white,
        padding: 10,
        backgroundColor: Colors.dark_gray
    },
    selectedItemPrice: {
        backgroundColor: Colors.blue,
        color: Colors.white,
        borderWidth: 0
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 80,

    },
    cat_item: {
        flexDirection: 'coloumn',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        margin: 3,
        width: 97,
        marginTop: 10,
        height: 97,
        backgroundColor: Colors.grayview,
        alignItems: 'center'

    },
    cat_item_font: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
    },

})




export default CartScreen