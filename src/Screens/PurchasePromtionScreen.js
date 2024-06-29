import React, { useState,useEffect } from 'react';
import {  Alert,Button, FlatList ,TouchableWithoutFeedback, View, Image, TextInput, ActivityIndicator, StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform ,Modal} from 'react-native';
import Colors from '../Utils/Color';
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message';
import { Remote } from '../Utils/Remote.js';
import DateTimePicker from '@react-native-community/datetimepicker'
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import { getSavedLanguage, getToken } from '../Utils/LocalStorage';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';

import RazorpayCheckout from 'react-native-razorpay'
import {Buffer} from 'buffer'


import { useTranslation } from 'react-i18next';

const PurchasePromotionScreen = () => {

    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    const [referal_code, set_referal_code] = useState(null);

    const [loading, setLoading] = useState(false);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [chosenDate1, setChosenDate1] = useState(new Date());
    const [showDatePicker1, setShowDatePicker1] = useState(false);
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [progress,set_progress] = useState("0")
    const [isDialogVisible, setDialogVisible] = useState(false);


    const [show_pay_btn,set_show_pay_btn] = useState(false)

    const [amount,set_amount] = useState(false)

    const [selectedValue, setSelectedValue] = useState('state');
    const [state, set_state] = useState('');
    const [district, set_district] = useState('');
    const [selected_state_id, set_selected_state_id] = useState('');
    const [selected_district_id, set_selected_district_id] = useState('');
    const [state_list, set_state_list] = useState([]);
    const [distrcit_list, set_distrcit_list] = useState([]);
    const [isDialogVisibleReferal, setDialogVisibleReferal] = useState(false);
  
    const [isDialogVisible2, setDialogVisible2] = useState(false);
    const [selected_state_id_for_district, set_selected_state_id_for_district] = useState('');
    const [per_day_charge, set_per_day_charge] = useState('');
    const [address, set_address] = useState('');
    const [is_show_address,set_is_show_address] = useState(false)
    const [isDialogVisiblepayment, setDialogVisiblepayment] = useState(false);


    const [phone_number, set_phone_number] = useState('');
    const [email_address, set_email_address] = useState('');


    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
     i18n.changeLanguage(language);
   };



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
  getProfile()

}, []);

    useEffect(() => {
     // fetchLanguage()
      get_state();
      }, []);

      useEffect(() => {
       GetPromtionPerDayCharge();
      }, []);
    
    const handleRadioButtonChange = (value) => {
        console.log(value)
        setSelectedValue(value);
    };

    const openDialog = () => {

        setDialogVisible(true);
      };
    
      const closeDialog = () => {
        setDialogVisible(false);
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


         
                set_phone_number(data.profile_details.phone)
                set_email_address(data.profile_details.email)

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

      const openDialogreferal = () => {

        setDialogVisibleReferal(true);
      };
    
      const closeDialogreferal = () => {
        setDialogVisibleReferal(false);
      };


      const openDialog1 = () => {



        if(selected_state_id_for_district==''){
    
          Toast.show({
            type: 'success',
            text1: `please choose state`,
          });
          return;
        }
    
        get_district(selected_state_id_for_district)
    
        setDialogVisible2(true);
      };
    
      const closeDialog1 = () => {
        setDialogVisible2(false);
      };

      const select_state = (item) => {


        set_selected_state_id(item._id)
        set_selected_state_id_for_district(item.id)
        set_state(item.name)
       
        //get_district(item.id)
        closeDialog()
      
        Toast.show({
          type: 'success',
          text1: `Selected Category: ${item.name}`,
        });
    
    
      };
    
      const select_district = (item) => {
    
    
        set_selected_district_id(item._id)
        set_district(item.name)
        closeDialog1()
     
    
    
        Toast.show({
          type: 'success',
          text1: `Selected Category: ${item.name}`,
        });
    
    
      };


     const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({ ...region, latitude, longitude });
       
        
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;

    console.log(coordinate)
    setMarkerPosition(coordinate);
   // setIsMapModalVisible(false)
  };

  const handleGetLocation = () => {
    if (markerPosition) {
      console.log(
        `Selected Location: Latitude ${markerPosition.latitude}, Longitude ${markerPosition.longitude}`
      );
      // Handle the selected location as needed

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${markerPosition.latitude}&lon=${markerPosition.longitude}`)
      .then((response) => response.json())
      .then((json) => {
        const addressComponent = json.display_name;
        set_address(addressComponent);
        set_is_show_address(true)
      
      })
      .catch((error) => setLoading(false));
    } else {
      console.log('No location selected');
    }
    setIsMapModalVisible(false);
  };


    


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

    // const pickImages = async () => {
    //     try {
    //         const results = await ImagePicker.openPicker({
    //             multiple: true,
    //             mediaType: 'photo',
    //             cropping:true,
                
    //         });

    //         const croppedImages = [];

    //         for (const image of results) {
    //           const croppedImage = await ImagePicker.openCropper({
    //             path: image.path,
         
    //             // Add any other cropping options as needed
    //           });
        
    //           if (croppedImage) {
    //             croppedImages.push(croppedImage);
    //           }
    //         }

    //         if (!results.cancelled) {
    //             setImages([...images, ...results.map((image) => ({ uri: image.path }))]);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const pickImages = async () => {
        try {
            const results = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                cropping: true,
            });
    
            const croppedImages = [];
    
            for (const image of results) {
                const croppedImage = await ImagePicker.openCropper({
                    path: image.path,
                    // Add any other cropping options as needed
                });
    
                // Use the cropped image in the loop
                if (croppedImage) {
                    croppedImages.push({ uri: croppedImage.path });
                }
            }
    
            if (croppedImages.length > 0) {
                // Set the state with cropped images
                setImages([...images, ...croppedImages]);
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    const pickVideo = async () => {
        try {
            const result = await ImagePicker.openPicker({
                mediaType: 'video',
            });

            console.log(result.duration)
         

            if (!result.cancelled) {
              const minDuration = 30000;  // 30 seconds in milliseconds
              const maxDuration = 120000; // 3 minutes in milliseconds
              
              if (result.duration < minDuration || result.duration > maxDuration) {
                  Toast.show({
                      type: 'error',
                      text1: 'Video length should be between 30 seconds and 2 minutes',
                  });
              } else {
                  setVideo({ uri: result.path });
              }
                
            }
        } catch (error) {
            console.error(error);
        }
    };



  const get_state = async () => {


    try {

      const token = await getToken(); // Replace with your actual Bearer token

      const response = await fetch(Remote.BASE_URL + "get_state", {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json', // Adjust content type as needed
        },
      });



      if (response.ok) {
        const data = await response.json();


        set_state_list(data.states)












      } else {
        console.error('Error:', response.status, response.statusText);

      }
    } catch (error) {
      console.error('Fetch error:', error);

    }





  };

  const get_district = async (id) => {


    try {

       if(selected_state_id_for_district == ''){

         Toast.show({
           type: 'success',
           text1: `Please choose state`,
         });
          return;
       }

      let apiUrl = Remote.BASE_URL + "get_district"
      const token = await getToken(); // Replace with your actual Bearer token

      const queryParams = {
        parent_id: id,

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


        set_distrcit_list(data.districts)












      } else {
        console.error('Error:', response.status, response.statusText);

      }
    } catch (error) {
      console.error('Fetch error:', error);

    }





  };

    const removeVideo = () => {
        setVideo(null);
    };


    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const renderImageItem = ({ item, index }) => (
        <View style={{ margin: 5 }}>
            <Image source={{ uri: item.uri }} style={{ width: 200, height: 150 }} />
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'red',
                    padding: 5,
                    borderRadius: 10,
                }}
                onPress={() => removeImage(index)}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
            </TouchableOpacity>
        </View>
        
    );

    const renderVideo = () => {
        if (video) {
            return (
                <View style={{ marginTop: 20, position: 'relative' }}>
                    <Text>Selected Video:</Text>
                    <Image source={{ uri: video.uri }} style={{ width: 100, height: 100, marginTop: 10 }} />
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            backgroundColor: 'red',
                            padding: 5,
                            borderRadius: 10,
                        }}
                        onPress={removeVideo}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    };

    const onDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            setShowDatePicker(false);
            setChosenDate(selectedDate);
           
            set_show_pay_btn(false)
        } 
        
    };


    const onDateChange1 = (event, selectedDate) => {
        if (event.type === 'set') {
            setShowDatePicker1(false);
            setChosenDate1(selectedDate);
            
            set_show_pay_btn(false)
        } 
      
    };

    const openDatePicker = () => {

        setShowDatePicker(true);
    };

    const openDatePicker1 = () => {

        setShowDatePicker1(true);
    };


    const GetPromtionPrice = async () => {


        const d1  = chosenDate.toDateString()
        const d2 = chosenDate1.toDateString()

        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/get_promotion_price";

           

             const d1  = chosenDate.toDateString()
             const d2 = chosenDate1.toDateString()
             const userData = {
                from_date: d1,
                to_date:d2
             };

             console.log(userData)


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

                console.log(responsedata)
               
                set_amount(responsedata.amount_to_pay)
                set_show_pay_btn(true)
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

    const GetPromtionPerDayCharge = async () => {



      try {

         // setLoading(true)
          const apiUrl = Remote.BASE_URL + "user/get_promotion_price";

         

           const userData = {
            check:"without_date"
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

           //   console.log("fff"+responsedata.price.price_per_day)
             
           
              set_per_day_charge(responsedata.price.price_per_day)
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


  const handlePaymentSuccess = async (razorpay_payment_id) => {
    try {
      const razorpayKeyId = 'rzp_live_YCbbttwTGEwnOk';
      const razorpayKeySecret = 'MjUZUm0CUQDRB0ollk4xBECe';
        const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
  
        const razorpayResponse = await axios.get(
          `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
          {
            headers: {
              Authorization: `Basic ${auth}`
            }
          }
        );
  
        const paymentDetails = razorpayResponse.data;

        purchase_promotion(paymentDetails)
  
       
  
      
      } catch (error) {
        Alert.alert('Error', `Failed to fetch or save payment details: ${error.message}`);
        setDialogVisiblepayment(false)

      }


}

  const doPayment =  () => {


    try {
        setLoading(true)
        setDialogVisiblepayment(true)


     
        var options = {
            description: 'NANA HELPS',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: 'rzp_live_YCbbttwTGEwnOk', // Your api key
            amount: amount * 100,
            name: 'NANA HELPS',
           
            prefill: {
              email: email_address,
              contact: phone_number,
              name: 'Razorpay Software'
            },
            theme: {color: '#F37254'},
  
          }
          RazorpayCheckout.open(options).then((data) => {
            // handle success
          console.log(`Success: ${JSON.stringify(data)}`); // Convert the object to a JSON string

          handlePaymentSuccess(data.razorpay_payment_id)
           




        }).catch((error) => {
            // handle failure
            console.log(`Error: ${error.code} | ${error.description}`);
            setDialogVisiblepayment(false)


          });




       
    } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false)
        setDialogVisiblepayment(false)

    }





};
 

  const purchase_promotion = async (details) => {
    if (!desc.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter  description`,
      });
      return;
    }
  
    if (!title.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter Title`,
      });
      return;
    }
  
    try {
      setLoading(true);
      const apiUrl = Remote.BASE_URL + "user/purchase_promotion";
      const formData = new FormData();
  
      // Append video file to FormData
      if (video) {
        formData.append('promotion_video', {
          uri: video.uri,
          type: 'video/mp4',
          name: 'promotion_video.mp4',
        });
      }
  
      // Append each image file to FormData
      images.forEach((image, index) => {
        formData.append('promotion_images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        });
      });
  
      if (selectedValue === "location" && !markerPosition) {
        Toast.show({
          type: 'success',
          text1: `Please select location`,
        });
        setLoading(false);
        return;
      }
  
      formData.append('title', title);
      formData.append('desc', desc);
      formData.append('from_date', chosenDate.toDateString());
      formData.append('to_date', chosenDate1.toDateString());
      formData.append('payment_amount', amount);
      formData.append('payment_mode', details.method);
      formData.append('payment_status', 'success');
      formData.append('referal_code', referal_code);
     formData.append('payment_id', details.id);

  
      if (selectedValue === "location") {
        formData.append('latitude', markerPosition.latitude);
        formData.append('longitude', markerPosition.longitude);
      }
  
      if (selectedValue === "state") {
        formData.append('state', selected_state_id);
      }
  
      if (selectedValue === "district") {
        formData.append('state', selected_state_id);
        formData.append('district', selected_district_id);
      }
  
      formData.append('promotion_type', selectedValue);
  
      const token = await getToken();
  
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {

          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
           set_progress(percentCompleted.toString())
        //  console.log(`Uploaded ${progressEvent.loaded} bytes out of ${progressEvent.total}`);

        },
      });
  
      const responsedata = response.data;



      console.log(responsedata)
  
      if (response.status === 201) {
        

        if(Platform.OS=="android"){
          Toast.show({
            type: 'success',
            text1: "promotion purchased",
          });
        }else{
          Toast.show({
            type: 'success',
            text1: "promotion uploaded",
          });
        }
        set_progress("0")
        setLoading(false);

        const data  = {
          screen:"setting"
      }
      // navigation.replace("MyPurchasedPromotionScreen",{page:data})
        navigation.replace("HomeScreen")
        //this is changed beacuse of some bug initially it was moving to PurchasePromotionScreen

      } else {
        Toast.show({
          type: 'success',
          text1: "error occured",
        });
        setLoading(false);
        set_progress("0")
        setDialogVisiblepayment(false)
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      set_progress("0")
      setDialogVisiblepayment(false)

    }
  };
  
  


    return (

        <View style={styles.container}>

        <TouchableOpacity style={{position:'absolute',top:Platform.OS=='android'?10:40,marginStart:'3%'}} onPress={()=>{
                    navigation.goBack()
                }}>
                <Image style={{ width: 20, height: 20 ,tintColor:Colors.black}} source={require('../../assets/images/arrow.png')}></Image>
                </TouchableOpacity>
            <StatusBar backgroundColor={Colors.orange} />
            <View style={styles.contentContainer}>
                {/* Input fields and button */}



      

          
                <Text style={styles.text}>{t("Promote")}</Text>
                <Text style={{ color: Colors.dark_gray, fontWeight: 'bold', fontSize: 15 }}>{t("for your profile")}</Text>


                <ScrollView style={styles.subTextContainer} automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                   
                        <View  style={{top:30,marginBottom:100}}>
                        

                            {loading && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#0000ff" />
                                </View>
                            )}





                         {Platform.OS=='android' && (
 <Text style={{ fontSize:11,color: Colors.textcolor,fontWeight:'bold',color:Colors.orange,marginTop:5,backgroundColor:Colors.gray,padding:10,width:'100%',marginBottom:10 }}>Note - <Text style={{color:Colors.textcolor,fontWeight:'300'}}>1.{t("Promotion/Day charge is")} <Text style={{fontWeight:'bold',color:Colors.orange}}>Rs.{per_day_charge}</Text>.</Text></Text>

                         )}
                        

                            <TextInput style={styles.input} placeholder={t("Enter title here")} value={title} onChangeText={(text) => setTitle(text)} />
                            <TextInput style={{height:100,backgroundColor:Colors.grayview,borderRadius:10,paddingStart:10,borderWidth:1,borderColor:Colors.orange}} multiline={true} placeholder={t("Enter description here")}  value={desc} onChangeText={(text) => setDesc(text)} />
                            <View style={{marginBottom:10,marginTop:5}}>
                                <Text style={styles.labelText}>{t("From Date")}</Text>
                                <TouchableWithoutFeedback  onPress={openDatePicker} >
                                    <Text style={{ height: 45, backgroundColor: Colors.grayview ,marginTop:10,padding:10,borderWidth:1,borderColor:Colors.orange}} >{chosenDate.toDateString()}</Text>
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

                            <View>
                                <Text style={styles.labelText}>{t("To Date")}</Text>
                                <TouchableWithoutFeedback onPress={openDatePicker1} >
                                    <Text style={{ height: 45, backgroundColor: Colors.grayview, marginTop: 10, padding: 10,borderWidth:1,borderColor:Colors.orange }} >{chosenDate1.toDateString()}</Text>
                                </TouchableWithoutFeedback>
                                {showDatePicker1 && (
                                    <DateTimePicker

                                        value={chosenDate1}
                                        mode="date"
                                        is24Hour={false}
                                        display="default"
                                        onChange={onDateChange1}
                                    />
                                )}
                            </View>

                            <Text style={{marginTop:10}}>{t("Select Area for Promotion")}</Text>


                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>

                              <View>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton.Item
                                value="state"
                                mode="android"
                                status={selectedValue === 'state' ? 'checked' : 'unchecked'}
                                onPress={() => handleRadioButtonChange('state')}
                                color='#ce0000'
                                />
                                <Text>{t("State")}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton.Item
                                value="district"
                                mode='android'
                                status={selectedValue === 'district' ? 'checked' : 'unchecked'}
                                onPress={() => handleRadioButtonChange('district')}
                                color='#ce0000'
                                />
                                <Text>{t("District")}</Text>
                            </View>

                              </View>

                              <View style={{marginEnd:10}}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton.Item
                                value="location"
                                mode='android'
                                status={selectedValue === 'location' ? 'checked' : 'unchecked'}
                                onPress={() => handleRadioButtonChange('location')}
                                color='#ce0000'
                                />
                                <Text>{t("Location")}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton.Item
                                value="panIndia"
                                mode='android'
                           
                                status={selectedValue === 'pan_india' ? 'checked' : 'unchecked'}
                                onPress={() => handleRadioButtonChange('pan_india')}
                                color='#ce0000'
                                />
                                <Text>{t("Pan India")}</Text>
                            </View>


                              </View>

                            </View>

                           

                         



                            {selectedValue=="state" && (

                                   <View>


                                    <Text style={{marginTop:10}}>{t("Select State")}</Text>
                                    <TouchableOpacity style={{top:10}} onPress={()=>{
                                        openDialog();
                                    }}>
                                        <Text style={{borderColor:Colors.orange,borderWidth:2,padding:10,color:Colors.orange,borderRadius:10,marginBottom:10,textAlign:'center'}}>{state != '' ? t(state) : t("Select your State")}</Text>

                                    </TouchableOpacity>
 
                                    </View>

                            )}



                            {selectedValue =="district" && (
                                <View>

                                    <Text style={{marginTop:10}}>{t("Select State")}</Text>
                                    <TouchableOpacity style={{top:10}} onPress={()=>{
                                        openDialog();
                                    }}>
                                        <Text style={{borderColor:Colors.orange,borderWidth:2,padding:10,color:Colors.orange,borderRadius:10,marginBottom:10}}>{state != '' ? t(state) : t('Select your State')}</Text>

                                    </TouchableOpacity>


                           <Text style={{marginTop:10}}>{t("Select District")}</Text>
                                    <TouchableOpacity onPress={() => {
                                        openDialog1();
                                    }}>
                                        <Text style={{marginTop:10,borderColor:Colors.orange,borderWidth:2,padding:10,color:Colors.orange,borderRadius:10,marginBottom:10}}>{district != '' ? t(district) : t('Select your District')}</Text>

                                    </TouchableOpacity> 
                                </View>
                            )}


                           


                        



                           {selectedValue=="location" && (

                            <View>

                                <TouchableOpacity onPress={() => setIsMapModalVisible(true)}>
                                <Text style={{
                                            borderColor:Colors.orange,
                                            padding: 10,
                                            borderWidth:2,
                                            marginTop: 10,
                                            borderRadius: 5,
                                            color:Colors.orange
                                        }}>{t("Choose Location")}</Text>
                            </TouchableOpacity>


                           {is_show_address==true && (
                                   <Text style={{ fontSize:11,color: Colors.textcolor,fontWeight:'bold',color:Colors.orange,marginTop:5,backgroundColor:Colors.gray,padding:10,width:'100%' }}>Note - <Text style={{color:Colors.textcolor,fontWeight:'300'}}>{t("This promotion will visible on radius of 200 km of this area")} {'\n'}<Text style={{fontWeight:'bold',color:Colors.textcolor,padding:10}}>{address}</Text></Text></Text>

                           )}
                         

                            </View>


                           )} 

                      

    

                          
                            <TouchableOpacity onPress={pickImages}>
                                <View
                                    style={{
                                        borderColor:Colors.orange,
                                        padding: 10,
                                        borderWidth:2,
                                        marginTop: 10,
                                        borderRadius: 5,
                                    }}
                                >
                                    <Text style={{ color: Colors.orange }}>{t("Pick Images")}</Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                            <FlatList
                                data={images}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderImageItem}
                                horizontal
                            />

                            </View>
                            
                            
                            <TouchableOpacity onPress={pickVideo}>
                                <View
                                    style={{
                                        borderColor: Colors.orange,
                                        padding: 10,
                                        borderWidth: 2,
                                        marginTop: 10,
                                        borderRadius: 5,
                                    }}
                                >
                                    <Text style={{ color: Colors.orange }}>{t("Pick Video")}</Text>
                                </View>
                            </TouchableOpacity>

                            <Text style={{ color: Colors.textcolor,fontSize:11,marginTop:8 }}>{t("Max video length")} : 2 Min</Text>
                            <Text style={{ color: Colors.textcolor,fontSize:11 }}>{t("Min video length")} : 30 SEC</Text>


                            {renderVideo()}
                          


                            <TouchableOpacity style={styles.button} onPress={() => { GetPromtionPrice() }


                                    }>
                                        <View style={styles.buttonContent}>
                                            <Text style={styles.buttonText}>{Platform.OS=='android'?'Get Price':'Verify Dates'}</Text>
                                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                        </View>
                                    </TouchableOpacity>


                            

                            {show_pay_btn && (
                              
                                         <View>

                                         {Platform.OS=='android' && (
                                        <Text style={{ fontSize:11,color: Colors.textcolor,fontWeight:'bold',color:Colors.orange,marginTop:5,backgroundColor:Colors.gray,padding:10,width:'100%' }}>Alert - <Text style={{color:Colors.textcolor,fontWeight:'300'}}>For date <Text style={{fontWeight:'bold'}}>{chosenDate.toDateString()}</Text> to <Text style={{fontWeight:'bold'}}>{chosenDate1.toDateString()}</Text> promotion charge will be <Text style={{fontWeight:'bold',color:Colors.orange}}>Rs.{amount}</Text>.</Text></Text>

                                         )}

{Platform.OS=='ios' && (
                                        <Text style={{ fontSize:11,color: Colors.textcolor,fontWeight:'bold',color:Colors.orange,marginTop:5,backgroundColor:Colors.gray,padding:10,width:'100%' }}>Alert - <Text style={{color:Colors.textcolor,fontWeight:'300'}}>For date <Text style={{fontWeight:'bold'}}>{chosenDate.toDateString()}</Text> to <Text style={{fontWeight:'bold'}}>{chosenDate1.toDateString()}</Text></Text></Text>

                                         )}

                                        <TouchableOpacity style={styles.button} onPress={() => {

                                                 if(Platform.OS=="android"){
                                                  openDialogreferal()
                                                 }else{
                                                  purchase_promotion()
                                                 }

                                           
                                          
                                          
                                          }


                                        }>
                                            <View style={styles.buttonContent}>
                                                 {Platform.OS=='android' && (
                                                <Text style={styles.buttonText}>PAY NOW {amount}</Text>

                                                 )}

{Platform.OS=='ios' && (
                                                <Text style={styles.buttonText}>Upload Promotion</Text>

                                                 )}
                                                {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                            </View>
                                        </TouchableOpacity></View>
                            )}
                           





                        </View>
          
                </ScrollView>
                {/* Small background image aligned to the right */}

                <Modal
        animationType="slide"
        transparent={false}
        visible={isMapModalVisible}
        onRequestClose={() => setIsMapModalVisible(false)}
      >
        <View>
          <Text style={{width:'100%',fontWeight:'bold',fontSize:18,marginStart:10}}>{t("Select Location")}</Text>
          <MapView
            style={{width:'100%',height:'90%'}}
            initialRegion={region}
            onPress={handleMapPress}
          >
            {markerPosition && (
              <Marker coordinate={markerPosition} title="Selected Location" />
            )}
          </MapView>
          <TouchableOpacity
            style={{width:150,backgroundColor:Colors.orange,padding:10,alignSelf:'center',top:10}}
            onPress={handleGetLocation}
          >
            <Text style={{textAlign:'center',color:Colors.white}}>{t("Confirm Location")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={isDialogVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.dialogContainer}>
            <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Select State</Text>

            <FlatList style={{ marginTop: 10, marginBottom: 10,height:300 }}
              data={state_list}

              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{}}
                  onPress={() => select_state(item)}
                >
                  <Text style={{ color: Colors.textcolor,padding:10 }}>{item.name}</Text>
                </TouchableOpacity>

              )}
            />

            <TouchableOpacity onPress={() => {
              closeDialog()
            }}>
            <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>{t("Close")}</Text>
            </TouchableOpacity>







          </View>
        </View>
      </Modal>

      <Modal visible={isDialogVisible2} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.dialogContainer}>
            <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Select District</Text>

            <FlatList style={{ marginTop: 10, marginBottom: 10, height: 300 }}
              data={distrcit_list}

              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{}}
                  onPress={() => select_district(item)}
                >
                  <Text style={{ color: Colors.textcolor, padding: 10 }}>{item.name}</Text>
                </TouchableOpacity>

              )}
            />



            <TouchableOpacity onPress={()=>{
              closeDialog1()
            }}>
             <Text style={{backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10}}>{t("Close")}</Text>

            </TouchableOpacity>







          </View>
        </View>
      </Modal>


      <Modal visible={loading} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.dialogContainer}>

            <View style={{flexDirection:'row',alignItems:'center'}}>
            <ActivityIndicator size="large" color={Colors.orange} />
            <Text style={{marginStart:10}}>Please wait ...</Text>
            {progress!="0" && (
              <Text> {progress} % completed</Text>
            )}
            </View>

          </View>
        </View>
      </Modal>




      

            </View>
            <Image
                source={require('../../assets/images/job_header.png')}
                style={styles.backgroundImage}
            />

<Modal visible={isDialogVisibleReferal} animationType="slide" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter Referal Code (IF ANY) </Text>

                     
                     <TextInput style={{borderRadius:10,borderWidth:1,borderColor:Colors.grayview}} placeholder="Enter your referal code "  keyboardType='numeric' value={referal_code} onChangeText={(text) => set_referal_code(text)} />

                    

                       
                        <TouchableOpacity onPress={()=>{
                             Alert.alert(
                              'Confirmation',
                              'Are you sure you want to pay for this promotion?',
                              [
                                {
                                  text: 'Cancel',
                                  style: 'cancel',
                                },
                                {
                                  text: 'Yes',
                                  onPress: () => {
                                    // Handle "Yes" button press
                                   // purchase_promotion() 

                                   doPayment()


                                  // open_price_dialog()
                                  },
                                },
                              ],
                              { cancelable: false }
                            );
                        }}>
                            <Text style={{backgroundColor:Colors.orange,marginTop:5,padding:10,color:Colors.white,textAlign:"center",borderRadius:10}}>CONTINUE</Text>

                        </TouchableOpacity>

                 

                     


                     <TouchableOpacity onPress={() => {
                         closeDialogreferal()
                     }}>
                         <Text style={{marginTop:10,backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10,textAlign:'center'}}>Close</Text>
                     </TouchableOpacity>







                 </View>
             </View>
         </Modal> 

         <Modal visible={isDialogVisiblepayment} animationType="slide" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>

                     <ActivityIndicator/>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Please wait until payment processing..</Text>

                     

                       
                     
                 





                 </View>
             </View>
           </Modal> 


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    button: {
        backgroundColor: Colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop: 10
    },
    contentContainer: {
        flex: 1,
        top: '10%',
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


        width: '40%',     // Set the image width
        height: '10%', // Ensure the image takes up the full height
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
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        paddingLeft: 10,
        borderWidth:1,
        borderColor:Colors.orange


    },
    subTextContainer: {
        width:350,
        marginBottom:100
    
       
      


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
    map:{
        height: '100%',
         width: '100%'
         ,flex:1
    }
    ,
    modalContainer: {
        flex: 1,
        width:100,
        height:100,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
      },
      map: {
        flex: 1,
      },
      getLocationButton: {
        padding: 16,
        backgroundColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
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
});

export default PurchasePromotionScreen;


function isValidPhone(value) {
    const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
    return phonePattern.test(value)
}
