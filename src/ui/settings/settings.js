import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,AsyncStorage} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import {Actions} from 'react-native-router-flux';
import ImageLoad from 'react-native-image-placeholder';
import Icon from 'react-native-vector-icons/FontAwesome';
import LocalizedStrings from 'react-native-localization';
import Spinner from 'react-native-loading-spinner-overlay';

/*CONSTANTS */
import {APP_COLOR,LIGHT_GRAY_TAB,BUTTON_COLOR} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {RIGHT_ARROW} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
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
import {USER} from '../../api/sharedPreferencesKeys'

export default class Settings extends Component{

  constructor(props){
    super(props);
    this.state={
      visible:false,
      language:'English'
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
    AsyncStorage.getItem("currLang").then((value) => {
      if(value == "en"){
        this.setState({
          language:'English'
        })
      }
      if(value == "fr"){
        this.setState({
          language:'French'
        })
      }
      if (value == "de") {
        this.setState({
          language:'German'
        })
      }
      if (value == "it") {
        this.setState({
          language:'Italian'
        })
      }
      if (value == "es") {
        this.setState({
          language:'Spanish'
        })
      }
      if (value == "pl") {
        this.setState({
          language:'Polish'
        })
      }
      if (value == "nl") {
        this.setState({
          language:'Dutch'
        })
      }
      if (value == "tr") {
        this.setState({
          language:'Turkish'
        })
      }
    })
  }

  openLanguages(){
    Actions.SupportedLanguages({
      title:i18.languageTitle
    })
  }

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>
        <Spinner visible={this.state.visible} textStyle={{color: '#FFF',marginTop:-60}} />

        <TouchableOpacity onPress={() => this.openLanguages()} activeOpacity={1}>
        <View style={STYLES.settingsContainer}>          
            <View style={{flexDirection:'row'}}>
              <Text style={STYLES.text}>{i18.language}</Text>
              <Text style={STYLES.lang}>{this.state.language}</Text>
              <Icon name="angle-right" style={STYLES.arrow} color="gray" size={20}/>
            </View>          
        </View>
        </TouchableOpacity>
        
        <View style={STYLES.horzLine}/>

        <View style={STYLES.settingsContainer}>
          <View style={{flexDirection:'row'}}>
            <Text style={STYLES.text}>{i18.notifications}</Text>
            <Icon name="angle-right" style={[STYLES.arrow,{flex:1}]} color="gray" size={20}/>
          </View>
        </View>
        <View style={STYLES.horzLine}/>
        
      </View>
    )
  }
}
