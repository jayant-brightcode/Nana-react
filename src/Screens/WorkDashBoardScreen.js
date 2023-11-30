import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import DateTimePicker from '@react-native-community/datetimepicker'



const WorkDashboardScreen = () => {
    const route = useRoute();
     const { data } = route.params

    const [work_history, set_work_history] = useState([])
    const [loading, setLoading] = useState(false);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    useEffect(() => {
        get_work_details(chosenDate);
    }, []);


    const onDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            setChosenDate(selectedDate);
            console.log(selectedDate)
            setShowDatePicker(false);
            get_work_details(selectedDate)
 
        } else {
            setShowDatePicker(false);
        }
    };

    const openDatePicker = () => {
        setShowDatePicker(true);
    };

    const get_work_details = async (date) => {


        setLoading(true)


        try {

       

            let apiUrl = Remote.BASE_URL + "user/get_work_history"
            const token = await getToken(); // Replace with your actual Bearer token
            let queryParams;


             if(data.type=="monthly"){

             }

            if (data.type == "daily") {
              
                 queryParams = {
                     date: date.toISOString().split('T')[0],
                    type:"daily"

                };

            }



          


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
                


                if (data.work_history.length>0){
                    set_work_history(data.work_history[0].data)

                }else{
                    set_work_history(data.work_history)
                }

                setLoading(false)

        


            } else {
                console.error('Error:', response.status, response.statusText);
                setLoading(false)


            }
        } catch (error) {
            console.error('Fetch errors:', error);
            setLoading(false)


        }





    };


    const render_work_history = ({ item }) => (

         
       
        <View style={{ margin: '4%' }}>
            <Text style={{ fontWeight: 'bold', color: Colors.textcolor, fontSize: 17 }}>Work Chat for - {new Date(item.createdAt).toDateString()}</Text>
            <View style={{ height: 4, backgroundColor: Colors.dark_gray, marginTop: 3 }}></View>


            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 20 }}>Name : {item.user.name} </Text>

            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>Worked for : {item.skills.map(skill => skill.name).join(', ')}</Text>

            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>Total amount : Rs  {item.payment_amount.toString()}</Text>
            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, marginTop: '5%' }}>Total attendance :</Text>
            <View style={{ flexDirection: 'row' }}>

                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10 }}>Prsent 0</Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10, marginStart: 10 }}>Absent 0</Text>

            </View>

            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, marginTop: '5%' }}>Total Leaves :</Text>
            <View style={{ flexDirection: 'row' }}>

                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10 }}>Reuest 0</Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10, marginStart: 10 }}>Approved 0</Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10, marginStart: 10 }}>Rejected 0</Text>

            </View>

            <View style={{ backgroundColor: Colors.dark_gray, height: 3, marginTop: 10 }}>

            </View>

            <View style={{ justifyContent: 'space-evenly' }}>
                {/* {work_history.data[0].user.districtInfo.name} */}
                {/* {work_history.data[0].user.city} */}
                {/* {work_history.data[0].user.stateInfo.name} */}
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, }}>District : {item.user.districtInfo.name} </Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>City : {item.user.city}</Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>State : {item.user.stateInfo.name}</Text>

            </View>

        </View>

    );


    return (
        <View style={styles.container}>



            <View style={styles.topbar}>
                <View style={{ flexDirection: 'row', marginTop: 10, padding: 10, alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrow.png')}></Image>
                    <View style={{ marginStart: 15, flex: 1 }}>
                        <Text style={{ color: Colors.white, fontWeight: 'bold', fontSize: 20 }}>Work Details</Text>

                    </View>


                </View>

            </View>




            <View>
                
                <TouchableWithoutFeedback onPress={openDatePicker}>
                    <Text style={{
                        borderColor: Colors.orange,
                        borderWidth: 1, margin:15, height: 40, backgroundColor: Colors.gray, padding: 10, color: Colors.textcolor
                    }}>{chosenDate.toDateString()}</Text>
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

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}



            <FlatList

                data={work_history}
                keyExtractor={(item) => item._id.toString()}
                renderItem={render_work_history}
            />
          

       




            


        </View>

    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.white
    },
    topbar: {
        backgroundColor: Colors.blue,
        height: 70,

    }




})



export default WorkDashboardScreen