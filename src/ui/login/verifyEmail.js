import React,{Component} from 'react';
import {View,Text,Image,AsyncStorage,ScrollView,Alert,TouchableOpacity} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux';
import LocalizedStrings from 'react-native-localization';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/*CONSTANTS */
import {YELLOW_COLOR,APP_COLOR,BUTTON_COLOR,APP_GRADIENT_COLOR2,APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5,FACEBOOK_HEX,GOOGLE_HEX} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {APP_LOGO,APP_BANNER} from '../../constants/image';

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

import {USER} from '../../api/sharedPreferencesKeys'

/* API */
import {verifyEmail} from '../../api/auth/verifyEmail'

export default class VerifyEmail extends Component{

  login(){
    Actions.Login()
  }
  getVerificationLink(){
    if(this.props.controllerName=="register"){
      verifyEmail(this.props.email,i18.getLanguage()).then((response) => {
        Alert.alert(
          '',
          response.message,
          [{text:i18.ok}]
        )
      })
    }
    else{
      Actions.pop()
    }
  }
  render(){
    return(
      <LinearGradient colors={[APP_COLOR, APP_GRADIENT_COLOR2, APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5]} style={{flex:1}}>

      <Image resizeMode="stretch" source={APP_LOGO} style={STYLES.logo}/>

      <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/12.5,color:YELLOW_COLOR,marginHorizontal:SCREEN_HEIGHT/50}]}>{this.props.emailSentMsg} {this.props.email}</Text>
      <Text style={[STYLES.text,{marginHorizontal:SCREEN_HEIGHT/50,color:'white',fontSize:13,marginTop:5}]}>{i18.checkEmail}</Text>

      <View style={{flexDirection:'row',alignSelf:'center'}}>
        <Text style={STYLES.rowTxt}>{i18.notReceiveEmail}</Text>
        <TouchableOpacity activeOpacity={1} onPress={() => this.getVerificationLink()}>
          <Text style={[STYLES.rowTxt,{marginLeft:SCREEN_HEIGHT/100,color:YELLOW_COLOR}]}>{i18.clickHere}</Text>
        </TouchableOpacity>
      </View>

      <View style={[STYLES.absoluteButton,{bottom:SCREEN_HEIGHT/10,height:44,justifyContent:'center'}]}>
          <TouchableOpacityBtn onPress={() => this.login()} style={[STYLES.buttonTxt,{color:'white'}]} title={i18.login}/>
      </View>

      </LinearGradient>
    )
  }
}
