import React,{useState} from 'react'
import { View, StyleSheet, StatusBar, Image, Text, Dimensions, FlatList, TouchableOpacity, ActivityIndicator, TextInput, SafeAreaView } from 'react-native'
import Colors from '../Utils/Color'
import Swiper from 'react-native-swiper';
import { useRoute } from '@react-navigation/native';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import { ViewPropTypes } from 'deprecated-react-native-prop-types'; // Import ViewPropTypes
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';

import { Modal } from 'react-native';

const PaymentScreen = () => {
    const route = useRoute();
    const { plan } = route.params

    const [loading, setLoading] = useState(false);
    const [referal_code, set_referal_code] = useState("");

    const [isDialogVisible, setDialogVisible] = useState(false);

    const bannerData = [
        { id: 1, imageUrl: '../../assets/images/banner1.png' },
        { id: 2, imageUrl: '../../assets/images/banner2.png' },
        // Add more banner items here
    ];
    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

    const payment_option = [
        { id: 1, option:"NET BANKING" },
        { id: 2, option:"DEBIT CARD"},
        { id: 3, option: "UPI" },

        // Add more languages as needed
    ];
    const [selectedItem, setSelectedItem] = useState(null);
    const handleItemPress = (item) => {
        setSelectedItem(item);
        Toast.show({
            type: 'success',
            text1: `Selected Option: ${item.option}`,
        });


    };

    const openDialog = () => {

        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };


    const renderPlanItem = ({ item }) => (
        <TouchableOpacity onPress={() => {
            handleItemPress(item)
        }}>

            <View style={[styles.planItem, selectedItem === item && styles.selectedItem]}>
                <Text style={styles.planYear}>{item.option}</Text>
              
            </View>
        </TouchableOpacity>
        

    );

    const navigation = useNavigation()



    const make_payment = async () => {

        try {

            setLoading(true)
            const apiUrl = Remote.BASE_URL + "user/make_registration_payment";
            const userData = {
                payment_mode: "UPI",
                payment_status:"success",
                transaction_id: "sdfddafafaf",
                registration_charge_id: plan.selected_plan,
                referal_code:referal_code
               
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


                navigation.popToTop();
                navigation.replace("HomeScreen")
   
            


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


    const renderItem = ({ item }) => (
        <View>
            <Image source={require('../../assets/images/banner1.png')} style={styles.bannerImage} />
        </View>
    );

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.blue} />
            <View style={styles.background_shape}>
                <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
                  
                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  
                    <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 18, marginStart: 13 }}>Payment</Text>
                </View>
            </View>

            <View style={{alignSelf:'center'}}>


                <Carousel

                    data={bannerData}

                    renderItem={renderItem}
                    sliderWidth={350}
                    itemWidth={350}
                    ref={isCarousel}
                    autoplay={true}
                    autoplayDelay={4000}
                    loop={true}
                    onSnapToItem={(index) => setIndex(index)}
                    containerCustomStyle={{
                        flexGrow: 0,
                       
                        marginTop: 80,


                    }}



                />
                <Pagination

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

                />
            </View>


            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}


            <Text style={{ marginStart: 20, marginTop: '10%', color: Colors.textcolor }}>Choose your plan below</Text>
            <FlatList
                data={payment_option}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPlanItem}
            />
            <TouchableOpacity style={styles.button} onPress={() => {
               openDialog()
               
            }}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>



            <Modal visible={isDialogVisible} animationType="slide" transparent>
             <View style={styles.modalContainer}>
                 <View style={styles.dialogContainer}>
                     <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Enter Referal Code (IF ANY) </Text>

                     
                     <TextInput style={{borderRadius:10,borderWidth:1,borderColor:Colors.grayview}} placeholder="Enter your referal code "  keyboardType='numeric' value={referal_code} onChangeText={(text) => set_referal_code(text)} />

                    

                       
                        <TouchableOpacity onPress={()=>{
                           make_payment()
                        }}>
                            <Text style={{backgroundColor:Colors.orange,marginTop:5,padding:10,color:Colors.white,textAlign:"center",borderRadius:10}}>CONTINUE</Text>

                        </TouchableOpacity>

                 

                     


                     <TouchableOpacity onPress={() => {
                         closeDialog()
                     }}>
                         <Text style={{marginTop:10,backgroundColor:Colors.red,color:Colors.white,padding:10,borderRadius:10,textAlign:'center'}}>Close</Text>
                     </TouchableOpacity>







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
    background_shape: {

        position:'absolute',
        backgroundColor: Colors.blue,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        height: '20%',
        width:'100%'

    },
    wrapper: {
        height: '20%',
    },
    bannerImage: {
        padding: 10,
        width: 320,
        height: 120,
        borderRadius:10,
        alignSelf:'center'


    },
    paginationStyle: {
        // Customize the style of the pagination container

    },
    selectedItem: {
        borderColor: Colors.blue,
        borderWidth: 1
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        padding: 10,
        borderColor: Colors.dark_gray,
        borderWidth: 1,
      
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 50, // Adjust the height of each item
    },
    planItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginStart: 20,
        marginEnd: 20,
        borderWidth:1,
        borderColor:Colors.dark_gray,
        marginTop: 10,
        borderRadius: 10,
        height: 70,
        backgroundColor: Colors.grayview,
        alignItems: 'center'

    },
    planYear: {
        fontSize: 18,

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
    button: {


        position: 'absolute',
        width: '90%',
        bottom: '2%',

        height: '6%', // Set the desired height here
        backgroundColor: Colors.blue,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 10,

    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
    

})



Carousel.propTypes = {
    // Other PropTypes declarations for Carousel go here
    paginationStyle: ViewPropTypes.style,
};

export default PaymentScreen