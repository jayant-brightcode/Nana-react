import React, { useState, useEffect, useRef } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity,TextInput,TouchableWithoutFeedback,Modal,ActivityIndicator } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Remote } from '../Utils/Remote';
import { useRoute } from '@react-navigation/native';
import { getToken } from '../Utils/LocalStorage';
import DateTimePicker from '@react-native-community/datetimepicker'


const skill_list = []

const rating_list = [{ _id: "Canknkj", name: "sdnksad" },
    { _id: "Candsknkj", name: "sdnksadd" }, { _id: "Canasfknkj", name: "dfzsdnksad" }, { _id: "Cddanasfknkj", name: "dfzsdnksad" }]


const EmployeeDetailsScreen = () => {

    const navigation = useNavigation()
    const route = useRoute();
    const { user } = route.params
    const [get_skill, set_skill] = useState([]);
    const [rating, set_rating] = useState([]);
    const [get_name, set_name] = useState("Nana Udyog");
    const [get_job_pref, set_job_pref] = useState("Nana Udyog");
    const [get_job_pref_id, set_job_pref_id] = useState("");
    const [desc, set_desc] = useState("");
    const [avg_rating,set_avg_rating] = useState(0)

    const [loading, setLoading] = useState(false);
   
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const openDialog = () => {
        setDialogVisible(true);
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
        getProfile();
    }, []);

    useEffect(() => {
        get_ratings();
    }, []);


    const getProfile = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_profile"

            
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

            

                set_name(data.profile_details.name)
                set_job_pref(data.profile_details.job_pref.name)
                set_skill(data.profile_details.skills)
                set_job_pref_id(data.profile_details.job_pref._id)
                set_avg_rating(data.profile_details.avg_rating)

                for (let index = 0; index < data.profile_details.skills.length; index++) {
                    skill_list.push(data.profile_details.skills[index]._id)
                    
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







    const renderSkill = ({ item }) => {

        console.log(item)
       
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

            console.log("dsfsd" + get_job_pref_id)

            const userData = {
                job_pref_id: get_job_pref_id,
                date: chosenDate,
                to_user_id: user._id,
                desc: desc,
                skill:skill_list


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

    }










    return (
        <View style={{ flex: 1 }}>


            <View style={{ height: 220, backgroundColor: Colors.blue, borderBottomLeftRadius: 200, borderBottomRightRadius: 200 }}>


              

                <View style={{ alignItems: 'center', top: 20 }}>
                    <Image style={{ width: 100, height: 100 }} source={require('../../assets/images/profile.png')}></Image>
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 18 }}>{get_name}</Text>
                    <Text style={{ color: Colors.white, fontWeight: 'light', fontSize: 14 }}>Subscribed</Text>


                </View>

                <View style={{ flexDirection: 'row', height: 50, width: 50, alignItems: 'center', position: 'absolute', right: 20 }}>
                    <Image style={{ width: 23, height: 23 }} source={require('../../assets/images/like.png')}></Image>
                    <Text style={{ color: Colors.white, fontWeight: 'light', fontSize: 14, marginTop: 3, marginStart: 3 }}>36</Text>

                </View>




            </View>

        
          

          
            <View style={{ height: 50,marginTop:10 }}>
                <Text style={{ color: Colors.black ,alignSelf:'center'}}>Rating</Text>
                <AirbnbRating
                    count={5} // Number of rating items
                    reviews={['Terrible', 'Bad', 'OK', 'Good', 'Great']} // Optional review text
                    defaultRating={avg_rating} // The rating to display (adjust as needed)
                    size={15} // Size of the rating items
                    showRating={false} // Set to false to hide the rating value
                    isDisabled={true}
                />
            </View>

         

            <View>
                <Text style={{ color: Colors.black, alignSelf: 'center' }}>skills</Text>

                <View style={{alignItems:'center'}}>

                    <FlatList

                        data={get_skill}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderSkill}
                    />
                </View>
 
            </View>

            <View style={{ height: 50, marginTop: 10 }}>

                <Text style={{ color: Colors.orange, alignSelf: 'center',borderColor:Colors.orange,borderWidth:1,padding:10 }}>{get_job_pref}</Text>
            </View>

            <TouchableOpacity style={styles.button1} onPress={() => {
               { openDialog()}
             }


            }>
                <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Send Request</Text>
                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                </View>
            </TouchableOpacity>




            <View>
                <Text style={{ color: Colors.black, alignSelf: 'center',marginTop:20 }}>Reviews and Ratings</Text>
                <View style={{height:4,marginTop:10,backgroundColor:Colors.grayview}}></View>
            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View>

                <FlatList
                    style={{height:"40%"}}

                    data={rating}
                    verticle
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderRecentSearch}
                />
            </View>

          

            <Modal visible={isDialogVisible} animationType="fade" transparent>
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
            </Modal>
       

          

          






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
        backgroundColor: 'white'
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

});


export default EmployeeDetailsScreen