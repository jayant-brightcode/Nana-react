import React, { useState,useEffect } from 'react';
import {  Button, FlatList ,TouchableWithoutFeedback, View, Image, TextInput, ActivityIndicator, StyleSheet, Text, StatusBar, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Colors from '../Utils/Color';
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message';
import { Remote } from '../Utils/Remote.js';
import DateTimePicker from '@react-native-community/datetimepicker'
import ImagePicker from 'react-native-image-crop-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import { getToken } from '../Utils/LocalStorage';

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
            const results = await ImagePicker.openPicker({
                multiple: true,
                mediaType: 'photo',
            });

            if (!results.cancelled) {
                setImages([...images, ...results.map((image) => ({ uri: image.path }))]);
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

            if (!result.cancelled) {
                setVideo({ uri: result.path });
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
            <Image source={{ uri: item.uri }} style={{ width: 100, height: 100 }} />
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
            setChosenDate(selectedDate);
            setShowDatePicker(false);
        } else {
            setShowDatePicker(false);

        }
    };


    const onDateChange1 = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate1(selectedDate);
            setShowDatePicker1(false);
        } else {
            setShowDatePicker1(false);

        }
    };

    const openDatePicker = () => {

        setShowDatePicker(true);
    };

    const openDatePicker1 = () => {

        setShowDatePicker1(true);
    };


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

            formData.append('title', title);
            formData.append('desc', desc);
            formData.append('from_date', chosenDate.toDateString());
            formData.append('to_date', chosenDate1.toDateString());
            formData.append('payment_amount', 1000);
            formData.append('payment_mode',"upi");
            formData.append('payment_status', 'success');

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

             
          
                <Text style={styles.text}>Signup</Text>
                <Text style={{ color: Colors.dark_gray, fontWeight: 'bold', fontSize: 15 }}>for your dream job</Text>

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
                            <TextInput style={styles.input} placeholder="Enter description here"  value={desc} onChangeText={(text) => setDesc(text)} />
                            <View style={{marginBottom:10}}>
                                <Text style={styles.labelText}>From Date</Text>
                                <TouchableWithoutFeedback  onPress={openDatePicker} >
                                    <Text style={{ height: 45, backgroundColor: Colors.grayview ,marginTop:10,padding:10}} >{chosenDate.toDateString()}</Text>
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
                                    <Text style={{ height: 45, backgroundColor: Colors.grayview, marginTop: 10, padding: 10 }} >{chosenDate1.toDateString()}</Text>
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
                          



                            
                            <TouchableOpacity style={styles.button} onPress={() => { purchase_promotion() }


                            }>
                                <View style={styles.buttonContent}>
                                    <Text style={styles.buttonText}>NEXT</Text>
                                    {/* <Image source={require('../../assets/images/back.png')} style={styles.icon} /> */}
                                </View>
                            </TouchableOpacity>





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
});

export default PurchasePromotionScreen;


function isValidPhone(value) {
    const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
    return phonePattern.test(value)
}
