import React,{Component} from 'react';
import{View,Text,StyleSheet,TouchableOpacity} from 'react-native';

/* COLOR CONSTANTS */
import {PURPLE} from '../constants/colors';

/* STYLES */
import {STYLES} from './styles';

export default class TouchableOpacityBtn extends Component{
  render(){
    return(
      <TouchableOpacity onPress={this.props.onPress} activeOpacity={1}>
        <Text style={this.props.style}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }
}
