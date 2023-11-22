import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';

import { useRoute } from '@react-navigation/native';




const MyPurchasedPromotionScreen = () => {

    const route = useRoute();
    const { page } = route.params
    const navigation = useNavigation();
    const [get_request, set_request] = useState([])

 
    const [loading, setLoading] = useState(false);

    const bannerData = [
        { id: 1, imageUrl: '../../assets/images/banner1.png' },
        { id: 2, imageUrl: '../../assets/images/banner2.png' },
        // Add more banner items here
    ];
    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)



    useEffect(() => {
        if(page.screen=="setting"){
            get_purchased_promotion();

        }else{
            get_running_promotion();
        }
    }, []);


 

    const renderJobItem = ({ item }) => {



        const renderItem = ({ item }) => 
      

          
            (

            
            <View>
                <Image source={{ uri: Remote.BASE_URL + item }} style={styles.bannerImage} />
              
            </View>
        );

      





        return (
         

                <View style={{ marginTop: 13, flexDirection: 'row', alignItems: 'center', marginStart: 10, marginEnd: 10, backgroundColor: Colors.grayview, borderRadius: 10, padding: 10 }}>
                
                    <View style={{ flex: 1 }}>

                        <View style={{ alignSelf: 'center' }}>


                            <Carousel

                                data={item.photos}

                                renderItem={renderItem}
                                sliderWidth={350}
                                itemWidth={350}
                                ref={isCarousel}
                                autoplay={false}
                                autoplayDelay={4000}
                                loop={false}
                                onSnapToItem={(index) => setIndex(index)}
                                containerCustomStyle={{
                                    flexGrow: 0,

                                   


                                }}
                            removeClippedSubviews={false}



                            />
                            {/* <Pagination

                                dotsLength={bannerData.length}
                                activeDotIndex={index}
                                containerStyle={{ paddingVertical: 10 }}
                                carouselRef={isCarousel}
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    marginHorizontal: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.92)'
                                }}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                                tappableDots={true}

                            /> */}
                        </View>
                        {/* <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 22,marginTop:10 }}>{item.title}</Text> */}
                 
                        <Text style={{ marginTop:10,color: Colors.textcolor, fontWeight: 'medium', fontSize: 12,textAlign:'center' ,borderColor:Colors.fadeOrange,borderWidth:2,padding:10}}>view more</Text>
                        {/* <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>End Date - {new Date(item.to_date).toDateString() }</Text>
                        <Text style={{ color: Colors.red, fontWeight: 'bold', fontSize: 12 }}>Paid - Rs.{item.payment_amount}</Text> */}

            

                       









                    </View>




                </View>
          


        )
    };



    const get_purchased_promotion = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_purchased_promotion"


           





            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();




                set_request(data.promotion);

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


    const get_running_promotion = async () => {


        try {
            setLoading(true)
            const token = await getToken(); // Replace with your actual Bearer token
            let apiUrl = Remote.BASE_URL + "user/get_running_promotion"








            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();




                set_request(data.promotion);

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





    return (
        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Promotion</Text>

                    </View>


                    {page.screen=="setting" && (
                        <TouchableOpacity onPress={() => {

                            navigation.navigate("PurchasePromotionScreen")

                        }}>
                            <Text style={{ borderRadius: 10, borderWidth: 1, borderColor: Colors.white, padding: 10, color: Colors.white, marginEnd: 10, fontWeight: 'bold' }}>Make Promotion</Text>

                        </TouchableOpacity>
                    )}

               



                </View>

            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}


           {page.screen=="setting" && (
                <View >

                    <FlatList

                        data={get_request}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderJobItem}
                    />
                </View>
           )}

            <View style={{ marginBottom: '20%' }}>

                <FlatList

                    data={get_request}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderJobItem}
                />
            </View>

          



            


          



        </View>

    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',

    },
    dialogContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        marginStart: 10,
        marginEnd: 10,
        borderRadius: 10,

    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    input: {
        width: '100%',
        height: 80,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        marginTop: 10,
        color: Colors.dark_gray



    },
    rowinput: {
        width: '100%',
        height: 45,
        backgroundColor: Colors.gray,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,


    },
    bannerImage: {
        padding: 10,
        width: 400,
        height: 300,
        borderRadius: 10,
        alignSelf: 'center',
 
        resizeMode:'contain'


    },




})



export default MyPurchasedPromotionScreen



function isValidPhone(value) {
    const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
    return phonePattern.test(value)
}
