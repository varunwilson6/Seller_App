import React, {Component} from 'react'
import {StyleSheet,Text,View,FlatList,TouchableOpacity} from 'react-native'
import Modal from 'react-native-modalbox';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../constants/common';
import {BUTTON_COLOR} from '../constants/colors';

import TextField from './textField';
import LocalizedStrings from 'react-native-localization';

/* LOCALIZATION */
import {en} from '../localization/eng'
import {fr} from '../localization/france'
import {de} from '../localization/germany'
import {it} from '../localization/italy'
import {es} from '../localization/spain'
import {pl} from '../localization/polish'
import {nl} from '../localization/nederlands'
import {tr} from '../localization/turkish'

let i18 = new LocalizedStrings({en:en,fr: fr,de: de,it: it,es: es, pl: pl,nl: nl,tr: tr}); //({en:en,fr: fr,de: de,it: it,es: es});

export default class TermsAndConditionsModal extends Component{

  static defaultProps={
    title:'',
    isOpen:false,
    errorMsg:'',
    errorTitle:'',
  }
  render(){
    const {container,alertText,button,btnTxtStyle,vertLine,centerAlignText,horzLine,leftBtnTxtStyle} = styles;
    const {isOpen,commission,onPressTermsAndConditions,isDisplayTermsAndConditions,cancelAction,okAction} = this.props;
    return(
      <Modal swipeToClose={false} isOpen={isOpen} backdropPressToClose={false} style={container} position={"center"}>
          <Text style={alertText}>{i18.brownEagleWillCharge} {commission}% {i18.commissionForThisCategory}</Text>
          <TouchableOpacity onPress={onPressTermsAndConditions} activeOpacity={1}>
            <Text style={leftBtnTxtStyle}>* {i18.viewTermsConditions}</Text>
          </TouchableOpacity>
          <View style={horzLine}/>
          <View style={{flexDirection:'row'}}>
            <View style={{width:SCREEN_WIDTH/2-20}}>
            <TouchableOpacity style={button} onPress={cancelAction} activeOpacity={1}>
              <Text style={btnTxtStyle}>{i18.cancel}</Text>
            </TouchableOpacity>
            </View>
            <View style={vertLine}/>
            <View style={{width:SCREEN_WIDTH/2-20}}>
            <TouchableOpacity style={button} onPress={okAction} activeOpacity={1}>
              <Text style={btnTxtStyle}>{i18.ok}</Text>
            </TouchableOpacity>
            </View>
          </View>
      </Modal>
      )
  }

}


const styles=StyleSheet.create({
  container:{
      backgroundColor:'white',
      height:150,
      width:SCREEN_WIDTH-40,
      borderRadius:4
  },
  vertLine:{
    height:50,
    width:0.6,
    backgroundColor:'lightgray'
  },
  alertText:{
      textAlign:'center',
      marginHorizontal:10,
      marginTop:10,
      fontSize:14,
      color:'black',
      fontFamily:'DIN-Regular',
  },
  button:{
    justifyContent:'center',
    height:48,
    marginTop:0,
    backgroundColor:'white'
  },
  btnTxtStyle:{
    fontFamily:'DIN-Regular',
    fontSize:14,
    color:BUTTON_COLOR,
    alignSelf:'center',
    fontWeight:'bold'
  },
  leftBtnTxtStyle:{
    fontFamily:'DIN-Regular',
    fontSize:11,
    color:BUTTON_COLOR,
    marginLeft:10,
    marginTop:20,
    fontWeight:'bold'
  },
  centerAlignText:{
    marginTop:15,
    marginHorizontal:10,
    textAlign:"center",
    color:'gray',
  },
  horzLine:{
    marginTop:20,
    height:0.6,
    backgroundColor:'lightgray',
  }
})
