import React,{Component} from 'react';
import {View,Text,Image,TouchableOpacity,ScrollView,AsyncStorage} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import {Actions} from 'react-native-router-flux';
import ImageLoad from 'react-native-image-placeholder';
import Icon from 'react-native-vector-icons/FontAwesome';
import LocalizedStrings from 'react-native-localization';

/*CONSTANTS */
import {APP_COLOR,LIGHT_GRAY_TAB,BUTTON_COLOR} from '../../constants/colors';
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {RIGHT_ARROW} from '../../constants/image';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/*STYLES */
import {STYLES} from './styles';  

/* API */
import {USER} from '../../api/sharedPreferencesKeys'

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'



let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en,fr,de,it,es});
export default class SupportedLanguages extends Component{

  componentWillMount(){
    this.setState({
      visible:false,
      engColor:BUTTON_COLOR,
      frenchColor:'black',
      germanColor:'black',
      italianColor:'black',
      spanishColor:'black',
      dutchColor:'black',
      polishColor:'black',
      turkishColor:'black',

    })
    AsyncStorage.getItem("currLang").then((value) => {
      if(value == "en"){
        this.setState({
          engColor:BUTTON_COLOR,
          frenchColor:'black',
          germanColor:'black',
          italianColor:'black',
          spanishColor:'black'
        })
      }
      if(value == "fr"){
        this.setState({
          frenchColor:BUTTON_COLOR,
          engColor:'black',
          germanColor:'black',
          italianColor:'black',
          spanishColor:'black'
        })
      }
      if (value == "de") {
        this.setState({
          germanColor:BUTTON_COLOR,
          engColor:'black',
          frenchColor:'black',
          italianColor:'black',
          spanishColor:'black'
        })
      }
      if (value == "it") {
        this.setState({
          italianColor:BUTTON_COLOR,
          engColor:'black',
          germanColor:'black',
          germanColor:'black',
          spanishColor:'black'
        })
      }
      if (value == "es") {
        this.setState({
          spanishColor:BUTTON_COLOR,
          engColor:'black',
          germanColor:'black',
          italianColor:'black',
          italianColor:'black'
        })
      }
      if (value == "nl") {
        this.setState({
          dutchColor:BUTTON_COLOR,
          engColor:'black',
          germanColor:'black',
          italianColor:'black',
          italianColor:'black'
        })
      }
      if (value == "pl") {
        this.setState({
          polishColor:BUTTON_COLOR,
          engColor:'black',
          germanColor:'black',
          italianColor:'black',
          italianColor:'black'
        })
      }
      if (value == "tr") {
        this.setState({
          turkishColor:BUTTON_COLOR,
          engColor:'black',
          germanColor:'black',
          italianColor:'black',
          italianColor:'black'
        })
      }
    })
  }

  selectLanguage(value){
    
    console.log("Language Input >>", value)

    switch (value) {
      case "eng":
        i18.setLanguage("en")
        AsyncStorage.setItem("currLang","en")
        Actions.BottomTab()
        break;
      case "french":
        i18.setLanguage("fr")
        AsyncStorage.setItem("currLang","fr")
        Actions.BottomTab()
        break;
      case "german":
        i18.setLanguage("de")
        AsyncStorage.setItem("currLang","de")
        Actions.BottomTab()
        break;
      case "italian":
        i18.setLanguage("it")
        AsyncStorage.setItem("currLang","it")
        Actions.BottomTab()
        break;
      case "polish":
        i18.setLanguage("pl")
        AsyncStorage.setItem("currLang","pl")
        Actions.BottomTab()
        break;
      case "turkish":
        i18.setLanguage("tr")
        AsyncStorage.setItem("currLang","tr")
        Actions.BottomTab()
        break;
      case "dutch":
          i18.setLanguage("nl")
          AsyncStorage.setItem("currLang","nl")
          Actions.BottomTab()
          break;
      default:
        i18.setLanguage("es")
        AsyncStorage.setItem("currLang","es")
        Actions.BottomTab()
    }
  }
  render(){
    return(
      <View style={{flex:1,backgroundColor:LIGHT_GRAY_TAB}}>
        <ScrollView>

        <View style={[STYLES.settingsContainer,{height:SCREEN_HEIGHT/8.3}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.selectLanguage("eng")}>
            <Text style={[STYLES.text,{fontSize:16,color:this.state.engColor}]}>English</Text>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/100}]}>English</Text>
          </TouchableOpacity>
        </View>
        <View style={STYLES.horzLine}/>

        <View style={[STYLES.settingsContainer,{height:SCREEN_HEIGHT/8.3}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.selectLanguage("french")}>
            <Text style={[STYLES.text,{fontSize:16,color:this.state.frenchColor}]}>Français</Text>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/100}]}>French</Text>
          </TouchableOpacity>
        </View>
        <View style={STYLES.horzLine}/>

        <View style={[STYLES.settingsContainer,{height:SCREEN_HEIGHT/8.34}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.selectLanguage("german")}>
            <Text style={[STYLES.text,{fontSize:16,color:this.state.germanColor}]}>Deutsch</Text>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/100}]}>German</Text>
          </TouchableOpacity>
        </View>
        <View style={STYLES.horzLine}/>

        <View style={[STYLES.settingsContainer,{height:SCREEN_HEIGHT/8.3}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.selectLanguage("italian")}>
            <Text style={[STYLES.text,{fontSize:16,color:this.state.italianColor}]}>Italiano</Text>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/100}]}>Italian</Text>
          </TouchableOpacity>
        </View>
        <View style={STYLES.horzLine}/>

        <View style={[STYLES.settingsContainer,{height:SCREEN_HEIGHT/8.3}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.selectLanguage("spanish")}>
            <Text style={[STYLES.text,{fontSize:16,color:this.state.spanishColor}]}>Español</Text>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/100}]}>Spanish</Text>
          </TouchableOpacity>
        </View>
        <View style={STYLES.horzLine}/>

        <View style={[STYLES.settingsContainer,{height:SCREEN_HEIGHT/8.3}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.selectLanguage("turkish")}>
            <Text style={[STYLES.text,{fontSize:16,color:this.state.turkishColor}]}>Türk</Text>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/100}]}>Turkish</Text>
          </TouchableOpacity>
        </View>
        <View style={STYLES.horzLine}/>

        <View style={[STYLES.settingsContainer,{height:SCREEN_HEIGHT/8.3}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.selectLanguage("dutch")}>
            <Text style={[STYLES.text,{fontSize:16,color:this.state.dutchColor}]}>Nederlands</Text>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/100}]}>Dutch</Text>
          </TouchableOpacity>
        </View>
        <View style={STYLES.horzLine}/>

        <View style={[STYLES.settingsContainer,{height:SCREEN_HEIGHT/8.3}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => this.selectLanguage("polish")}>
            <Text style={[STYLES.text,{fontSize:16,color:this.state.polishColor}]}>Polskie</Text>
            <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/100}]}>Polish</Text>
          </TouchableOpacity>
        </View>
        <View style={STYLES.horzLine}/>

        </ScrollView>
      </View>
    )
  }
}
