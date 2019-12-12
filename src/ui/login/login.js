import React,{Component} from 'react';
import {View,Text,Image,AsyncStorage,Alert,TouchableOpacity} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Actions} from 'react-native-router-flux';
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';
import ImageLoad from 'react-native-image-placeholder';

/*CONSTANTS */
import {FORM_BACKGROUND,YELLOW_COLOR,APP_COLOR,LIGHT_GRAY,BUTTON_COLOR,APP_GRADIENT_COLOR2,APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5,FACEBOOK_HEX,GOOGLE_HEX} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {APP_LOGO,CANCEL} from '../../constants/image';

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

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

/* API */
import {login} from '../../api/auth/login'
import {USER} from '../../api/sharedPreferencesKeys'
import {loginWithFacebook,loginWithGoogle} from '../../api/socialAuth/index'

export default class Login extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:false,
      email:'',
      password:''
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
  }
  loginWithFacebook(){

  }
  loginWithGoogle(){

  }
  validateEmail(email) {
      var check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return check.test(email);
    };
  login(){
    if(!this.state.email || !this.validateEmail(this.state.email)){
      Alert.alert(
        '',
        i18.enterValidEmail,
        [{text:i18.ok}]
      )
      return
    }
    if(!this.state.password){
      Alert.alert(
        '',
        i18.passwordCannotBeEmpty,
        [{text:i18.ok}]
      )
      return
    }
    this.setState({
      loading:true
    })
    login(this.state.email,this.state.password,i18.getLanguage()).then((response) => {
      if(response.code > 299){

        Alert.alert(
          '',
          response.message,
          [{text:i18.ok,onPress: () =>   this.setState({
                  loading:false
                })}]
        )
        return
      }
      if(response.user){
        if(response.user.role=="seller"){
          this.setState({
            loading:false
          })
          AsyncStorage.setItem(USER,JSON.stringify(response))
          Actions.BottomTab({
            controllerName:'login'
          })
        }
        else {
          Alert.alert(
            '',
            i18.onlySellersCanLoggedin,
            [{text:i18.ok,onPress: () =>   this.setState({
                    loading:false
                  })}]
          )
        }
      }
      else{
        Alert.alert(
          '',
          response.message,
          [{text:i18.ok,onPress: () =>   this.setState({
                  loading:false
                })}]
        )
      }
    })
  }
  forgotPassword(){
    Actions.ForgotPassword()
  }
  render(){
    return(
      <View style={{flex:1,backgroundColor:LIGHT_GRAY}}>

      <LinearGradient colors={[APP_COLOR, APP_GRADIENT_COLOR2, APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5]} style={{flex:1}}>
      <KeyboardAwareScrollView extraScrollHeight={20}>
      <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

        <Image  resizeMode="stretch"source={APP_LOGO} style={[STYLES.logo,{marginTop:SCREEN_HEIGHT/6.25-64}]}/>
          <TextField marginTop={SCREEN_HEIGHT/16.6} autoCapitalize="none" keyboardType="email-address" onChangeText={email => this.setState({email})} placeholder={i18.email}/>
          <TextField secureTextEntry autoCapitalize="none" onChangeText={password => this.setState({password})} placeholder={i18.password}/>
           <View style={[STYLES.button,{marginTop:SCREEN_HEIGHT/25,marginHorizontal:SCREEN_HEIGHT/25,backgroundColor:'white'}]}>
            <TouchableOpacityBtn onPress={() => this.login()} style={STYLES.buttonTxt} title={i18.login}/>
          </View>
        <RippleButton onPress={() => this.loginWithFacebook()} style={[STYLES.button,{backgroundColor:FACEBOOK_HEX,marginTop:SCREEN_HEIGHT/20}]} textAlign="left" title={i18.continueWithFb}
          icon="facebook" iconColor="white"/>
        <RippleButton onPress={() => this.loginWithGoogle()} style={[STYLES.button,{backgroundColor:GOOGLE_HEX,marginTop:SCREEN_HEIGHT/50}]} textAlign="left" title={i18.continueWithGoogle}
          icon="google" iconColor="white"/>
        <TouchableOpacityBtn onPress={() => this.forgotPassword()} style={[STYLES.touchableOpacity,{color:YELLOW_COLOR}]} title={i18.forgotPassword}/>
      </KeyboardAwareScrollView>

      </LinearGradient>

      </View>
    )
  }
}
