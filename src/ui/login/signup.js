import React,{Component} from 'react';
import {View,Text,Image,AsyncStorage,ScrollView,Alert,Platform} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Actions} from 'react-native-router-flux';
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';
import CountryPicker from 'react-native-country-picker-modal'
import Geocoder from 'react-native-geocoder';

/*CONSTANTS */
import {FORM_BACKGROUND,APP_COLOR,BUTTON_COLOR,APP_GRADIENT_COLOR2,APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5,FACEBOOK_HEX,GOOGLE_HEX} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {APP_LOGO,APP_BANNER} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TextField from '../../components/textField';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/*STYLES */
import {STYLES} from './styles';

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

/* API */
import {RegisterUser} from '../../api/auth/registerUser'
import {checkUsernameAvailability} from '../../api/auth/checkUsernameAvailability'
import {USER} from '../../api/sharedPreferencesKeys'

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

export default class Signup extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      location:'',
      cca2: '',
      callingCode: '',
      country:'Country(Press Flag)',
      firstName:'',
      lastName:'',
      username:'',
      email:'',
      mobile:'',
      companyName:'',
      password:'',
      confirmPassword:'',
      latitude:0,
      longitude:0
    }
  }
  componentWillMount(){
    this.setState({
      loading:false
    })
    AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
      this.setState({
        loading:false
      })
    })
    //get current location
    navigator.geolocation.getCurrentPosition(
        position => {
          var coords = {
            lat:  position.coords.latitude,
            lng:  position.coords.longitude
          };
          
          Geocoder.geocodePosition(coords).then(res => {
            this.setState({
              cca2:res[0].countryCode,
              location:res[0].country,
              latitude:position.coords.latitude,
              longitude:position.coords.longitude
            })
        })
        .catch(err => console.log(err))

        },
      (error) => console.log(error.message)
      );
  }
  validateEmail(email) {
      var check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return check.test(email);
    };
  validateFields(){

    if(!this.state.firstName){
      Alert.alert(
        '',
        i18.enterValidName,
        [{text:i18.ok}]
      )
      return
    }
    if(!this.state.lastName){
      Alert.alert(
        '',
        i18.enterValidLastName,
        [{text:i18.ok}]
      )
      return
    }

    if(!this.state.email || !this.validateEmail(this.state.email)){
      Alert.alert(
        '',
        i18.enterValidEmail,
        [{text:i18.ok}]
      )
      return
    }
    if(!this.state.mobile || this.state.mobile.length < 10){
      Alert.alert(
        '',
        i18.enterValidContact,
        [{text:i18.ok}]
      )
      return
    }
    if(!this.state.password || !this.state.confirmPassword || this.state.password.length<6 || this.state.confirmPassword.length<6){
    Alert.alert(
      '',
      i18.passwordLengthError,
    [{text:i18.ok}]
  )
  return
}
if(!this.state.companyName){
  Alert.alert(
    '',
    i18.enterValidCompanyName,
    [{text:i18.ok}]
  )
  return
}
    if(this.state.password != this.state.confirmPassword){
      Alert.alert(
        '',
        i18.passwordNotMatched,
        [{text:i18.ok}]
      )
      return
    }
    this.checkUsernameAvailability()
  }

  registerUser(){

    RegisterUser(this.state.latitude,this.state.longitude,this.state.email,this.state.email,this.state.mobile,this.state.location,this.state.firstName,this.state.lastName,this.state.password,this.state.companyName,"seller",i18.getLanguage()).then((response) => {

      if(response.id){
        this.setState({
          loading:false
        }, () => {
          Actions.VerifyEmail({
            email:this.state.email,
            emailSentMsg:i18.emailSent,
            controllerName:"register"
          })
        })
      }
      else{
        Alert.alert(
          '',
          response.message,
          [{text:'OK', onPress: () => {
            this.setState({
              loading:false
            })
          }}]
        )
      }
    })
  }
  checkUsernameAvailability(){
    this.setState({
      loading:true
    })
    checkUsernameAvailability(this.state.email,i18.getLanguage()).then((response) => {
     let status=response[0]
      let data=response[1]
      if(status > 299){
        Alert.alert(
          '',
          data.message,
          [{text:i18.ok,onPress: () =>   this.setState({
                  loading:false
                })}]
        )
        return
      }
      else{
        this.registerUser()
      }
    })
  }
  render(){
    return(
      <LinearGradient colors={[APP_COLOR, APP_GRADIENT_COLOR2, APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5]} style={{flex:1}}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
      <KeyboardAwareScrollView extraScrollHeight={20}>
        <Image resizeMode="stretch" source={APP_LOGO} style={STYLES.logo}/>
          <ScrollView contentContainerStyle={{paddingBottom:SCREEN_HEIGHT/50}}>
          <View style={[STYLES.txtFieldContainer]}>
            <View style={{flexDirection:'row'}}>
            <Text style={[STYLES.text,{fontSize:14,color:'#C7C7CD',marginLeft:SCREEN_HEIGHT/50,marginTop:0,alignItems:'center'}]}>{i18.countryOrRegion}</Text>
            <Text style={[STYLES.language,{marginTop:0,alignItems:'center',marginRight:37}]}>{this.state.cca2}</Text>
            </View>
            <View style={{right:5,top:8,position:'absolute'}}>
              <CountryPicker onChange={value => this.setState({cca2:value.cca2,callingCode:value.callingCode,location:value.name})} cca2={this.state.cca2} filterable/>
            </View>
          </View>
            <TextField onChangeText={(firstName) => this.setState({firstName})} placeholder={i18.firstName}/>
            <TextField onChangeText={lastName => this.setState({lastName})} placeholder={i18.lastName}/>
            <TextField autoCapitalize="none" keyboardType="email-address" onChangeText={email => this.setState({email})} placeholder={i18.email}/>
            <TextField maxLength={16} keyboardType="phone-pad" onChangeText={mobile => this.setState({mobile})} placeholder={i18.mobile}/>
            <TextField onChangeText={companyName => this.setState({companyName})} placeholder={i18.companyName}/>
            <TextField autoCapitalize="none" secureTextEntry onChangeText={password => this.setState({password})} placeholder={i18.password}/>
            <TextField autoCapitalize="none" secureTextEntry onChangeText={confirmPassword => this.setState({confirmPassword})} placeholder={i18.confirmPassword}/>

            <View style={[STYLES.button,{marginTop:SCREEN_HEIGHT/25,marginHorizontal:SCREEN_HEIGHT/25,backgroundColor:'white'}]}>
              <TouchableOpacityBtn onPress={() => this.validateFields()} style={STYLES.buttonTxt} title={i18.signup}/>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </LinearGradient>
    )
  }
}
