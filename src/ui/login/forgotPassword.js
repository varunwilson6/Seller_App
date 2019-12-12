import React,{Component} from 'react';
import {View,Text,Image,Alert,AsyncStorage} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import PhoneInput from 'react-native-phone-input'
import {Actions} from 'react-native-router-flux';
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';

/*CONSTANTS */
import {FORM_BACKGROUND,BUTTON_COLOR,APP_COLOR,APP_GRADIENT_COLOR2,APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5,FACEBOOK_HEX,GOOGLE_HEX} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {APP_LOGO} from '../../constants/image';

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
import {passwordResetLink} from '../../api/user/passwordResetLink'

export default class VerifyPhone extends Component{
  constructor(props){
    super(props);
    this.state={
      visible:false,
      email:''
    }
  }
  componentWillMount(){
    this.setState({
      visible:false
    })
    AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
      this.setState({
        visible:false
      })
    })
  }
  validateEmail(email) {
      var check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return check.test(email);
    };
  forgotPassword(){
    if(!this.state.email || !this.validateEmail(this.state.email)){
      Alert.alert(
        '',
        i18.enterValidEmail,
        [{text:i18.ok}]
      )
      return
    }
    this.passwordResetLink()
  }
  passwordResetLink(){
    this.setState({
      visible:true
    })
    passwordResetLink(this.state.email,i18.getLanguage()).then((response) => {
      let status=response[0]
      let data=response[1]
      if(status > 299){
        Alert.alert(
          '',
          data.message,
          [{text:i18.ok,onPress: () =>   this.setState({
                  visible:false
                })}]
        )
        return
      }
      else {
        this.setState({
          visible:false
        })
        Actions.VerifyEmail({
          email:this.state.email,
          emailSentMsg:i18.passwordResetMsg
        })
      }
    })
  }

  render(){
    return(
      <LinearGradient colors={[APP_COLOR, APP_GRADIENT_COLOR2, APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5]} style={{flex:1}}>
      <KeyboardAwareScrollView>
      <Spinner visible={this.state.visible} textStyle={{color: '#FFF',marginTop:-60}} />

      <Image resizeMode="stretch" source={APP_LOGO} style={[STYLES.logo,{marginTop:SCREEN_HEIGHT/6.25-64}]}/>
          <Text style={[STYLES.text,{fontSize:13,marginTop:SCREEN_HEIGHT/16.6,color:'white'}]}>{i18.enterEmail}</Text>
          <TextField autoCapitalize="none" keyboardType="email-address" onChangeText={email => this.setState({email})} placeholder={i18.email}/>
          <View style={[STYLES.button,{marginTop:SCREEN_HEIGHT/25,marginHorizontal:SCREEN_HEIGHT/25,backgroundColor:'white'}]}>
              <TouchableOpacityBtn onPress={() => this.forgotPassword()} style={STYLES.buttonTxt} title={i18.verify}/>
          </View>
      </KeyboardAwareScrollView>
      </LinearGradient>
    )
  }
}
