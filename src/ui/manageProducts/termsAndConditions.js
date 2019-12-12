import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform,FlatList} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import {Actions} from 'react-native-router-flux';

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';

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

var sellerId=""
var apiKey=""

export default class MyVideos extends Component{

  constructor(props){
    super(props);
    this.state={
      loading:true,
      videos:null,
      isResultFound:null
    }
  }
  componentWillMount(){
     this.setState({
       visible:false
     })
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

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
        <Text style={[STYLES.text,{marginTop:Platform.OS == "ios" && (SCREEN_WIDTH == 812 || SCREEN_HEIGHT == 812)?SCREEN_HEIGHT/2-88:SCREEN_HEIGHT/2-64,color:'gray',display:this.props.termsAndConditions?"none":"flex"}]}>{i18.noTermsFound}</Text>
        <ScrollView>
          <Text style={[STYLES.text,{textAlign:'left'}]}>{this.props.termsAndConditions}</Text>
        </ScrollView>
      </View>
    )
  }
}
