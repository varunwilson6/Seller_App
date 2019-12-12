import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform,FlatList} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {CANCEL,NO_CERTIFICATE} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

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

export default class ViewCertificate extends Component{

  componentWillMount(){
    AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
    })
  }

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
          <View style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,margin:0}}>
            <Pdf source={{uri:encodeURI(this.props.pdf),cache:true}} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,margin:0}}/>
          </View>
      </View>
    )
  }
}
