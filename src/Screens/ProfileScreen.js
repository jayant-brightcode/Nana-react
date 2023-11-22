import React, { useState,useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView,ActivityIndicator,Platform } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Rating, AirbnbRating } from 'react-native-ratings';
import { getToken, removeToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS } from 'react-native-permissions';




const ProfileScreen = () => {

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false);

    const [get_name, set_name] = useState('Nana Udyog');
    const [avg_rating,set_avg_rating] = useState(0)
    const [rating, set_rating] = useState([]);
    const [id,set_id] = useState('')
    const [like, set_like] = useState(0)
    const [image, setImage] = useState(null);
    const [photo,setPhoto] = useState('')
    const [mime, setmime] = useState('')


    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        // Check and request permission on component mount
        requestPermission();
    }, []);

    const requestPermission = async () => {
        try {
            const permission =
                Platform.OS === 'android'
                    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                    : PERMISSIONS.IOS.PHOTO_LIBRARY;

            const result = await request(permission);
            if (result === 'granted') {
                console.log('Permission granted');
            } else {
                console.log('Permission denied');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const pickImages = async () => {
        try {
            const result = await ImagePicker.openPicker({
          
                mediaType: 'photo',
            });

            if (!result.cancelled) {
                setImage({ uri: result.path });
                setPhoto(result.path)
                console.log(result)
                setmime(result.mime)

            }
        } catch (error) {
            console.error(error);
        }
    };

  





    const get_ratings = async (id) => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_rating"

            
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
                console.log("dadda",data)

            

               
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

    const logout = async (id) => {


     

         await removeToken()
         navigation.popToTop();
         navigation.replace("LoginScreen")
       
         



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
                        <Image style={{ width: 50, height: 50, resizeMode: 'center', }} source={{ uri: Remote.BASE_URL + item.rate_by.profile }} />
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

    const getProfile = async () => {


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


                set_name(data.profile_details.name)
                set_avg_rating(data.profile_details.avg_rating)
                set_id(data.profile_details._id)
                get_ratings(data.profile_details._id)
                set_like(data.profile_details.liked_by.length)
                setPhoto(data.profile_details.profile)
              
                

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

    const update_profile_photo = async () => {

         try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/update_profile_photo";

        

            const formData = new FormData();
    

            // Append video file to FormData
            if (image) {
                console.log(image)
          
                formData.append('profile_image', {
                    uri: image.uri,
                    type: mime,
                    name: `image_.jpg`,
                });
            }

          

  

            const token = await getToken()

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
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
            console.error('Error:', error.message);
            setLoading(false)

        }

    }

    return (
        <View style={{ flex: 1 }}>


            <View style={{ height: 220, backgroundColor: Colors.blue, borderBottomLeftRadius: 200, borderBottomRightRadius: 200 }}>


                <View style={{ height: 50, position: 'absolute', start: 20, top: 10 }}>
                  
                </View>

                <View style={{ alignItems: 'center', top: 20 }}>

                    {photo === null ? (
                        <TouchableOpacity onPress={() => pickImages()}>
                            <Image
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                                source={require('../../assets/images/profile.png')}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={()=>{
                                pickImages()
                        }}>

                     
                        <Image
                            style={{ width: 100, height: 100,borderRadius:50 }}
                            source={{ uri: photo.startsWith("file") ? photo : Remote.BASE_URL+photo }} // Assuming photo is a valid URI
                        />
                            </TouchableOpacity>
                    )}


                    {photo!=null && photo.startsWith("file") && (
                        <TouchableOpacity onPress={()=>{
                            update_profile_photo()
                        }}>
                            <Text style={{padding:10,borderWidth:2,borderColor:Colors.white,margin:3,color:Colors.white}}>Update Profile</Text>
                        </TouchableOpacity>
                    )}


                  
                       
                      
                    
                    {/* <TouchableOpacity onPress={() => {
                        pickImages()
                    }}>


                        <Image style={{ width: 100, height: 100 }} source={{ uri: photo }}></Image>
                    </TouchableOpacity> */}

                      
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 18 }}>{get_name}</Text>
                    <Text style={{ color: Colors.white, fontWeight: 'light', fontSize: 14 }}>Subscribed</Text>


                </View>

                <View style={{ flexDirection: 'row', height: 50, width: 50, alignItems: 'center', position: 'absolute', right: 20 }}>
                    <Image style={{ width: 23, height: 23 }} source={require('../../assets/images/like.png')}></Image>
                    <Text style={{ color: Colors.white, fontWeight: 'light', fontSize: 14, marginTop: 3, marginStart: 3 }}>{like}</Text>

                </View>




            </View>
            <Text style={{ color: Colors.textcolor,alignSelf:'center',marginTop:'2%' }}>Rating</Text>
                    <AirbnbRating
                        count={5} // Number of rating items
                        reviews={['Terrible', 'Bad', 'OK', 'Good', 'Great']} // Optional review text
                        defaultRating={avg_rating} // The rating to display (adjust as needed)
                        size={15} // Size of the rating items
                        showRating={false} // Set to false to hide the rating value
                        isDisabled={false}
                    />

     

           


          


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={{flex:1}}>

                <FlatList
                    style={{marginBottom:'10%'}}
                    verticle

                    data={rating}
                    
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item._id.toString()}
                    
                    renderItem={renderRecentSearch}
                    ListHeaderComponent={() => (
                        <ScrollView style={{ top: '5%' ,marginBottom:20}}>
              
                        <View >
                            <View style={{flexDirection:'row',alignItems:'center',margin:10}}>
                                <Text style={{flex:3,color:Colors.textcolor,fontWeight:'medium',fontSize:17}}>Job Request</Text>
                                <TouchableOpacity style={{backgroundColor:Colors.blue,padding:10,borderRadius:10,width:80}} onPress={()=>{
                                        navigation.navigate("JobRequestScreen")
                                }}>
                                    <Text style={{textAlign:'center',color:Colors.white,fontSize:10}}>View</Text>
                                </TouchableOpacity>
                              
            
                            </View>
                            <View style={{height:2,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10}}/>
            
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Professional Skill</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                        navigation.navigate("ChooseSkillScreen")
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                                </TouchableOpacity>
                             
            
                            </View>
                            <View style={{height:2,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10}}/>
            
            
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Category</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                       
                                       const data = {
                                         screen:"profile"
                                       }
                                       
                                       navigation.navigate("ChooseEmployeeTypeScreen",{page:data})
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                                </TouchableOpacity>
                             
            
                            </View>
            
                            <View style={{height:2,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10}}/>
            
            
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Profile</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                     const data = {
                                        screen:"profile"
                                      }
                                  
                                    
                                    navigation.navigate("RegistrationFormScreen",{page:data})
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View/Edit</Text>
                                </TouchableOpacity>
                            
            
                            </View>
            
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Leaves</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                   
                                  
                                    
                                    navigation.navigate("LeaveApplicationScreen")
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View/Edit</Text>
                                </TouchableOpacity>
                            
            
                            </View>
            
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
                                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                    <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Contract Job</Text>
                                    <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={() => {



                                        navigation.navigate("ContractScreen")
                                    }}>
                                        <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                                    </TouchableOpacity>


                                </View>

                                <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />

                           
                           
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Notification</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Edit</Text>
                                </TouchableOpacity>
            
                            </View> */}
                            {/* <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} /> */}
            
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Membership History</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                    navigation.navigate("MembershipHistoryScreen")
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                                </TouchableOpacity>
                              
            
                            </View>
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
{/*             
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Chat board</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Edit</Text>
                                </TouchableOpacity>
            
                            </View>
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
             */}
            
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Wallet History</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Edit</Text>
                                </TouchableOpacity>
            
                            </View>
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
             */}
            
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Recent Activity</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }}>
                                    <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Edit</Text>
                                </TouchableOpacity>
            
                            </View>
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
             */}
            

                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Logout</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                   logout()
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>logout</Text>
                                </TouchableOpacity>
      
            
                            </View>
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
                            <View style={{ margin: 10 }}>
                                <Text style={{  color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>Work</Text>
                                <View style={{flexDirection:'row'}}>
                                    <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                            navigation.navigate("WorkHistoryScreen")
                                    }}>
                                        <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Monthly</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }} onPress={() => {
                                            navigation.navigate("WorkHistoryScreen")
                                    }}>
                                        <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Daily</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: Colors.grayview, padding: 10, borderRadius: 10, width: 80, marginStart: 10 }} onPress={() => {
                                            navigation.navigate("WorkHistoryScreen")
                                    }}>
                                        <Text style={{ textAlign: 'center', color: Colors.textcolor, fontSize: 10 }}>Yearly</Text>
                                    </TouchableOpacity>
                                </View>
            
            
                            </View>
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
            
                        </View>
            
            
                        <View>
                            <Text style={{ color: Colors.black, alignSelf: 'center',marginTop:20 }}>Reviews and Ratings</Text>
                            <View style={{height:4,marginTop:10,backgroundColor:Colors.grayview}}></View>
                        </View>
            
            
                   
                 
            
                     
            
            
                       
                        </ScrollView>
                      )}
                />
            </View>






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


export default ProfileScreen