import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, ScrollView, ActivityIndicator, StatusBar,Modal,FlatList, SafeAreaView } from "react-native";
import Colors from "../Utils/Color";
import { useNavigation } from '@react-navigation/native'; // Import navigation functions
import Toast from 'react-native-toast-message'; // Make sure to import react-native-toast-message
import DateTimePicker from '@react-native-community/datetimepicker'

import Picker from '@ouroboros/react-native-picker';
import { getSavedLanguage, getToken } from "../Utils/LocalStorage.js";
import { Remote } from "../Utils/Remote.js";
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import RNExitApp from 'react-native-exit-app';

const languages = [
  { id: 1, name: 'I am a Employee (Job Seekers)' },
  { id: 2, name: 'I am a Employer' },
  { id: 3, name: 'Both' },

  // Add more languages as needed
];

const genders = [{
  text: 'Male', value: 'Male'
}, {
  text: 'Female',
  value: 'Female'
}, {
  text: 'Other',
  value: 'Others'
}];

const genderlist = [{
  name:"Male",
  id:1
},{
  name:"Female",
  id:2

},{
  name:'Others',
  id:3
}]


const RegistrationFormScreen = () => {

  const navigation = useNavigation()
  const route = useRoute();
  const { page } = route.params

  const [selectedItem, setSelectedItem] = useState(languages[0]);
  const [show_extra, set_show_extra] = useState(false);

  const [loading, setLoading] = useState(false);

  const [profile, set_profile] = useState({});

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
          changeLanguage("bn");
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
    getProfile();
    fetchLanguage()
  }, []);



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

        console.log("pplll"+data.profile_details.phone)


        set_profile(data.profile_details)
        set_c_type(data.profile_details.customer_type)
        setName(data.profile_details.name)
        setEmail(data.profile_details.email)
        if (data.profile_details.gender != null) {
          gender_setPicker(data.profile_details.gender)

        }
     
        if (data.profile_details.average_price != null) {
          set_avg_amount(data.profile_details.average_price.toString())
        }

        if (data.profile_details.job_pref != null) {
          console.log(data.profile_details.job_pref._id)
          setPicker(data.profile_details.job_pref._id)
        }


        if(data.profile_details.phone!=null){
          set_phone(data.profile_details.phone)
          console.log("pppp "+data.profile_details.phone)
        }

        if (page.screen == "profile") {
          if(data.profile_details.aadhar_number!=null){
            set_aadhar_number(data.profile_details.aadhar_number)

          }
          if(data.profile_details.education!=null){
            set_education(data.profile_details.education)

          }

          if(data.profile_details.city!=null){
           
          set_city(data.profile_details.city)

          }

          if(data.profile_details.state!=null){
            set_state(data.profile_details.state.name)
            set_selected_state_id(data.profile_details.state._id)
          }

          if(data.profile_details.district!=null){
            set_district(data.profile_details.district.name)
            set_selected_district_id(data.profile_details.district._id)
          }

          if(data.profile_details.dob!=null){
            setChosenDate(new Date(data.profile_details.dob))
          }

          if(data.profile_details.alternate_phone!=null){
            set_alternate_phone(data.profile_details.alternate_phone)
          }

          if(data.profile_details.phone!=null){
            set_phone(data.profile_details.phone)
            console.log("pppp "+data.profile_details.phone)
          }
       

          if(data.profile_details.present_address!=null){
            set_present_address(data.profile_details.present_address)
          }

          if(data.profile_details.present_address!=null){
           
          set_permanent_address(data.profile_details.permanent_address)
          }



          

          
          

  

  

        


        
        


        }

      





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





  const handleItemPress = (item) => {
    setSelectedItem(item);
   

    if (item.id == 1) {
      set_c_type("employee")
    }
    if (item.id == 2) {
      set_c_type("employer")
    }

    if (item.id == 3) {
      set_c_type("both")
    }

    if (item.id == 1 || item.id == 3) {
      set_show_extra(true)




    } else {
      set_show_extra(false)

    }




  };


  const [chosenDate, setChosenDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [job_pref, set_job_prefs] = useState([]);
  let [picker, setPicker] = useState();
  let [gender_picker, gender_setPicker] = useState("Male");


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [alternate_phone, set_alternate_phone] = useState('');
  const [phone, set_phone] = useState('');


  console.log("ssss"+phone)

  const [permanent_address, set_permanent_address] = useState('');
  const [present_address, set_present_address] = useState('');
  const [c_type, set_c_type] = useState(profile.customer_type);
  const [avg_amount, set_avg_amount] = useState('');
  const [aadhar_number, set_aadhar_number] = useState('');
  const [education, set_education] = useState('');

  const [state, set_state] = useState('');
  const [district, set_district] = useState('');
  const [city, set_city] = useState('');
  const [selected_state_id, set_selected_state_id] = useState('');
  const [selected_district_id, set_selected_district_id] = useState('');
  const [state_list, set_state_list] = useState([]);
  const [distrcit_list, set_distrcit_list] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);

  const [isDialogVisible2, setDialogVisible2] = useState(false);
  const [selected_state_id_for_district, set_selected_state_id_for_district] = useState('');
  const [gender_dialog_visible, set_gender_dialog_visible] = useState(false);


  useEffect(() => {
    get_state();
  }, []);




  const openDialog = () => {

    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const openGenderDialog = () => {

    set_gender_dialog_visible(true);
  };

  const closeGenderDialog = () => {
      set_gender_dialog_visible(false);
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
  
    // Toast.show({
    //   type: 'success',
    //   text1: `Selected Category: ${item.name}`,
    // });


  };

  const select_district = (item) => {


    set_selected_district_id(item._id)
    set_district(item.name)
    closeDialog1()
 


 


  };

  const onDateChange = (event, selectedDate) => {
    console.log(selectedDate)
    setShowDatePicker(false)
    // if (event.type === 'set') {
     setChosenDate(selectedDate);
    //   setShowDatePicker(false);
    // } else {
    //   setShowDatePicker(false);
    // }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
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
        text1: `Please enter alternate phone number`,
      });
      return;
    }

    // if (!phone.trim()) {
    //   Toast.show({
    //     type: 'success',
    //     text1: `Please enter phone number`,
    //   });
    //   return;
    // }

    if (!isValidPhone(alternate_phone)) {
      Toast.show({
        type: 'success',
        text1: `Please enter correct alternate phone number`,
      });
      return;
    }

    // if (!isValidPhone(phone)) {
    //   Toast.show({
    //     type: 'success',
    //     text1: `Please enter correct phone number`,
    //   });
    //   return;
    // }

   
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

    if (!aadhar_number.toString().trim()) {

      
      Toast.show({
        type: 'success',
        text1: `Please enter aadhar number`,
      });
      return;
    }

    if (aadhar_number.toString().trim().length !==12) {

      
      Toast.show({
        type: 'success',
        text1: `Please enter correct aadhar number`,
      });
      return;
    }

    if (!education.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter your education`,
      });
      return;
    }

 

    if (selected_state_id=='') {
      Toast.show({
        type: 'success',
        text1: `Please choose your state`,
      });
      return;
    }

    if (selected_district_id == '') {
      Toast.show({
        type: 'success',
        text1: `Please choose your district`,
      });
      return;
    }


    if (!city.trim()) {
      Toast.show({
        type: 'success',
        text1: `Please enter your city`,
      });
      return;
    }


    



    try {

      console.log(email)

      setLoading(true)
      const apiUrl = Remote.BASE_URL + "user/update_profile";

      const userData = {
        name: name,
        gender: gender_picker,
        alternate_phone: alternate_phone,
        
        dob: chosenDate,
        permanent_address: permanent_address,
        present_address: present_address,
        aadhar_number:aadhar_number,
        education:education,
        state_id:selected_state_id,
        district_id:selected_district_id,
        city:city
       
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


        if (page.screen == "profile") {
          navigation.goBack()
        } else {
          navigation.navigate("ChoosePlanScreen")
        }




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

    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.orange }}>

    <View style={styles.container}>


      <View style={styles.content}>

       <View style={{flexDirection:'row',marginTop: 10,alignItems:'center'}}>

       <TouchableOpacity onPress={()=>{
                        if (navigation.canGoBack()) {
                          navigation.goBack()
                        
                          // Close the app if there are no screens to go back to
                        //  BackHandler.exitApp();
                        }else{
                         
                              RNExitApp.exitApp();

                     
                        }
                    }}>
                  <Image style={{ width: 20, height: 20,marginStart:10 }} source={require('../../assets/images/arrow.png')}></Image>


                    </TouchableOpacity>  

                    <Text style={{marginStart:15, fontSize: 23, color: Colors.white, fontWeight: "bold", marginStart: 10 }}>{t('Update Profile')}</Text>

       </View>

      

      </View>

      <ScrollView>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}


        <View style={{ padding: 20, }}>
          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10 }}>{t('Your Name here')}</Text>

          <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={(text) => setName(text)} />


          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10 }}>{t('Your Email here')}</Text>

          <Text style={styles.input} placeholder="Your Email Address">{email}</Text>
          <Text style={styles.input} placeholder="Your Phone Here">{phone}</Text>


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
            
                
             
              <Text style={{ fontSize: 12 }}>{t('Gender')}</Text>
              <TouchableOpacity onPress={openGenderDialog}>

        
              <Text  style={{
                  borderColor: Colors.orange,
                  borderWidth: 1, height: 40, backgroundColor: Colors.grayview, borderRadius: 10, padding:10, color: Colors.textcolor }}
              >{gender_picker}</Text>
                  </TouchableOpacity>

            </View>



            <View>
              <Text style={{ fontSize: 12 }}>{t('Date of Birth')}</Text>
              <TouchableOpacity onPress={openDatePicker}>
                <Text style={{
                  borderColor: Colors.orange,
                  borderWidth: 1,marginTop: 8, height: 40, backgroundColor: Colors.grayview, padding: 10, color: Colors.textcolor }}>{chosenDate.toDateString()}</Text>
              </TouchableOpacity>
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



          </View>






          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>{t('Alternate Mobile Number')}</Text>

          <TextInput style={styles.input} placeholder="Enter Alternate mobile number here" keyboardType="number-pad" value={alternate_phone} onChangeText={(text) => {
            if(text.length<=10){
              set_alternate_phone(text)
             }
          }} />


         


          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>{t('Aadhar Number')}</Text>

          <TextInput style={styles.input} placeholder="Enter your Aadhar number here" keyboardType="number-pad" value={aadhar_number} onChangeText={(text) => {
            if(text.length<=12){
              set_aadhar_number(text)
             }
          }} />

          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>{t('Enter your Education')}</Text>

          <TextInput style={{
            borderColor: Colors.orange,
            borderWidth: 1,backgroundColor: Colors.gray, height: 70, width: '100%', borderRadius: 10, padding: 10, textAlignVertical: 'top' }} keyboardAppearance="default" placeholder="Enter your Education details here" multiline={true} value={education} onChangeText={(text) => set_education(text)} />

         

          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>{t('State')}</Text>

           <TouchableOpacity onPress={()=>{
             openDialog();
           }}>
            <Text style={styles.input}>{state != '' ? state : 'Select your State'}</Text>

           </TouchableOpacity>

          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>{t('District')}</Text>

          <TouchableOpacity onPress={() => {
            openDialog1();
          }}>
            <Text style={styles.input}>{district != '' ? district : 'Select your District'}</Text>

          </TouchableOpacity>
       

          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>{t('Enter your city name')}</Text>

          <TextInput style={styles.input} placeholder="Enter your city name" value={city} onChangeText={(text) => set_city(text)} />



          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10 }}>{t('Permanent Address')}</Text>

          <TextInput style={{
            borderColor: Colors.orange,
            borderWidth: 1, backgroundColor: Colors.gray, height: 70, width: '100%', borderRadius: 10, padding: 10, textAlignVertical: 'top' }} placeholder="Enter Permanent address here" value={permanent_address} onChangeText={(text) => set_permanent_address(text)} />


          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10, marginTop: 10 }}>{t('Present Address')}</Text>

          <TextInput style={{
            borderColor: Colors.orange,
            borderWidth: 1, backgroundColor: Colors.gray, height: 70, width: '100%', borderRadius: 10, padding: 10, textAlignVertical: 'top' }} placeholder="Enter Present address here" value={present_address} onChangeText={(text) => set_present_address(text)} />
          {/* <View style={styles.footer}> */}




          {/* {c_type=="employee" && (

          <View>
        
          <Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginBottom: 10 }}>Enter your job preference</Text>

          <Picker
            onChanged={setPicker}
            options={job_pref}
            style={{height:40,width:'100%',backgroundColor:Colors.grayview,borderRadius:10,padding:10,fontSize:12}}
            value={picker}
          
          />
          {
            console.log(picker)
          }

<Text style={{ color: Colors.textcolor, fontWeight: 'medium', fontSize: 12, marginTop:10 }}>Enter your average amount</Text>

<TextInput style={{height:40,width:'100%',backgroundColor:Colors.grayview,borderRadius:10,padding:10,marginTop:10,fontSize:12}} placeholder="Choose amount" value={avg_amount} onChangeText={(text) => set_avg_amount(text)} keyboardType="numeric" />

       

      
          </View>

        )} */}



          <TouchableOpacity style={{ backgroundColor: Colors.orange, padding: 12, borderRadius: 10, marginTop: '4%' }} onPress={() => {

            updateProfile()


          }}>


            <Text style={{ textAlign: 'center', color: Colors.white, fontWeight: 'bold' }}>{t('Register Now')}</Text>
          </TouchableOpacity>
          {/* </View> */}







        </View>
      </ScrollView>


      <Modal visible={isDialogVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.dialogContainer}>
            <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Select State</Text>

            <FlatList style={{ marginTop: 10, marginBottom: 10,height:500 }}
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
                           <Text style={{backgroundColor:Colors.red,padding:10,color:Colors.white,borderRadius:10,width:80,textAlign:'center'}}>Close</Text>

            </TouchableOpacity>







          </View>
        </View>
      </Modal>

      <Modal visible={isDialogVisible2} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.dialogContainer}>
            <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Select District</Text>

            <FlatList style={{ marginTop: 10, marginBottom: 10, height: 500 }}
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
             <Text style={{backgroundColor:Colors.red,padding:10,color:Colors.white,borderRadius:10,width:80,textAlign:'center'}}>Close</Text>
            </TouchableOpacity>







          </View>
        </View>
      </Modal>

      <Modal visible={gender_dialog_visible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.dialogContainer}>
            <Text style={{ color: Colors.black, alignSelf: 'center', marginBottom: 20, fontWeight: 'bold' }}>Select Your Gender</Text>

            <FlatList style={{ marginTop: 10, marginBottom: 10,height:300 }}
              data={genderlist}

              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    gender_setPicker(item.name)
                    closeGenderDialog()
                  } }
                >
                  <Text style={{ color: Colors.textcolor,padding:10,borderRadius:10,borderColor:Colors.orange,borderWidth:1,marginTop:10 }}>{item.name}</Text>
                </TouchableOpacity>

              )}
            />

            <TouchableOpacity onPress={() => {
              closeGenderDialog()
            }}>
             <Text style={{backgroundColor:Colors.red,padding:10,color:Colors.white,borderRadius:10,width:80,textAlign:'center'}}>Close</Text>

            </TouchableOpacity>







          </View>
        </View>
      </Modal>



    </View>

    </SafeAreaView>
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
    height:70
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
    height: 40,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    fontSize: 12,
    borderColor:Colors.orange,
    borderWidth:1


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

    marginTop: '2%',

    height: '8%', // Set the desired height here
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

export default RegistrationFormScreen


function isValidPhone(value) {
  const phonePattern = /^\d{10}$/; // Assumes a 10-digit phone number
  return phonePattern.test(value)
}
