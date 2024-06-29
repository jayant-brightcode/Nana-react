import React, { useState, useEffect, useRef } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity,TextInput,TouchableWithoutFeedback,Modal,ActivityIndicator,ScrollView ,SafeAreaView, Platform} from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Remote } from '../Utils/Remote';
import { useRoute } from '@react-navigation/native';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import DateTimePicker from '@react-native-community/datetimepicker'
import CommentDialog from '../component/MemberShipDialog';
import { useTranslation } from 'react-i18next';



const skill_list = []

const rating_list = [{ _id: "Canknkj", name: "sdnksad" },
    { _id: "Candsknkj", name: "sdnksadd" }, { _id: "Canasfknkj", name: "dfzsdnksad" }, { _id: "Cddanasfknkj", name: "dfzsdnksad" }]
const languages = [
    { id: 1, name: 'I am a Employee (Job Seekers)' },
    { id: 2, name: 'I am a Employer' },


    // Add more languages as needed
];


const EmployeeDetailsScreen = () => {

    const navigation = useNavigation()
    const route = useRoute();
    const { user } = route.params
    const [get_skill, set_skill] = useState([]);
    const [rating, set_rating] = useState([]);
    const [get_name, set_name] = useState("");
    const [get_job_pref, set_job_pref] = useState("");
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
    const [mprofile, mset_profile] = useState({});
    const [images, setImages] = useState([]);
    const [isDialogVisible_member, setDialogVisible_member] = useState(false);
    const [job_type, set_job_type] = useState('');



    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
     i18n.changeLanguage(language);
   };

   useEffect(() => {
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
        getMyProfile();
    }, []);

    const handleItemPress = (item) => {
        set_job_type(item.name)
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
            <TouchableOpacity onPress={()=>{

                const data ={
                    photo:profile.profession_photo,
                    index:index
                }
                navigation.navigate("PhotoViewerScreen",{data:data})
            }}>
            <Image source={{ uri: Remote.BASE_URL+item.photo,borderRadius:10,borderColor:Colors.gray,borderWidth:2 }} style={{ width: 200, height: 200 }} />

            </TouchableOpacity>
         
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
       // setSelectedItem(item);
        const isAlreadyAdded = selected_skill.find((items) => items.skills.name === item.skills.name);

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

            
                set_profile(data.profile_details)
                set_name(data.profile_details.name)
              //  set_job_pref(data.profile_details.job_pref.name)
                 if(data.profile_details.customer_type=="employee"){
                    set_skill(data.profile_details.skills)
                 }
           
              //  set_job_pref_id(data.profile_details.job_pref._id)
                set_avg_rating(data.profile_details.avg_rating)
                set_like(data.profile_details.liked_by.length)


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
                mset_profile(data.profile_details)
               
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
                    text1: 'select employer to e the request',
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



    const AddtoCart = async () => {



        try {


           


            const token = await getToken()

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/add_to_cart";

            const userData = {
                to_user_id: user._id


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
                








            } else {
                if(response.status==401){
                    setLoading(false)
                    
                    openDialog_member()
                }else{
                    Toast.show({
                        type: 'success',
                        text1: responsedata.error,
                    });
                }
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
                <Text >{item.skills.name}</Text>
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
            let price=0;
            for (let index = 0; index < selected_skill.length; index++) {
                choosed_list.push(selected_skill[index].skills._id)


                console.log("SDSDSD",selected_skill)

                 if(job_type=="Daily Service"){
                    price = price + parseFloat(selected_skill[index].daily_price)

                 }else{
                     price = price + parseFloat(selected_skill[index].monthly_price)

                 }

                

            }

            console.log(price)
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
                to_user_id: user._id,
                desc: desc,
                skill:choosed_list,
                amount:price


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

            console.log(responsedata)


            if (response.ok) {
                // Handle success
                Toast.show({
                    type: 'success',
                    text1: responsedata.message,
                });
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

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={{ flex: 1,backgroundColor:Colors.white }}>


            <View style={{ height: 120,backgroundColor:Colors.orange }}>


            <TouchableOpacity style={{marginTop:15,marginStart:10}} onPress={()=>{
                   navigation.goBack()
              }}>

<Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')} />

              </TouchableOpacity>

                <Image style={{ width: 150, height: 150,alignSelf:'center',marginTop:'10%',borderRadius:500 }} source={{uri: Remote.BASE_URL+profile.profile}}></Image>


                <View style={{ flexDirection: 'row', height: 50, width: 50, alignItems: 'center', position: 'absolute', right: 20 }}>
                    <Image style={{ width: 23, height: 23 }} source={require('../../assets/images/like.png')}></Image>
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 14, marginTop: 3, marginStart: 3 }}>{like}</Text>

                </View>




            </View>

        

            
            <View style={{ alignItems: 'center', top: Platform.OS=='android'?'10%':'17%' }}>
               
                <Text style={{ color: Colors.black, fontWeight: 'bold', fontSize: 18 }}>{get_name}</Text>
                <Text style={{ color: Colors.textcolor, fontWeight: 'light', fontSize: 14 }}>Subscribed</Text>


            </View>

          
            <View style={{ height: 50,marginTop:Platform.OS=='android'?'23%':'30%' }}>
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

         
            <ScrollView>


            {/* {profile.customer_type=="employee" && (
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

            )} */}
           

            {/* <View style={{ height: 50, marginTop: 10 }}>

                <Text style={{ color: Colors.orange, alignSelf: 'center',borderColor:Colors.orange,borderWidth:1,padding:10 }}>{get_job_pref}</Text>
            </View> */}



          {profile.customer_type=="employee" && (

                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>

                    <TouchableOpacity style={styles.button1} onPress={() => {
                  
                       if(mprofile._id.toString()==user._id.toString()){
                        Toast.show({
                            type: 'success',
                            text1: `Invalid Request`,
                        });
                       }else{
                        { openDialog(c_type)}
                       }

                    
                    }


                    }>
                        <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>Job Request</Text>
                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={() => {
                    { AddtoCart()}
                    }


                    }>
                        <View >
                            <Text style={{borderColor:Colors.orange,borderWidth:1,marginTop:10,padding:10,textAlign:'center',color:Colors.orange,borderRadius:5,width:150}}>Add to Cart</Text>
                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                        </View>
                    </TouchableOpacity>

                    </View>
          )}

        

          




            <View style={{height:2,backgroundColor:Colors.dark_gray,marginTop:10}}>

             


            </View>
            <View style={{margin:10}}>
                <Text style={{ color: Colors.textcolor, marginStart: 10 ,fontWeight:'bold'}}>{t("Profession Name")}</Text>
                <Text style={{ color: Colors.textcolor, marginStart: 10,padding:10,backgroundColor:Colors.grayview,marginTop:2 }}>{profile.profession_name}</Text>


                <Text style={{ color: Colors.textcolor, marginStart: 10, marginTop: 10 ,fontWeight:'bold'}}>{t("Profession Experience")}</Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: "300", padding: 10, marginTop: 2 }}>{profile.profession_experience}</Text>
         

                <Text style={{ color: Colors.textcolor, marginStart: 10,marginTop:10,fontWeight:'bold' }}>{t("Profession Description")}</Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: "300", padding: 10, marginTop: 2 }}>{profile.profession_description}</Text>
         
         
                

                    <Text style={{ color: Colors.textcolor, marginStart: 10, marginTop: 10, fontWeight: 'bold' }}>{t("Pick Images")}</Text>

                    <FlatList
                        data={profile.profession_photo}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderImageItem}
                        horizontal
                    />
            </View>


            {profile.customer_type=="employee" && (
            <Text style={{color:Colors.black,alignSelf:'center',fontWeight:'bold'}}>{t("Skills")}</Text>

            )}
             <View>
             <FlatList style={{ marginTop: 20, marginBottom: 20 }}
                     data={get_skill}
                    
                     keyExtractor={(item) => item._id.toString()}
                     scrollEnabled={false}
                     renderItem={({ item }) => (

                
                            <View style={{flexDirection:'row',alignSelf:'center'}}>

                                

                            <View style={{backgroundColor:Colors.grayview,padding:10,borderRadius:10,width:360,marginTop:10,borderColor:Colors.orange,borderWidth:1}}>

                             <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                             <Text style={{color:Colors.textcolor,fontWeight:'bold'}}>{t("Skill Name")}</Text>
                             <Text style={{color:Colors.orange,fontWeight:'bold'}}> {item.skills==null ? "" : item.skills.name}</Text>



                            </View>

                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                            <Text style={{marginTop:10,color:Colors.textcolor,fontWeight:'400'}}>{t("Daily Price")}</Text>

                             <Text style={{marginTop:10,color:Colors.green,fontWeight:'bold'}}>  Rs. {item.daily_price}</Text>



                            </View>


                            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}>

                          
                            <Text style={{color:Colors.textcolor,fontWeight:'400'}}>{t("Monthly Price")}</Text>

                            <Text style={{color:Colors.textcolor,fontWeight:'bold'}}>Rs. {item.monthly_price}</Text>

                            </View>


                           
                            </View>

                    

                    </View>   
                    

                        

                      

                     )}
                 />
             </View>

         



            <View style={{margin:15}}>
                <Text style={{ color: Colors.black, alignSelf: 'center',marginTop:20 }}>{t("Reviews and Ratings")}</Text>
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
                        scrollEnabled={false}
                    data={rating}
                    verticle
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderRecentSearch}
                />
            </View>


            </ScrollView>

          

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
                                    minimumDate={new Date()}
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
      <Text style={{backgroundColor:Colors.grayview,padding:10}}>{item.skills.name}</Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
            console.log(item)
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


                                <View style={{flexDirection:'row'}}>

                                                                

                                <View style={{width:'100%'}}>

                                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                                        <Text style={{color:Colors.textcolor,fontWeight:'bold'}}>skill name</Text>
                                        <Text style={{color:Colors.orange,fontWeight:'bold'}}> {item.skills==null ? "" : item.skills.name}</Text>



                                        </View>

                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                                <Text style={{marginTop:10,color:Colors.textcolor,fontWeight:'400'}}>Daily Price </Text>

                                <Text style={{marginTop:10,color:Colors.green,fontWeight:'bold'}}>  Rs. {item.daily_price}</Text>



                                </View>


                                <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}>


                                <Text style={{color:Colors.textcolor,fontWeight:'400'}}>Monthly Price</Text>

                                <Text style={{color:Colors.textcolor,fontWeight:'bold'}}>Rs. {item.monthly_price}</Text>

                                </View>



                                </View>



                                </View>  

                                    
                                    {/* <Text style={{color:Colors.textcolor,fontWeight:'bold'}}>{item.skills.name}</Text>
                                    <Text style={{color:Colors.textcolor}}>Daily Price - Rs.{item.daily_price}</Text>
                                    <Text style={{color:Colors.textcolor}}>Monthly Price - Rs.{item.monthly_price}</Text>
                                     */}
                                </TouchableOpacity>

                            )}
                        />


                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                                <Text style={styles.buttonText}>send request</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={closeDialog}>
                                <Text style={{color:Colors.white,backgroundColor:Colors.red,borderRadius:10,padding:10,marginTop:10,width:80,textAlign:'center'}}>Close</Text>
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

                <Text style={{marginStart:10,fontWeight:'bold',alignSelf:'center',color:Colors.orange}}>Important Note</Text>
                   <Text style={{marginStart:10,marginEnd:10,marginTop:10,alignSelf:'center'}}>If you want to hire someone for a job or employment, you need to change your category because you are currently categorized as an employee. To become an employer, please change your category. You can change your category at any time in the future.</Text>
  
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
                    <TouchableOpacity  onPress={closeUserTypeDialog}>
                    <Text style={{color:Colors.white,backgroundColor:Colors.red,borderRadius:10,padding:10,marginTop:10,width:80,textAlign:'center'}}>Close</Text>

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
        </SafeAreaView>
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
      
        width:150

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

    
 

 
  



    icon: {
        width: 40,
        height: 40,
        // Change the icon color
    },

});


export default EmployeeDetailsScreen