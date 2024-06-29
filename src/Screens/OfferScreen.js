import React, { useState } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, Platform } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions

import Carousel, { Pagination } from 'react-native-snap-carousel';
import { setDefaultNamespace } from 'i18next';


const bottomNavBar = [
    { id: 1, name: 'Home',icon:require('../../assets/images/home.png') },
    { id: 2, name: 'Offer', icon: require('../../assets/images/offer.png') },
    { id: 3, name: 'Categories', icon: require('../../assets/images/cat.png') },
    { id: 4, name: 'Promotion', icon: require('../../assets/images/31.png') },
    { id: 5, name: 'Setting', icon: require('../../assets/images/setting.png') },

    // Add more languages as needed
];


const recent_list = [
    { id: 1, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 2, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/31.png'), cols: Colors.pink },
    { id: 3, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 4, name: 'Brightcode Software Services Pvt. Ltd., Ranchi', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/31.png'), cols: Colors.pink },


]


const serviceList = [
    { id: 1, name: 'Rakesh Kumar', desc: 'Web Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 2, name: 'Suraj', desc: 'IOS Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/31.png'), cols: Colors.pink },
    { id: 3, name: 'Sunny', desc: 'Android Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/electric.png'), cols: Colors.fadeOrange },
    { id: 4, name: 'Unknown', desc: 'Blockchain Developer', desc2: 'Exp. : 5 years, Salary : 20k ', Image: require('../../assets/images/31.png'), cols: Colors.pink },


]

const OfferScreen = () => {

    const navigation = useNavigation()
    const bannerData = [
        { id: 1, imageUrl: '../../assets/images/banner1.png' },
        { id: 2, imageUrl: '../../assets/images/banner2.png' },
        // Add more banner items here
    ];
    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

    const [selectedItem, setSelectedItem] = useState(bottomNavBar[1]);


    const handleItemPress = (item) => {
        // setSelectedItem(item);
 
        // navigation.navigate("SettingScreen")
       
         
 
         if (item.name == "Home") {
             navigation.navigate("HomeScreen")
            
         }
 
         if (item.name == "Categories") {
             navigation.navigate("AllCategoryScreen")
          
         }
 
 
         if (item.name == "Setting") {
             navigation.navigate("SettingScreen")
         }
 
 
         if (item.name == "Promotion") {
             const data = {
                 screen: "home"
             }
             navigation.navigate("MyPurchasedPromotionScreen", { page: data })
          
         }
 
 
         setSelectedItem(item);
 
 
 
 
 
     };
    const renderPlanItem = ({ item }) => (

        <TouchableOpacity   onPress={() => {

      
            
            handleItemPress(item)
        }}>

            <View style={[styles.planItem, selectedItem === item && styles.selectedItem]}>
                <Image
                    source={item.selected ? item.icon : item.icon}
                    style={{ width: '120%', height: '120%' }}
                />
               {/* <Text style={styles.planYear}>{item.name}</Text> */}
            </View>
        </TouchableOpacity>

    );


    const renderItem = ({ item }) => (
        <View>
            <Image source={require('../../assets/images/banner1.png')} style={styles.bannerImage} />
        </View>
    );

    const renderRecentSearch = ({ item }) => (
        <TouchableOpacity onPress={() => {

        }}>

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
                    <Image style={{ width: 50, height: 50, resizeMode: 'center' }} source={item.Image} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>{item.desc}</Text>

                </View>
                <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/next.png')} />
                </View>
            </View>
        </TouchableOpacity>


    );

    const renderService = ({ item }) => (
        <TouchableOpacity onPress={() => {

        }}>

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
                    <Image style={{ width: 50, height: 50, resizeMode: 'center' }} source={item.Image} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={{ color: Colors.textcolor, fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12 }}>{item.desc}</Text>

                </View>
                <View style={{ flex: 0, justifyContent: 'flex-end', marginRight: 10 }}>
                    <Text style={{ color:Colors.white,width: 100,textAlign:'center',backgroundColor:Colors.blue,padding:10,borderRadius:10 }}>Chat </Text>
                </View>
            </View>
        </TouchableOpacity>


    );

    return (
        <View style={styles.container} >


            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{

navigation.goBack()

}}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
</TouchableOpacity>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>OFFER/( JOBS / SERVICES)</Text>

                    </View>


                </View>

            </View>

            <ScrollView style={{marginBottom:90}}>


                <View style={{ alignSelf: 'center' }}>


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

                            marginTop: 20,


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

                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 20, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>Jobs Offer</Text>
                    <Image source={require('../../assets/images/next.png')} style={{ width: 32, height: 32, marginRight: 5, marginStart: 13, resizeMode: 'center', flex: 1 }} />





                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View>
                <View>

                    <FlatList

                        data={recent_list}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderRecentSearch}
                        scrollEnabled={false}
                    />
                </View>

                <View style={{ marginStart: 10, marginEnd: 10, marginTop: 20, flexDirection: 'row' }}>

                    <Text style={{ color: Colors.textcolor, fontSize: 15, fontWeight: 'medium', flex: 10, marginTop: 4 }}>Services</Text>
                    <Image source={require('../../assets/images/next.png')} style={{ width: 32, height: 32, marginRight: 5, marginStart: 13, resizeMode: 'center', flex: 1 }} />





                </View>
                <View style={{ backgroundColor: Colors.dark_gray, height: 1, marginStart: 10, marginEnd: 10 }}>

                </View>

                <View>

                    <FlatList

                        data={serviceList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderService}
                        scrollEnabled={false}
                    />
                </View>

            </ScrollView>


            <View style={{
                    position: 'absolute',
                    bottom:0,
                   
                
                    width:'100%',
                    backgroundColor:Colors.navcolor,
                    alignItems:'center'
                   
                  
                }}>

            <FlatList
                
                data={bottomNavBar}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPlanItem}
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
    bannerImage: {
        padding: 10,
        width: 350,
        height: 120,
        borderRadius: 10


    },
    selectedItem: {
        borderColor: Colors.blue,
        backgroundColor:Colors.blue
    },
    itemContainer: {

        flex: 1,
        padding: 10,
        borderColor: Colors.white,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        height: 50, // Adjust the height of each item
    },
    planItem: {
        flexDirection: 'coloumn',
        justifyContent: 'space-between',
        padding: 10,
        width: 75,
        height:75,
        backgroundColor: Colors.navcolor,
        alignItems: 'center'

    },
    planYear: {
        fontSize: 11,

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
    selectedItemPrice: {
        backgroundColor: Colors.blue,
        color: Colors.white,
        borderWidth: 0
    },




})



export default OfferScreen



