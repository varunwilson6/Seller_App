import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform,FlatList} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { TextField } from 'react-native-material-textfield';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from 'react-native-modal-datetime-picker';
import  moment from 'moment';

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {CANCEL,NO_REFERENCE} from '../../constants/image';
import {APP_COLOR} from '../../constants/colors';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';
import AddTitleModal from '../../components/addTitleModal';
import { createSellerStripeAccount } from '../../api/kyc/kycStripe';

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

import {YELLOW_COLOR,BUTTON_COLOR,FORM_BACKGROUND} from '../../constants/colors';

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

/*STYLES */
import {STYLES} from './styles';

/* API */
import {USER} from '../../api/sharedPreferencesKeys'
import {addReference} from '../../api/references/addReference'
import {userProfile} from '../../api/user/userProfile'
import {referenceById} from '../../api/references/referenceById'
import {updateReference} from '../../api/references/updateReference'

var sellerId=""
var apiKey=""

export default class KycForm extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:false,
      name:'',
      companyName:'',
      contactNumber:'',
      email:'',
      website:'',
      description:'',
      isDateTimePickerVisible: false,
      dob:'Date of Birth'
    }
  }
  componentWillMount(){
     this.setState({
       visible:false
     })
     if(this.props.referenceId){
       this.setState({
         loading:true
       })
     }
     AsyncStorage.getItem(USER).then((value) => {
     if(value){
       var user = JSON.parse(value)
       sellerId=user.user.id
       apiKey=user.auth.key
       this.getCurrLang()
     }
   })
   }

   getCurrLang(){
      AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
    })
    }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {

    console.log(date)
    this.setState({
      dob:moment(date).format('MM/DD/YYYY')
    }, ()=>{console.log(this.state.dob)})
    this._hideDateTimePicker();
  };

  submitKycForm(){
      Alert.alert(
        '',
        i18.kycSubmitConfirm,
        [{text:i18.cancel, onPress: () => {
          
        }},
          {text:i18.ok, onPress: () => {
            console.log(this.state)
          }}
        ]
      )
  }

  render(){
    const dob = this.state.dob;
    console.log("Dob >>",dob)
    return(
      <View style={{flex:1,backgroundColor:'white',paddingBottom:20}}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

      <DateTimePicker isVisible={this.state.isDateTimePickerVisible} onConfirm={this._handleDatePicked} onCancel={this._hideDateTimePicker}/>

      <KeyboardAwareScrollView>
      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/33.3,textAlign:'left',fontSize:14,color:APP_COLOR,fontWeight:'bold'}]}>{i18.personalDetails}</Text>

      <View style={[STYLES.textfield,{marginTop:0}]}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="First Name" value={this.state.name} onChangeText={ (name) => this.setState({ name })}/>
      </View>

      <View style={[STYLES.textfield,{marginTop:0}]}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="Last Name" value={this.state.name} onChangeText={ (name) => this.setState({ name })}/>
      </View>

      <View style={[STYLES.textfield,{marginTop:0}]}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="External Account" value={this.state.name} onChangeText={ (name) => this.setState({ name })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.city} value={this.state.companyName} onChangeText={ (companyName) => this.setState({ companyName })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.zipCode} value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.state} value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

          <View style={STYLES.textfield}>
            <TouchableOpacity title="Date of birth" onPress={() => this._showDateTimePicker()}>
              <Text fontSize={14}>{this.state.dob}</Text>
            </TouchableOpacity>
          </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="Last 4 digit SSN" keyboardType="number-pad" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="Type" keyboardType="number-pad" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={[STYLES.grayDiv,{height:8,marginTop:SCREEN_HEIGHT/50}]}/>

      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/50,marginLeft:SCREEN_HEIGHT/33.3,textAlign:'left',fontSize:14,color:APP_COLOR,fontWeight:'bold'}]}>{i18.companyDetails}</Text>

      <View style={[STYLES.textfield,{marginTop:0}]}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="Business Name" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="Business Tax Id" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="External Account" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="City" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="Zipcode" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="State" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="Last 4 digit SSN" keyboardType="number-pad" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.textfield}>
        <TextField labelTextStyle={{fontFamily:"DIN-Regular"}} tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label="Type" keyboardType="number-pad" value={this.state.contactNumber} onChangeText={ (contactNumber) => this.setState({ contactNumber })}/>
      </View>

      <View style={STYLES.relativeButton}>
          <TouchableOpacityBtn onPress={() => this.submitKycForm()} style={[STYLES.buttonTxt,{color:'white'}]} title={i18.submit}/>
      </View>

      </KeyboardAwareScrollView>


    </View>
    )
  }
}
