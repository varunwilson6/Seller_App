import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import { Dropdown } from 'react-native-material-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import { TextField } from 'react-native-material-textfield';

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

import {BUTTON_COLOR,FORM_BACKGROUND} from '../../constants/colors';

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

/*STYLES */
import {STYLES} from './styles';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/* API */
import {USER} from '../../api/sharedPreferencesKeys'
import {userProfile} from '../../api/user/userProfile'

export default class ContactUs extends Component{

 componentWillMount(){
    this.setState({
      visible:false
    })
    this.getCurrLang()
  }

    getCurrLang(){
      AsyncStorage.getItem("currLang").then((value) => {

      i18.setLanguage(value)
      this.setState({
        visible:false
      })
    })
    }
  componentWillReceiveProps(nextProps){
    this.getCurrLang()
  }

  sendMessage(){
    
  }
  render(){
  	let department = [{
      value: i18.account,
    }, {
      value: i18.payment,
    }, {
      value: i18.sales,
    },{
    	 value: i18.support,
    },{
    	 value: i18.others
    }];
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
      	<View style={{marginHorizontal:SCREEN_HEIGHT/50}}>
      		<Dropdown fontSize={14} label={i18.chooseDepartment} data={department}/>
      	</View>
        <View style={STYLES.textfield}>
           <TextField tintColor='gray' fontSize={14} titleFontSize={12} activeLineWidth={0.5} label={i18.title}/>
         </View>
        <TextInput underlineColorAndroid='rgba(0,0,0,0)' textAlignVertical='top' placeholder={i18.message} style={STYLES.description}  multiline = {true} numberOfLines = {4}/>

         <View style={[STYLES.button]}>
            <TouchableOpacityBtn onPress={() => this.sendMessage()} style={STYLES.buttonTxt} title={i18.send}/>
        </View>

      </View>
    )
  }
}
