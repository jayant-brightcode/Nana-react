import React, { useState,useEffect } from 'react';
import {  Button, FlatList ,TouchableWithoutFeedback, View, Image, TextInput, ActivityIndicator, StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform ,Modal} from 'react-native';
import Colors from '../Utils/Color';
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message';
import { Remote } from '../Utils/Remote.js';
import DateTimePicker from '@react-native-community/datetimepicker'
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import { getToken } from '../Utils/LocalStorage';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
const PurchasePromotionScreen = () => {

    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');


    const [loading, setLoading] = useState(false);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [chosenDate1, setChosenDate1] = useState(new Date());
    const [showDatePicker1, setShowDatePicker1] = useState(false);
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);


    const [show_pay_btn,set_show_pay_btn] = useState(false)

    const [amount,set_amount] = useState(false)


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
                if(result.duration >= 30000){
                    Toast.show({
                        type: 'success',
                        text1: `Video length should be less or equal to 30 seconds`,
                    });
                    return;
                   }else{
                    setVideo({ uri: result.path });
                   }
                
            }
        } catch (error) {
            console.error(error);
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



    const purchase_promotion = async () => {


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

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/purchase_promotion";

        

            const formData = new FormData();

            // Append video file to FormData
            if (video) {
                console.log(video)
                formData.append('promotion_video', {
                    uri: video.uri,
                    type: 'video/mp4',
                    name: 'promotion_video.mp4', // You can change the file name as needed
                });
            }

            // Append each image file to FormData
            images.forEach((image, index) => {
                formData.append('promotion_images', {
                    uri: image.uri,
                    type: 'image/jpeg',
                    name: `image_${index}.jpg`, // You can change the file name as needed
                });
            });

            if (!markerPosition) {

                Toast.show({
                    type: 'success',
                    text1: `Please select location`,
                });

                return;

            }

            formData.append('title', title);
            formData.append('desc', desc);
            formData.append('from_date', chosenDate.toDateString());
            formData.append('to_date', chosenDate1.toDateString());
            formData.append('payment_amount', 1000);
            formData.append('payment_mode',"upi");
            formData.append('payment_status', 'success');
            formData.append('latitude', markerPosition.latitude);
            formData.append('longitude', markerPosition.longitude);
        
         

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

        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.orange} />
            <View style={styles.contentContainer}>
                {/* Input fields and button */}

             
          
                <Text style={styles.text}>Promote</Text>
                <Text style={{ color: Colors.dark_gray, fontWeight: 'bold', fontSize: 15 }}>for your Profile</Text>

                <ScrollView style={styles.subTextContainer} automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <View  style={{marginBottom:250}}>
                        

                            {loading && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#0000ff" />
                                </View>
                            )}








                            <TextInput style={styles.input} placeholder="Enter title here" value={title} onChangeText={(text) => setTitle(text)} />
                            <TextInput style={{height:'20%',backgroundColor:Colors.grayview,borderRadius:10,paddingStart:10,borderWidth:1,borderColor:Colors.orange}} multiline={true} placeholder="Enter description here"  value={desc} onChangeText={(text) => setDesc(text)} />
                            <View style={{marginBottom:10}}>
                                <Text style={styles.labelText}>From Date</Text>
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
                                <Text style={styles.labelText}>To Date</Text>
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

                            <TouchableOpacity onPress={() => setIsMapModalVisible(true)}>
        <Text style={{
                                        borderColor:Colors.orange,
                                        padding: 10,
                                        borderWidth:2,
                                        marginTop: 10,
                                        borderRadius: 5,
                                        color:Colors.orange
                                    }}>Choose Location</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isMapModalVisible}
        onRequestClose={() => setIsMapModalVisible(false)}
      >
        <View>
          <Text style={{width:'100%',fontWeight:'bold',fontSize:18,marginStart:10}}>Select Location</Text>
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
            <Text style={{textAlign:'center'}}>Get Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>

                          
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
                                    <Text style={{ color: Colors.orange }}>Pick Images</Text>
                                </View>
                            </TouchableOpacity>
                            <FlatList
                                data={images}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderImageItem}
                                horizontal
                            />

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
                                    <Text style={{ color: Colors.orange }}>Pick Video</Text>
                                </View>
                            </TouchableOpacity>

                            {renderVideo()}
                          


                            <TouchableOpacity style={styles.button} onPress={() => { GetPromtionPrice() }


                                    }>
                                        <View style={styles.buttonContent}>
                                            <Text style={styles.buttonText}>Get Price</Text>
                                            {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                        </View>
                                    </TouchableOpacity>


                            

                            {show_pay_btn && (
                                        <TouchableOpacity style={styles.button} onPress={() => { purchase_promotion() }


                                        }>
                                            <View style={styles.buttonContent}>
                                                <Text style={styles.buttonText}>PAY NOW {amount}</Text>
                                                {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                            </View>
                                        </TouchableOpacity>
                            )}
                           





                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                {/* Small background image aligned to the right */}

            </View>
            <Image
                source={require('../../assets/images/job_header.png')}
                style={styles.backgroundImage}
            />
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
        height: '12%',
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        paddingLeft: 10,
        borderWidth:1,
        borderColor:Colors.orange


    },
    subTextContainer: {
        width: '80%',
        marginBottom: 10,
        top: '4%',


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
});

export default PurchasePromotionScreen;


function isValidPhone(value) {
    const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
    return phonePattern.test(value)
}
