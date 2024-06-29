import React, { useState,useEffect } from 'react'

import { View,Switch, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView,ActivityIndicator,Platform, Alert} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Rating, AirbnbRating } from 'react-native-ratings';
import { getSavedLanguage, getToken, removeToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import ImagePicker, { openCropper } from 'react-native-image-crop-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import { Modal } from 'react-native';
import { useTranslation } from 'react-i18next';





const ProfileScreen = () => {

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false);

    const [get_name, set_name] = useState('');
    const [avg_rating,set_avg_rating] = useState(0)
    const [rating, set_rating] = useState([]);
    const [id,set_id] = useState('')
    const [like, set_like] = useState(0)
    const [image, setImage] = useState(null);
    const [photo,setPhoto] = useState('')
    const [mime, setmime] = useState('')
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [member_id, set_member_id] = useState('Member');

    const [switchValue, setSwitchValue] = useState(false);
    const [is_subscribed, set_is_subscribed] = useState(false);



     // const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);
 const { t, i18n } = useTranslation();

 const changeLanguage = (language) => {
  i18n.changeLanguage(language);
};


    const handleSwitchChange = () => {

        
        console.log(switchValue)
        setSwitchValue(!switchValue);
        console.log(!switchValue)
        ManageOpenToWork(!switchValue)
     
    };


     useEffect(() => {



        getProfile();
        fetchLanguage()

        
    }, []);


    const fetchLanguage = async () => {
        const lang = await getSavedLanguage();
    
        switch (lang) {
            case "English":
                changeLanguage("en");
                break;
            case "Hindi":
                changeLanguage("hi");
                break;
            case "Tamil":
                changeLanguage("ta");
                break;
            case "Gujrati":
                changeLanguage("gu");
                break;
            case "Assamese":
                changeLanguage("as");
                break;
            case "Kannada":
                changeLanguage("kn");
                break;
            case "Malayalam":
                changeLanguage("ml");
                break;
            case "Oriya":
                changeLanguage("or");
                break;
            case "Telugu":
                changeLanguage("te");
                break;
            case "Panjabi":
                changeLanguage("pa");
                break;
            case "Bengali":
                changeLanguage("ba");
                break;
            case "Marathi":
                changeLanguage("mr");
                break;
            default:
                // Handle default case, maybe fallback to English
                changeLanguage("en");
                break;
        }
    };
    

    useEffect(() => {
        check_registration_expiry();
    }, []);

    const openDialog = () => {

        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };


    // useEffect(() => {
    //     // Check and request permission on component mount
    //     requestPermission();
    // }, []);

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
                cropping:true
            });

            if (!result.cancelled) {
                setImage({ uri: result.path });
                if(Platform.OS=='ios'){
                    setPhoto(result.sourceURL)
                }else{
                    setPhoto(result.path)

                }
                console.log(result.path)
                setmime(result.mime)

            }
        } catch (error) {
            console.error(error);
        }
    };

  



    const check_registration_expiry = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token

            const response = await fetch(Remote.BASE_URL + "user/check_registration_expiry", {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });

            if (response.ok) {
                const data = await response.json();

                console.log("vvv",data)

              //  set_is_plan_purchased(data.status)

               

               
              //  if(data.expired_plan.length==0){
                   
                  
              if(data.is_purchased==true && data.renewal==false){
                console.log("hello")
                set_is_subscribed(true)
              }else{
                set_is_subscribed(false)
              }

                  
                    // if(data.renewal){
                    //     set_ismember("Subscribed")
                    // }else{
                    //     set_ismember("Not Subscribed")
                    // }
                

           
                   
              //  }else{
                   // set_is_plan_nenew(data.renewal)
                   // set_active_plan(data.expired_plan)
                
                
               // }

                
             
  

       

            

               
                setLoading(false)






            } else {
                console.error('Error:', response.error, response.statusText);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
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


          <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10,padding:10 }}>
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
                        <Image style={{ width: 50, height: 50,borderRadius:500, resizeMode: 'center', }} source={{ uri: Remote.BASE_URL + item.rate_by.profile }} />
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
                set_member_id(data.profile_details.member_id)
                setSwitchValue(data.profile_details.open_to_work)
              
                

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

    const ManageOpenToWork = async () => {

        



        try {

            console.log(!switchValue)

          
            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/manage_open_to_work";

            const userData = {
                status:!switchValue



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
                // Toast.show({
                //     type: 'success',
                //     text1: responsedata.message,
                // });
                setLoading(false)

                
              




            } else {
                // Handle error
                // Toast.show({
                //     type: 'success',
                //     text1: responsedata.error,
                // });
                setLoading(false)

            }
        } catch (error) {
            console.error('Error:', error);
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


    const deleteAccount = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/delete_account"



            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


                Toast.show({
                    type: 'success',
                    text1: data.message,
                });
                logout()
                

                setLoading(false)






            } else {
                console.error('Error:', response.status, response.error);
                setLoading(false)
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false)
        }





    };


    return (
        <View style={{ flex: 1 }}>


            <View style={{ height: 220, backgroundColor: Colors.blue, borderBottomLeftRadius: 200, borderBottomRightRadius: 200 }}>

          
           

                <View style={{ alignItems: 'center', top: Platform.OS=="android"?20:'24%'}}>

                    {photo === null ? (
                        <TouchableOpacity onPress={() => 
                            openDialog()
                       // pickImages()
                        }>
                            <Image
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                                source={require('../../assets/images/logo.png')}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={()=>{
                            openDialog()
                             //   pickImages()
                        }}>

                     
                        <Image
                            style={{ width: 100, height: 100,borderRadius:50 }}
                            source={{ uri: photo.startsWith("file") ? photo : Remote.BASE_URL+photo }} // Assuming photo is a valid URI
                        />
                            </TouchableOpacity>
                    )}


                    {/* {photo!=null && photo.startsWith("file") && (
                        <TouchableOpacity onPress={()=>{
                            update_profile_photo()
                        }}>
                            <Text style={{padding:10,borderWidth:2,borderColor:Colors.white,margin:3,color:Colors.white}}>Update Profile</Text>
                        </TouchableOpacity>
                    )} */}


                  
                       
                      
                    
                    {/* <TouchableOpacity onPress={() => {
                        pickImages()
                    }}>


                        <Image style={{ width: 100, height: 100 }} source={{ uri: photo }}></Image>
                    </TouchableOpacity> */}



                      
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 18 }}>{get_name}</Text>
                    <TouchableOpacity onPress={()=>{
                          navigation.navigate("MembershipHistoryScreen")
                    }}>
                        {Platform.OS=='android' && (
                            <Text style={{ color: Colors.white, fontWeight: 'medium', fontSize: 15 }}>{is_subscribed==false ? t("Not Subscribed") : t("Subscribed")}</Text>

                        )}
                            
                    </TouchableOpacity>


                </View>

                <View style={{ flexDirection: 'row', height: 50, width: 50, alignItems: 'center', position: 'absolute', right: 20,marginTop:Platform.OS=="android"?10:30 }}>
             
                    <Image style={{ width: 23, height: 23 }} source={require('../../assets/images/like.png')}></Image>
                    <Text style={{ color: Colors.white, fontWeight: 'light', fontSize: 14, marginTop: 3, marginStart: 3 }}>{like}</Text>

                </View>




            </View>

            <View style={styles.switchContainer}>
                <Text style={styles.hintText}>{t("Open to Work")}</Text>
                <Switch
                trackColor={{ false: 'gray', true: 'orange' }}
                thumbColor={switchValue ? 'white' : 'white'}
                ios_backgroundColor="orange"
                onValueChange={handleSwitchChange}
                value={switchValue}
                />
           </View>


           <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between',margin:10,alignItems:'center'}}>
          
           <View>
           <Text style={{ color: Colors.textcolor, fontWeight: 'light', fontSize: 14, marginTop: 3, marginStart: 3,alignSelf:'center' }}>{t("Member ID")}</Text>
            <Text style={{backgroundColor:Colors.gray,borderColor:3,padding:10, color: Colors.textcolor, fontWeight: 'light', fontSize: 14, marginTop: 3, marginStart: 3, alignSelf: 'center' }}>{member_id}</Text>

           </View>
          
          
           <View style={{marginEnd:'10%'}}>
           <Text style={{ color: Colors.textcolor,alignSelf:'center',marginTop:'2%' ,padding:8}}>{t("Rating")}</Text>
                    <AirbnbRating
                        count={5} // Number of rating items
                        reviews={['Terrible', 'Bad', 'OK', 'Good', 'Great']} // Optional review text
                        defaultRating={avg_rating} // The rating to display (adjust as needed)
                        size={15} // Size of the rating items
                        showRating={false} // Set to false to hide the rating value
                        isDisabled={false}
                    />
           </View>

          

           </View>

           
            

     
           
           


          


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

            <View style={{flex:1}}>

                <FlatList
                    style={{flex:1}}
                    verticle

                    data={rating}
                    
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item._id.toString()}
                    
                    renderItem={renderRecentSearch}
                    ListHeaderComponent={() => (
                        <ScrollView style={{ top: '5%' ,marginBottom:40,flex:1}}>
              
                        <View >
                            <View style={{flexDirection:'row',alignItems:'center',margin:10}}>
                                <Text style={{flex:3,color:Colors.textcolor,fontWeight:'medium',fontSize:17}}>{t("Job Request")}</Text>
                                <TouchableOpacity style={{backgroundColor:Colors.blue,padding:10,borderRadius:10,width:80}} onPress={()=>{
                                        navigation.navigate("TempJobScreen")
                                }}>
                                    <Text style={{textAlign:'center',color:Colors.white,fontSize:10}}>{t("View")}</Text>
                                </TouchableOpacity>
                              
            
                            </View>
                            <View style={{height:2,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10}}/>
            
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Professional Skill")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                        navigation.navigate("ChooseSkillScreen")
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
                                </TouchableOpacity>
                             
            
                            </View>
                            <View style={{height:2,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10}}/>
            
            
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Category")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                       
                                       const data = {
                                         screen:"profile"
                                       }
                                       
                                       navigation.navigate("ChooseEmployeeTypeScreen",{page:data})
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
                                </TouchableOpacity>
                             
            
                            </View>
                            <View style={{height:2,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10}}/>


                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Language")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                       
                                       const data = {
                                         screen:"profile"
                                       }
                                       
                                       navigation.replace("ChooseLanguageScreen",{page:data})
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
                                </TouchableOpacity>
                             
            
                            </View>
            
                            <View style={{height:2,backgroundColor:Colors.dark_gray,marginStart:10,marginEnd:10}}/>
            
            
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Profile")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                     const data = {
                                        screen:"profile"
                                      }
                                  
                                    
                                    navigation.navigate("RegistrationFormScreen",{page:data})
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
                                </TouchableOpacity>
                            
            
                            </View>
            
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Change Phone Number")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                  
                                  
                                    
                                    navigation.navigate("SendOtpForResetPhoneScreen")
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
                                </TouchableOpacity>
                            
            
                            </View>
            
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
                          
                          
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Change Email Address")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                  
                                  
                                    
                                    navigation.navigate("SendOtpForResetEmailScreen")
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
                                </TouchableOpacity>
                            
            
                            </View>
            
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
                          
                          
                          
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Leaves")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                   
                                  
                                    
                                    navigation.navigate("LeaveApplicationScreen")
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
                                </TouchableOpacity>
                            
            
                            </View>
            
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
                                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                    <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Contract Job")}</Text>
                                    <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={() => {



                                        navigation.navigate("ContractScreen")
                                    }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
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
            
                           {Platform.OS=='android' && (


<View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Membership History")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                    navigation.navigate("MembershipHistoryScreen")
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
                                </TouchableOpacity>
                              
                                
                            </View>
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />

</View>
                           )}

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
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Recent Activities")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                    navigation.navigate("RecentActivityScreen")
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("View")}</Text>
                                </TouchableOpacity>
      
            
                            </View>
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />

                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Logout")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                   logout()
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("Logout")}</Text>
                                </TouchableOpacity>
      
            
                            </View>
                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
                            

                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                <Text style={{ flex: 3, color: Colors.textcolor, fontWeight: 'medium', fontSize: 17 }}>{t("Delete My Account")}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.blue, padding: 10, borderRadius: 10, width: 80 }} onPress={()=>{
                                    Alert.alert(
                                        'Delete My Account!',
                                        'Are you sure you want to permanently delete your account?',
                                        [
                                          {
                                            text: 'Cancel',
                                            style: 'cancel',
                                          },
                                          {
                                            text: 'Yes',
                                            onPress: () => {
                                              // Handle "Yes" button press
                                              deleteAccount() 
                                            },
                                          },
                                        ],
                                        { cancelable: false }
                                      );
                                }}>
                                    <Text style={{ textAlign: 'center', color: Colors.white, fontSize: 10 }}>{t("Delete")}</Text>
                                </TouchableOpacity>
      
            
                            </View>
            


                            <View style={{ height: 2, backgroundColor: Colors.dark_gray, marginStart: 10, marginEnd: 10 }} />
            
            
                        </View>
            
            
                        <View>
                            <Text style={{ color: Colors.black, alignSelf: 'center',marginTop:20 }}>{t("Reviews and Ratings")}</Text>
                            <View style={{height:4,marginTop:10,backgroundColor:Colors.grayview}}></View>
                        </View>
            
            
                   
                 
            
                     
            
            
                       
                        </ScrollView>
                      )}
                />
            </View>


            <Modal visible={isDialogVisible} animationType="fade" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Profile Image</Text>

                        <View style={{ alignItems: 'center', top: 20 }}>

                            {photo === null ? (
                                <TouchableOpacity onPress={() =>
                                    openDialog()
                                    // pickImages()
                                }>
                                    <Image
                                        style={{ width: 300, height: 300, borderRadius: 50 }}
                                        source={require('../../assets/images/logo.png')}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => {
                                    openDialog()
                                    //   pickImages()
                                }}>


                                    <Image
                                        style={{ width: 300, height: 300, borderRadius: 50 }}
                                        source={{ uri: photo.startsWith("file") ? photo : Remote.BASE_URL + photo }} // Assuming photo is a valid URI
                                    />
                                </TouchableOpacity>
                            )}


                            {photo != null && photo.startsWith("file") && (
                                <TouchableOpacity onPress={() => {
                                    update_profile_photo()
                                }}>
                                    <Text style={{ padding: 10, borderWidth: 2, borderColor: Colors.white, margin: 3, color: Colors.white }}>Update Profile</Text>
                                </TouchableOpacity>
                            )}






                            {/* <TouchableOpacity onPress={() => {
                        pickImages()
                    }}>


                        <Image style={{ width: 100, height: 100 }} source={{ uri: photo }}></Image>
                    </TouchableOpacity> */}


                            <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 18 }}>{get_name}</Text>
                            {Platform.OS=="android" && (
                       <Text style={{ color: Colors.white, fontWeight: 'medium', fontSize: 15 }}>{is_subscribed==false ? t("Not Subscribed") : t("Subscribed")}</Text>

                            )}
     

                        </View>

                      

                        <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                            <TouchableOpacity onPress={() => {
                                closeDialog()
                            }}>
                                <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>Close</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                 pickImages()
                            }}>
                                <Text style={{backgroundColor:Colors.orange,padding:8,borderRadius:8,color:Colors.white}}>Change Photo</Text>
                            </TouchableOpacity>
                        </View>

                        {photo != null && photo.startsWith("file") && (
                            <TouchableOpacity onPress={() => {
                                update_profile_photo()
                            }}>
                                <Text style={{borderRadius:10,marginTop:10,width:'80%',alignSelf:'center',textAlign:'center', padding: 10, borderWidth: 2, borderColor: Colors.orange, margin: 3, color: Colors.orange }}>Update Profile</Text>
                            </TouchableOpacity>
                        )}
                       







                    </View>
                </View>
            </Modal>



 
            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 20,marginTop:Platform.OS=="android"?10:'8%' }}>
               
            <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                }}>
                <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
                </TouchableOpacity>

              
                </View>



        </View>
    )

}

const styles = StyleSheet.create({

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


    container2: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        padding: 10,
        margin: 4,
        alignSelf: 'flex-start'




    },

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
        backgroundColor: '#e0e0e0',
        padding: 10,
        margin: 4,
        alignSelf: 'flex-start'




    },
    dialogContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 10,

    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center'
      },
      hintText: {
        marginRight: 10,
        color:Colors.black,
        fontWeight:'bold'
      },


});


export default ProfileScreen