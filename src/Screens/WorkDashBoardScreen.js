import React, { useState, useEffect } from 'react'

import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, TouchableWithoutFeedback,Modal } from 'react-native'
import Colors from '../Utils/Color'
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import { useRoute } from '@react-navigation/native';
import { getToken } from '../Utils/LocalStorage';
import { Remote } from '../Utils/Remote';
import DateTimePicker from '@react-native-community/datetimepicker'
import CommentDialog from '../component/MemberShipDialog';



const WorkDashboardScreen = () => {


    const navigation = useNavigation()
    const route = useRoute();
     const { data } = route.params

    const [work_history, set_work_history] = useState([])
    const [loading, setLoading] = useState(false);
    const [chosenDate, setChosenDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [monthly_dates, set_montly_dates] = useState([]);
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [s_monthly_dates, s_set_montly_dates] = useState('');
    const [isDialogVisible_member, setDialogVisible_member] = useState(false);


    const openDialog = () => {
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
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

    useEffect(() => {

        if (data.type == "daily") {
        get_work_details(chosenDate);
        }else{
            get_montly_work_dates()
        }
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
                if(response.status==401){
                    setLoading(false)
                 
                    openDialog_member()
                }


            }
        } catch (error) {
            console.error('Fetch errors:', error);
            setLoading(false)


        }





    };

    const get_monthly_work_details = async (id) => {


        setLoading(true)


        try {

       

            let apiUrl = Remote.BASE_URL + "user/get_work_history"
            const token = await getToken(); // Replace with your actual Bearer token
            let queryParams;



          
              
                 queryParams = {
                    service_id: id,
                    type:"monthly"

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

                console.log(data.work_history[0])
                


                if (data.work_history.length>0){
                    set_work_history(data.work_history)

                }else{
                    set_work_history(data.work_history)
                }

                setLoading(false)

        


            } else {
                if(response.status==401){
                    setLoading(false)
                 
                    openDialog_member()
                }


            }
        } catch (error) {
            console.error('Fetch errors:', error);
            setLoading(false)


        }





    };


    const get_montly_work_dates = async (date) => {


        setLoading(true)


        try {

       

            let apiUrl = Remote.BASE_URL + "user/get_monthly_dates"
            const token = await getToken(); // Replace with your actual Bearer token
           // let queryParams;





          


            // Construct the URL with query parameters
           // const urlWithParams = `${apiUrl}?${new URLSearchParams(queryParams)}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json', // Adjust content type as needed
                },
            });



            if (response.ok) {
                const data = await response.json();


               
                set_montly_dates(data.monthly_dates)

                setLoading(false)

        


            } else {
                if(response.status==401){
                    setLoading(false)
                 
                    openDialog_member()
                }


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
                {/* {work_history.data[0].user.districtInfo.name}
                {work_history.data[0].user.city}
                {work_history.data[0].user.stateInfo.name} */}
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, }}>District : {item.user.districtInfo.name} </Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>City : {item.user.city}</Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>State : {item.user.stateInfo.name}</Text>

            </View>

        </View>

    );

    const render_m_work_history = ({ item }) => (

         
       
        <View style={{ margin: '4%' }}>
          

            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 20 }}>Name : {item.user.name} </Text>

            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>Worked for : {item.skills.map(skill => skill.name).join(', ')}</Text>

            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>Total amount : Rs  {item.payment_amount.toString()}</Text>
            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, marginTop: '5%' }}>Total attendance :</Text>
            <View style={{ flexDirection: 'row' }}>

                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10 }}>Prsent {item.present_attendance.length}</Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10, marginStart: 10 }}>Absent {item.absent_attendance.length}</Text>

            </View>

            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, marginTop: '5%' }}>Total Leaves :</Text>
            <View style={{ flexDirection: 'row' }}>

                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10 }}>Reqest {item.sent_leaves.length}</Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10, marginStart: 10 }}>Approved {item.accepted_leaves.length}</Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, padding: 10, backgroundColor: Colors.grayview, borderRadius: 10, marginStart: 10 }}>Rejected {item.rejected_leaves.length}</Text>

            </View>

            <View style={{ backgroundColor: Colors.dark_gray, height: 3, marginTop: 10 }}>

            </View>

            <View style={{ justifyContent: 'space-evenly' }}>
                {/* {work_history.data[0].user.districtInfo.name} */}
                {/* {work_history.data[0].user.city} */}
                {/* {work_history.data[0].user.stateInfo.name} */}
                {/* <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15, }}>District : {item.user.districtInfo.name} </Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>City : {item.user.city}</Text>
                <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 15, marginTop: 15 }}>State : {item.user.stateInfo.name}</Text> */}

            </View>

        </View>

    );

    const render_monthly_dates = ({ item }) => (

         
       <TouchableOpacity onPress={()=>{
             s_set_montly_dates(new Date(item.start_date).toDateString()+ "-"+new Date(item.end_date).toDateString())
             get_monthly_work_details(item._id)
             closeDialog()
       }}>

 
        <View style={{backgroundColor:Colors.gray,padding:7}}>
            

            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 12, marginTop: 4 }}>Start Date :  {new Date(item.start_date).toDateString()} </Text>

            <Text style={{ fontWeight: 'medium', color: Colors.textcolor, fontSize: 12 }}>End Date : {new Date(item.end_date).toDateString()} </Text>

           

         

           

        </View>
        </TouchableOpacity>

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



           {data.type=="monthly" && (

            <View>
                <View>
                    <TouchableOpacity onPress={openDialog}>
                        <Text style={{margin:10,borderRadius:10,borderWidth:1,overflow:'hidden',borderColor:Colors.orange,padding:10,color:Colors.orange,textAlign:'center'}}>Choose Date</Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ fontWeight: 'bold', color: Colors.textcolor, fontSize: 12,marginStart:10 ,marginTop:10}}>Work Chat for - {s_monthly_dates}</Text>
                <View style={{ height: 4, backgroundColor: Colors.dark_gray, marginTop: 3,marginStart:10 ,marginEnd:10}}></View>


                <FlatList

                            data={work_history}
                            keyExtractor={(item) => item._id.toString()}
                            renderItem={render_m_work_history}
                            />

            </View>

           )}


           {data.type=="daily" &&(
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


                            <FlatList

                            data={work_history}
                            keyExtractor={(item) => item._id.toString()}
                            renderItem={render_work_history}
                            />
                        </View>

           )}
           

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}




        <Modal visible={isDialogVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dialogContainer}>
                        <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Select Date</Text>


                        <FlatList

                            data={monthly_dates}
                            keyExtractor={(item) => item._id.toString()}
                            renderItem={render_monthly_dates}
                            />


                          <View style={styles.buttonContainer}>
                          

                            <TouchableOpacity style={styles.button} onPress={closeDialog}>
                                <Text style={styles.buttonText}>Close</Text>
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

    }, modalContainer: {
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




})



export default WorkDashboardScreen