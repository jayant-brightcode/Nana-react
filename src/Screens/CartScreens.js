import React, { useState, useEffect, useRef } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity,TextInput,TouchableWithoutFeedback,Modal,ActivityIndicator,ScrollView } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Remote } from '../Utils/Remote';
import { useRoute } from '@react-navigation/native';
import { getToken } from '../Utils/LocalStorage';
import DateTimePicker from '@react-native-community/datetimepicker'
import CommentDialog from '../component/MemberShipDialog';


const skill_list = []

const rating_list = [{ _id: "Canknkj", name: "sdnksad" },
    { _id: "Candsknkj", name: "sdnksadd" }, { _id: "Canasfknkj", name: "dfzsdnksad" }, { _id: "Cddanasfknkj", name: "dfzsdnksad" }]
const languages = [
    { id: 1, name: 'I am a Employee (Job Seekers)' },
    { id: 2, name: 'I am a Employer' },


    // Add more languages as needed
];


const CartScreens = () => {

    const navigation = useNavigation()
   // const route = useRoute();
   // const { user } = route.params
    const [get_skill, set_skill] = useState([]);
    const [rating, set_rating] = useState([]);
    
    const [cart, set_cart] = useState([])
    const [get_name, set_name] = useState("Nana Udyog");
    const [get_job_pref, set_job_pref] = useState("Nana Udyog");
    const [get_job_pref_id, set_job_pref_id] = useState("");
    const [desc, set_desc] = useState("");
    const [avg_rating,set_avg_rating] = useState(0)
    const [like, set_like] = useState(0)
 
    const [loading, setLoading] = useState(false);
   
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [get_job_pref_list, set_job_pref_list] = useState([]);

    const [selectedItem, setSelectedItem] = useState(get_job_pref_list[0]);
    const [selected_skill, set_selected_skill] = useState([]);
    const [c_type, set_c_type] = useState('');
    const [isUserTypeDialogVisible, setUserTypeDialogVisible] = useState(false);

    const [selectedType, setSelectedType] = useState(languages[0]);
    const [profile, set_profile] = useState({});
    const [images, setImages] = useState([]);
    const [isDialogVisible_member, setDialogVisible_member] = useState(false);
    const [next_id,set_next_id] = useState('')
    const [cart_item, set_cart_item] = useState('');

    useEffect(() => {
       getMyProfile();
    }, []);

    useEffect(() => {
        get_cart();
    }, []);



    const renderCart = ({ item }) => { 

       
        console.log(item)
     const skillsString = item.to_user_id.skills.map(skill => skill.name).join(', ');
   
    
         

        
        return (
        <TouchableOpacity onPress={() => {
               set_next_id(item.to_user_id._id)
               
               set_cart_item(item._id)
               getProfile(item.to_user_id._id)
              
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
                         <TouchableOpacity onPress={()=>{
                               navigation.navigate("EmployeeDetailScreen", { user: item.to_user_id })
                         }}>
                        <Image style={{ width: 50, height: 50, borderRadius:50 }} source={{ uri: Remote.BASE_URL + item.to_user_id.profile }} />

                         </TouchableOpacity>
                </View>
                    <View style={{ flex: 1, marginLeft: 14, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.to_user_id.name}</Text>
                        {/* <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}><Text style={{ fontWeight: 'light' }}>Skills - </Text>{skillsString}</Text> */}
                  

                    </View>

                <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
                    <TouchableOpacity onPress={()=>{
                             delete_cart(item._id)
                    }}>
                    <Image style={{ width: 40, height: 40 }} source={require('../../assets/images/remove_cart.png')} />

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

    const handleItemPress = (item) => {
        setSelectedItem(item);
        set_job_pref_id(item._id)
        Toast.show({
            type: 'success',
            text1: `Selected Category: ${item.name}`,
        });


    





    };

    const handleButtonPress_member = () => {
        // Handle button press action
        closeDialog_member();
        navigation.navigate("ChoosePlanScreen")
     
      };

    const openDialog_member = () => {
        setDialogVisible_member(true);
      };
    
      const closeDialog_member = () => {
        setDialogVisible_member(false);
      };

    const renderImageItem = ({ item, index }) => (
        <View style={{ margin: 5 }}>
            <Image source={{ uri: Remote.BASE_URL+item.photo,borderRadius:10,borderColor:Colors.gray,borderWidth:2 }} style={{ width: 200, height: 200 }} />
         
        </View>

    );
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

    const handleItemPress2 = (item) => {
        setSelectedItem(item);
        const isAlreadyAdded = selected_skill.find((items) => items.name === item.name);

        // If not found, add the new item to the array
        if (!isAlreadyAdded) {
            // Create a new array by cloning the existing array and adding the new item
            const updatedSkills = [...selected_skill, item];
            set_selected_skill(updatedSkills);
        } else {
            // Item is already in the array, handle accordingly (e.g., show a message)
           
        }
   
      







    };
    const openDialog = (type) => {

        if (type =="employee"){
            openUserTypeDialog()
        }else{
            getJobPreference();
            setDialogVisible(true);
        }

 
    };

    const openUserTypeDialog = () => {

        setUserTypeDialogVisible(true);
        


    };

    const closeUserTypeDialog = () => {
        setUserTypeDialogVisible(false);
    };


    const onDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate(selectedDate);
            setShowDatePicker(false);
        } else {
            setShowDatePicker(false);
        }
    };

    const openDatePicker = () => {
        setShowDatePicker(true);
    };
    const closeDialog = () => {
        setDialogVisible(false);
    };

    const handleButtonPress = () => {
        send_job_request()
        
        closeDialog();
    };
    useEffect(() => {
      //  getProfile();
    }, []);

    // useEffect(() => {
    //     get_ratings();
    // }, []);


    const getProfile = async (id) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_profile"

            
            const queryParams = {
                user_id:id

            };

            // Construct the URL with query parameters
            const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;


            const response = await fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

            
                set_profile(data.profile_details)
                set_name(data.profile_details.name)
              //  set_job_pref(data.profile_details.job_pref.name)
                set_skill(data.profile_details.skills)
              //  set_job_pref_id(data.profile_details.job_pref._id)
                set_avg_rating(data.profile_details.avg_rating)
                set_like(data.profile_details.liked_by.length)


                for (let index = 0; index < data.profile_details.skills.length; index++) {
                    skill_list.push(data.profile_details.skills[index]._id)
                    
                }

                openDialog(c_type)

                


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



    const get_ratings = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_rating"

            
            const queryParams = {
                user_id:user._id ,

            };

            // Construct the URL with query parameters
            const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;


            const response = await fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();

            

               
                set_rating(data.ratings)
              


                


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



    const delete_cart = async (id) => {



        try {


           


            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/delete_cart";

      

            const userData = {
                cart_id: id


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
                get_cart()
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




    



    const renderSkill = ({ item }) => {

     
       
        return (


            <View style={{padding:10,margin:10,backgroundColor:Colors.grayview}}>
                <Text >{item.name}</Text>
            </View>


        )
    };

    const renderRecentSearch = ({ item }) => {
       
        return (


          <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10 }}>
                    <View
                        style={{
                            width: 50,
                            height: 80,
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            backgroundColor: item.cols,
                            alignItems: 'center',
                            justifyContent: 'center', // Center the content vertically
                        }}
                    >
                        <Image style={{ width: 50, height: 50, resizeMode: 'center' }} source={{ uri: Remote.BASE_URL + item.rate_by.profile }} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 14 }}>

                        <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.rate_by.name}</Text>
                        <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>{item.review}</Text>
                
                        {/* <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>Job Preference - {item.jobPref.name}</Text> */}
                    </View>
                    <AirbnbRating
                
                       
                       count={5} // Number of rating items
                       reviews={['Terrible', 'Bad', 'Good', 'Great', 'Excellent']} // Optional review text
                       defaultRating={item.rating} // The rating to display (adjust as needed)
                       size={12} // Size of the rating items
                       showRating={true} // Set to false to hide the rating value
                       isDisabled={true}
                   />
                
                </View>
       


        )
    };


    const getJobPreference = async () => {


        try {

            const token = await getToken(); // Replace with your actual Bearer token

            const response = await fetch(Remote.BASE_URL + "get_job_preference", {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                set_job_pref_list(data.job_preferences)








            } else {
                console.error('Error:', response.status, response.statusText);

            }
        } catch (error) {
            console.error('Fetch error:', error);

        }





    };


    const send_job_request = async () => {


        if (!desc.trim()) {
            Toast.show({
                type: 'success',
                text1: `Please enter job description`,
            });
            return;
        }

        



        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/send_job_request";

   

            const choosed_list= []

            if (get_job_pref_id == '' || get_job_pref_id ==null){
                Toast.show({
                    type: 'success',
                    text1: `Please enter choose job preference`,
                });
                return;
            }

            for (let index = 0; index < selected_skill.length; index++) {
                choosed_list.push(selected_skill[index]._id)

            }
            if(choosed_list.length < 1){
                Toast.show({
                    type: 'success',
                    text1: `Please select atleas one skill`,
                });
                return;
            }






            const userData = {
                job_pref_id: get_job_pref_id,
                date: chosenDate,
                to_user_id: next_id,
                desc: desc,
                skill:choosed_list


            };

            const token = await getToken()

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
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

                delete_cart(cart_item)
                
                setLoading(false)

              


            } else {
                // Handle error
                if(response.status==401){
                    setLoading(false)
                    closeDialog()
                    openDialog_member()
                }else{
                    Toast.show({
                        type: 'success',
                        text: responsedata.error,
                    });
                }

            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false)

        }

    }










    return (
        <View style={{ flex: 1 }}>


        
        

           <View style={styles.topbar}>
            <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
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
                    renderItem={renderCart}
                />
            </View>


          
          

            <Modal visible={isDialogVisible} animationType="fade" transparent>
                <ScrollView>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20,fontWeight:'bold' }}>Enter job description</Text>

                        <TextInput multiline={true}  style={styles.input} placeholder="Enter job desc" value={desc} onChangeText={(text) => set_desc(text)} />

                        <View>
                            <Text style={styles.labelText}>Choose Date</Text>
                            <TouchableWithoutFeedback onPress={openDatePicker} >
                                <Text style={styles.rowinput}>{chosenDate.toDateString()}</Text>
                            </TouchableWithoutFeedback>
                            {showDatePicker && (
                                <DateTimePicker
                               
                                    value={chosenDate}
                                    mode="date"
                                    is24Hour={false}
                                    display="default"
                                    onChange={onDateChange}
                                />
                            )}
                        </View>

                        <Text>Select Job Preference</Text>

                        <View>


                            <FlatList style={{ marginTop: 10, marginBottom: 20 }}
                                data={get_job_pref_list.slice(0, 2)}
                                scrollEnabled={false}
                                keyExtractor={(item) => item._id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.itemContainer,
                                            selectedItem === item && styles.selectedItem, // Apply selected style
                                            { flexDirection: 'row', justifyContent: 'space-between' }
                                        ]}
                                        onPress={() => handleItemPress(item)}
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

                        <Text>Select the skills which you want</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10 }}>
  {selected_skill.map((item, index) => (
    <View key={index} style={styles.container2}>
      <Text style={styles.label}>{item.name}</Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          const updatedSkills = selected_skill.filter((_, i) => i !== index);
          set_selected_skill(updatedSkills);
        }}
      >
        <Text style={{ color: Colors.red, marginStart: 3, fontWeight: 'bold' }}>X</Text>
      </TouchableOpacity>
    </View>
  ))}
</View>

                        
                   

                        <FlatList style={{ marginTop: 10, marginBottom: 10 }}
                            data={get_skill}
                            scrollEnabled={false}
                           
                            keyExtractor={(item) => item._id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.itemContainer,
                                        selectedItem === item && styles.selectedItem, // Apply selected style
                                    ]}
                                    onPress={() => handleItemPress2(item)}
                                >
                                    <Text style={{color:Colors.textcolor}}>{item.name}</Text>
                                </TouchableOpacity>

                            )}
                        />


                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                                <Text style={styles.buttonText}>send request</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={closeDialog}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>

                      


                       
                    </View>
                </View>
                </ScrollView>
            </Modal>
       


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
          

          

            <CommentDialog
        isVisible={isDialogVisible_member}
        onClose={closeDialog_member}
        onButtonPress={handleButtonPress_member}
      />




        </View>
    )

}


const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    
       },
    container2: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        margin: 4,
        alignSelf: 'flex-start'




    },
    dialogContainer: {
        width:'90%',
        backgroundColor: 'white',
        padding: 20,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 10,
        
    },
    buttonContainer: {
        width:'100%',
        flexDirection: 'row',
         justifyContent:'space-between',
        marginTop: 20,
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    button: {
        backgroundColor: Colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
       
    },
    button1: {
        backgroundColor: Colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginStart:40,
        marginEnd:40

    },
 
    contentContainer: {
        flex: 1,
        top: 100,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    backgroundImage: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 200,     // Set the image width
        height: 120, // Ensure the image takes up the full height
    },
    logoImage: {


        width: 200,     // Set the image width
        height: 140, // Ensure the image takes up the full height
    },
    text: {
        color: Colors.red,
        fontWeight: 'bold',
        fontSize: 23
    },
    spacer: {
        width: 190,
        height: 5,
        backgroundColor: Colors.gray
    },



    input: {
        width: '100%',
        height:100,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        paddingLeft: 10,
        


    },
    subTextContainer: {
        width: '80%',
        marginBottom: 10,
        top: 30


    },
    textviews: {
        width: '100%',

        marginBottom: 10,
        top: 30,






    },
    buttonContent: {
        flexDirection: 'row', // Align text and icon horizontally
        alignItems: 'center',
        justifyContent: 'center',
      
    },
    buttonText: {
        color: 'white',
        
        fontSize: 16,
        marginRight: 5, // Adjust the spacing between text and icon
    },
    icon: {
        width: 20,
        height: 20,
        // Change the icon color
    },
 
    rowinput: {
        width: '100%',
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,


    },


    rowstyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
 
    selectedItem: {
        backgroundColor: Colors.white, // Highlight the selected item
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderColor: Colors.dark_gray,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        height: '12%', // Adjust the height of each item
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 80,

    },

    
 

 
  



    icon: {
        width: 40,
        height: 40,
        // Change the icon color
    },

});


export default CartScreens