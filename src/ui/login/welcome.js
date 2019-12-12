import React,{Component} from 'react';
import {View,Image,Alert,AsyncStorage} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import LocalizedStrings from 'react-native-localization';

/* LOCALIZATION */
import {en} from '../../localization/eng'
import {fr} from '../../localization/france'
import {de} from '../../localization/germany'
import {it} from '../../localization/italy'
import {es} from '../../localization/spain'
import {pl} from '../../localization/polish'
import {nl} from '../../localization/nederlands'
import {tr} from '../../localization/turkish'

/*CONSTANTS */
import {APP_COLOR,APP_GRADIENT_COLOR2,APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5} from '../../constants/colors';
import {APP_LOGO,APP_BANNER} from '../../constants/image'
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';

/* BrownEagle COMPONENTS */
import RippleButton from '../../components/button';
import TouchableOpacityBtn from '../../components/touchableOpacity';

/*STYLES */
import {STYLES} from './styles';

/* API */
import {USER} from '../../api/sharedPreferencesKeys'

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

export default class Welcome extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:false
    }
  }
  login(){
    Actions.Login()
  }
  register(){
    Actions.Signup()
  }
  componentWillMount(){
    this.setState({
      loading:true
    })
    AsyncStorage.getItem("currLang").then((value) => {
      i18.setLanguage(value)
      this.setState({
        visible:false
      })
    })
    AsyncStorage.getItem(USER).then((value) => {
      this.setState({
        loading:false
      })
      if(value){
        Actions.BottomTab()
      }
    })
  }
  render(){
    return(

      <LinearGradient colors={[APP_COLOR, APP_GRADIENT_COLOR2, APP_GRADIENT_COLOR3,APP_GRADIENT_COLOR4,APP_GRADIENT_COLOR5]} style={{flex:1}}>
        <Image source={APP_BANNER} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,opacity:0.5}}/>
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />

        <Image source={APP_LOGO} resizeMode="stretch" style={STYLES.appLogo}/>
        <View style={[STYLES.absoluteButton,{height:44}]}>
            <TouchableOpacityBtn onPress={() => this.login()} style={[STYLES.buttonTxt,{color:'white'}]} title={i18.login}/>
        </View>

        <View style={[STYLES.absoluteButton,{bottom:50,height:44}]}>
            <TouchableOpacityBtn onPress={() => this.register()} style={[STYLES.buttonTxt,{color:'white'}]} title={i18.register}/>
        </View>
        
      </LinearGradient>
    )
  }
}
