import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, StatusBar,ScrollView } from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { getToken } from "../Utils/LocalStorage";
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useRoute } from '@react-navigation/native';
import { Remote } from "../Utils/Remote";
import Video from 'react-native-video';


const ViewPromotionDetailScreen = () => {

    const route = useRoute();
    const { data } = route.params


    console.log("DETAILS",data.details.user_id)

   
   
    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

   


    useEffect(() => {
        // Check and request permission on component mount
        AddViewToPromotion();
    }, []);




    const AddViewToPromotion = async () => {
    

      try {

 
            const apiUrl = Remote.BASE_URL + "user/add_view_count";

        

            const userData = {
                promotion_id: data.details._id,
              

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

                console.log("ok")
              
         

          


            } else {
                // Handle error

                console.log("not ok")
               

            }
        } catch (error) {
        
            console.log(error)
        }

    }



    const renderItem = ({ item }) =>



    (


        <View>
            <Image source={{ uri: Remote.BASE_URL + item }} style={styles.bannerImage} />

        </View>
    );



    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Promotion details</Text>

                    </View>


                    


                </View>

            </View>


             <ScrollView>

            <View style={{ alignSelf: 'center' }}>


                <Carousel

                    data={data.details.photos}

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
                <Pagination

                              dotsLength={data.details.photos.length}
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

            <Text style={{alignSelf:'center',fontSize:23,marginTop:10,fontWeight:'bold'}}>{data.details.title}</Text>
            <View style={{height:2,marginTop:10,backgroundColor:Colors.textcolor}}></View>

            <Text style={{ fontSize: 15,margin:10 }}>{data.details.desc}</Text>

            <View style={{ height: 1, marginTop: 10, backgroundColor: Colors.textcolor }}></View>


            <View style={{margin:10}}>
                <Text style={{ color: Colors.textcolor, marginStart: 10 ,fontWeight:'bold'}}>Profession Name</Text>
                <Text style={{ color: Colors.textcolor, marginStart: 10,padding:10,backgroundColor:Colors.grayview,marginTop:2 }}>{data.details.user_id.profession_name}</Text>

                <Text style={{ color: Colors.textcolor, marginStart: 10,marginTop:10,fontWeight:'bold' }}>Profession Description </Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: "300", padding: 10, marginTop: 2 }}>{data.details.user_id.profession_description}</Text>
         
         
                <Text style={{ color: Colors.textcolor, marginStart: 10, marginTop: 10 ,fontWeight:'bold'}}>Profession Experience</Text>
                    <Text style={{ color: Colors.textcolor, fontWeight: "300", padding: 10, marginTop: 2 }}>{data.details.user_id.profession_experience}</Text>
         

                    {/* <Text style={{ color: Colors.textcolor, marginStart: 10, marginTop: 10, fontWeight: 'bold' }}>Profession Photos</Text>

                    <FlatList
                        data={profile.profession_photo}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderImageItem}
                        horizontal
                    /> */}
            </View>


            <Text style={{ fontSize: 15, margin: 10,fontWeight:'bold' }}>Know about us</Text>
            <Video
                source={{ uri: Remote.BASE_URL+data.details.vide }}
                style={styles.video}
                controls={true} // Show player controls (play, pause, etc.)
            />
            </ScrollView>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
       

    } ,topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',

    },
    bannerImage: {
        padding: 10,
        width: 400,
        height: 300,
        borderRadius: 10,
        alignSelf: 'center',

        resizeMode: 'contain'


    },
    video: {
        alignSelf:'center',
        width: 300,
        height: 200,
        
        
        
    },

   
});


export default ViewPromotionDetailScreen  