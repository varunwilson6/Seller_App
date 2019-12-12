import React,{Component} from 'react'
import {View} from 'react-native'

/*  THIRD PARTY LIBRARIES */
import Pdf from 'react-native-pdf';

/*STYLES */
import {STYLES} from './styles';

export default class TermsAndConditions extends Component{
  render(){

    return(
      <View style={STYLES.container}>
        <Pdf source={require("./TC.pdf")} style={STYLES.pdf}/>
      </View>
    )
  }
}
