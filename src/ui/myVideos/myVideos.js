import React,{Component} from 'react'
import {View,Text,TextInput,AsyncStorage,TouchableOpacity,ScrollView,Image,Alert,Platform,FlatList} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import LocalizedStrings from 'react-native-localization';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import VideoPlayer from 'react-native-video-player';

import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../../constants/common';
import {CANCEL,NO_VIDEO} from '../../constants/image';

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
import {uploadSellerVideo} from '../../api/user/videoUpload'
import {userProfile} from '../../api/user/userProfile'

/* FUNCTIONS */
import {pickVideo} from '../../utils/camera'

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
       this.userProfile()
     })
     }

     userProfile(){
       userProfile(sellerId,apiKey,i18.getLanguage()).then((response) => {
         if(response.id){
           this.setState({
             loading:false,
             videos:response.profileVideo,
             isResultFound:true
           },() => {
             if(response.profileVideo){
               this.setState({
                 isResultFound:true
               })
             }
             else{
               this.setState({
                 isResultFound:false
               })
             }
           })
         }
         else{
           this.setState({
           loading:false,
           isResultFound:false
          })
         }
       })
     }

     pickVideo(){
       pickVideo().then((video) => {
           this.setState({
             videos: video.path,
             isResultFound:null
           },() => {
              this.uploadSellerVideo(video.path,video.mime)
           })

       })
     }

     uploadSellerVideo(video,mime){
       this.setState({
         loading:true
       })
         const ext=mime.split('/')[1]
         uploadSellerVideo(mime,video.split('file://')[1],ext,sellerId,i18.getLanguage()).then((response) => {
           if(response.id){
             this.userProfile()
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

    renderVideo(video) {
       return (
       <View>
         <View style={{width:SCREEN_WIDTH,height:180,backgroundColor:'black',alignSelf:'center',marginTop:0,backgroundColor:'black'}}>
           <VideoPlayer style={{width:SCREEN_WIDTH,height:180,marginLeft:0,marginTop:0}} disableSeek video={{ uri:encodeURI(video)}} pauseOnPress/>
         </View>
       </View>
        );
      }

  render(){
    return(
      <View style={{flex:1,backgroundColor:'white'}}>

      <View style={STYLES.childRoot}>
        <Spinner visible={this.state.loading} textStyle={{color: '#FFF',marginTop:-60}} />
        <Image source={NO_VIDEO} style={[STYLES.product,{display:this.state.isResultFound == false?"flex":"none"}]}/>
        <Text style={[STYLES.text,{marginTop:SCREEN_HEIGHT/25,color:'gray',display:this.state.isResultFound == false?"flex":"none"}]}>{i18.noVideosUploaded}</Text>
        <View style={{display:this.state.videos?"flex":"none"}}>
          {this.renderVideo(this.state.videos)}
        </View>
      </View>
      <View style={[STYLES.button]}>
        <TouchableOpacityBtn onPress={() => this.pickVideo()} style={STYLES.buttonTxt} title={i18.addVideo}/>
      </View>
      </View>
    )
  }
}
