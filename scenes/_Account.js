import React, {Component} from 'react';
import {
  Text
} from 'react-native';
import Meteor, {connectMeteor} from 'react-native-meteor';

@connectMeteor
export default class _Account extends Component{

  getMeteorData() {
    const { _id } = this.props;
    const handle = Meteor.subscribe('account', _id);

    return {
      ready: handle.ready(),
      account: Meteor.collection('account').findOne(_id)
    };
  }

  render() {
    const { ready, account } = this.data;
    const code = account? account.code: "";
    const name = account? account.name: "";

    if(ready){
      return (
        <Text>{code + " - " + name}</Text>
      )
    }else{
      return null;
    }
  }

}
