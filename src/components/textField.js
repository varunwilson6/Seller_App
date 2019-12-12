import React,{Component} from 'react';
import{View,Text,StyleSheet,TextInput} from 'react-native';

/*  THIRD PARTY LIBRARIES */
import Icon from 'react-native-vector-icons/FontAwesome';

/* DIMENSIONS CONSTANTS */
import {SCREEN_WIDTH,SCREEN_HEIGHT} from '../constants/common';

/* COLOR CONSTANTS */
import {PURPLE} from '../constants/colors';

/* STYLES */
import {STYLES} from './styles';

export default class TextField extends Component{
  render(){
    return(
      <TextInput editable={this.props.editable?this.props.editable:true} onSubmitEditing={this.props.onSubmitEditing} onChangeText={this.props.onChangeText} underlineColorAndroid='rgba(0,0,0,0)' placeholder={this.props.placeholder} placeholderStyle={{marginLeft:10}}
       style={[STYLES.textField,{backgroundColor:this.props.backgroundColor?this.props.backgroundColor:"white",borderRadius:this.props.borderRadius?this.props.borderRadius:1,marginTop:this.props.marginTop?this.props.marginTop:SCREEN_HEIGHT/50}]}
        keyboardType={this.props.keyboardType?this.props.keyboardType:"default"} autoCapitalize={this.props.autoCapitalize?this.props.autoCapitalize:"sentences"}
        secureTextEntry={this.props.secureTextEntry?this.props.secureTextEntry:false} maxLength={this.props.maxLength?this.props.maxLength:100000}/>
    )
  }
}
