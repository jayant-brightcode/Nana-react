import React, { useState,useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, ScrollView,ActivityIndicator ,StatusBar} from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import DateTimePicker from '@react-native-community/datetimepicker'

import Picker from '@ouroboros/react-native-picker';
import { getToken } from "../Utils/LocalStorage.js";
import { Remote } from "../Utils/Remote.js";
import { useRoute } from '@react-navigation/native';
const languages = [
  { id: 1, name: 'I am a Employee (Job Seekers)' },
  { id: 2, name: 'I am a Employer' },
  { id: 3, name: 'Both' },

  // Add more languages as needed
];

const genders = [{
  text:'Male',value:'Male'
},{
  text:'Female',
  value:'Female'
},{
  text:'Other',
  value:'Other'
}];


const RegistrationFormScreen = () => {

  const navigation = useNavigation()
  const route = useRoute();
  const { detail } = route.params
 
  const [selectedItem, setSelectedItem] = useState(languages[0]);
  const [show_extra, set_show_extra] = useState(false);

  const [loading, setLoading] = useState(false);










  const handleItemPress = (item) => {
    setSelectedItem(item);
    Toast.show({
      type: 'success',
      text1: `Selected Category: ${item.name}`,
    });

    if(item.id==1){
      set_c_type("employee")
    }
    if(item.id==2){
      set_c_type("employer")
    }

    if(item.id==3){
      set_c_type("both")
    }

    if(item.id==1 || item.id==3){
      set_show_extra(true)
      

      

    }else{
      set_show_extra(false)

    }

    


  };
  const [chosenDate, setChosenDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [job_pref, set_job_prefs] = useState([]);
  let [picker, setPicker] = useState('');
  let [gender_picker, gender_setPicker] = useState('Male');


  const [name, setName] = useState('');

  const [alternate_phone, set_alternate_phone] = useState('');
  const [permanent_address, set_permanent_address] = useState('');
  const [present_address, set_present_address] = useState('');
  const [c_type, set_c_type] = useState(detail.customer_type);
  const [avg_amount, set_avg_amount] = useState('');


  useEffect(() => {
    getJobPreference();
  }, []);


 




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
      

         job_pref.length = 0;

         for (let index = 0; index < data.job_preferences.length; index++) {
            const job_ui = {
              text: data.job_preferences[index].name,
              value: data.job_preferences[index]._id
            }
            
            job_pref.push(job_ui)

        
          
         }

      
      
      






      } else {
        console.error('Error:', response.status, response.statusText);
  
      }
    } catch (error) {
      console.error('Fetch error:', error);
 
    }





  };

  const updateProfile = async () => {


    if (!name.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter name`,
      });
      return;
    }

    if (!alternate_phone.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter phone number`,
      });
      return;
    }

    if (!isValidPhone(alternate_phone)) {
      Toast.show({
        type: 'success',
        text1: `Please enter correct phone number`,
      });
      return;
    }

    if (!present_address.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter present address`,
      });
      return;
    }

    if (!permanent_address.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter permanent adress`,
      });
      return;
    }

    if (c_type=="both" || c_type=="employee") {

     

      if(picker=='' || picker==null){
        Toast.show({
          type: 'success',
          text1: `Please choose job preference`,
        });
        return;
      }

      if (avg_amount=='') {
        Toast.show({
          type: 'success',
          text1: `Please enter avg amount`,
        });
        return;
      }
   
    }

 

    try {

      setLoading(true)
      const apiUrl = Remote.BASE_URL + "user/update_profile";

      const userData = {
        name: name,
        gender: gender_picker,
        alternate_phone: alternate_phone,
        dob: chosenDate,
        customer_type:c_type,
        permanent_address:permanent_address,
        present_address:present_address,
        job_pref_id:c_type=="employer" ? null : picker,
        avarage_price:c_type=="employer" ? null : avg_amount
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
    
        navigation.navigate("ChoosePlanScreen")


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





 















  return (
    <View style={styles.container}>


      <View style={styles.content}>

        <Text style={{ fontSize: 23, color: Colors.white, fontWeight: "bold", marginStart: 10, marginTop: 10,marginBottom:20 }}>Update Profile</Text>

      
      </View>

      <ScrollView>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}


        <View style={{ padding: 20, marginTop: 30 }}>
          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginBottom: 10 }}>Your Name here</Text>

          <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={(text) => setName(text)} />


          {/* <View style={styles.rowstyle}>

           

                <View>
                    <Text style={{color:Colors.textcolor,fontWeight:'medium',fontSize:15,marginBottom:10}}>Gender</Text>
                    <Text style={styles.rowinput}>select gender</Text>
    

                </View>
           
                <View>

                
                    <Text style={{color:Colors.textcolor,fontWeight:'medium',fontSize:15,marginBottom:10}}>Date of Birth</Text>

                    <Text style={styles.rowinput}>select gender</Text>

                </View>
            </View> */}
          <View style={styles.rowstyle}>
            <View>
              <Text style={styles.labelText}>Gender</Text>
              <Picker
                onChanged={gender_setPicker}
                options={genders}
                style={styles.input}
                value={gender_picker}

              />
             
            </View>



            <View>
              <Text style={styles.labelText}>Date of Birth</Text>
              <TouchableWithoutFeedback onPress={openDatePicker}>
                <Text style={styles.rowinput}>{chosenDate.toDateString()}</Text>
              </TouchableWithoutFeedback>
              {showDatePicker && (
                <DateTimePicker
                  value={chosenDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>



          </View>

         

          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginBottom: 10 }}>Alternate Mobile Number</Text>

          <TextInput style={styles.input} placeholder="Enter Alternate mobile number here" keyboardType="number-pad" value={alternate_phone} onChangeText={(text) => set_alternate_phone(text)} />


          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginBottom: 10 }}>Permanent Address</Text>

          <TextInput style={styles.input} placeholder="Enter Permanent address here" value={permanent_address} onChangeText={(text) => set_permanent_address(text)} />


          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginBottom: 10 }}>Present Address</Text>

          <TextInput style={styles.input} placeholder="Enter Present address here" value={present_address} onChangeText={(text) => set_present_address(text)} />
          {/* <View style={styles.footer}> */}


        

        {c_type=="employee" && (

          <View>
        
          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginBottom: 10 }}>Enter your job preference</Text>

          <Picker
            onChanged={setPicker}
            options={job_pref}
            style={styles.input}
            value={picker}
          
          />
       

          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 15, marginBottom: 10 }}>Enter your average amount</Text>

              <TextInput style={styles.input} placeholder="Choose amount" value={avg_amount} onChangeText={(text) => set_avg_amount(text)} keyboardType="numeric" />

          </View>

        )}



          <TouchableOpacity style={styles.button} onPress={() => {

            updateProfile()
           

          }}>


            <Text style={styles.buttonText}>Register Now</Text>
          </TouchableOpacity>
          {/* </View> */}



        </View>
      </ScrollView>




    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Set your desired background color
  },
  rowstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {


    backgroundColor: Colors.orange,
  },
  selectedItem: {
    backgroundColor: Colors.white, // Highlight the selected item
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderColor: Colors.white,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: '12%', // Adjust the height of each item
  },
  languageName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,


  },
  rowinput: {
    width: 150,
    height: 45,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,


  },
  genderDropdown: {

    borderColor: Colors.gray,
    borderRadius: 8,


  },
  dropdownOptions: {
    position: 'absolute',
    top: 70,
    backgroundColor: 'white',
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 1,
    width: 150,
    borderColor: Colors.gray,
  },
  dropdownText: {
    color: Colors.textcolor,
  },
  button: {



    width: '100%',
    bottom: 30,
    marginTop: 30,

    height: '10%', // Set the desired height here
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
  footer: {
    position: 'absolute',
    bottom: 20,

    width: "100%"

  }
});

export default RegistrationFormScreen


function isValidPhone(value) {
  const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
  return phonePattern.test(value)
}
