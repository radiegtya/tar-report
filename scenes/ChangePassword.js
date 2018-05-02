'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import Config, {ddpUrl} from '../components/Config';
import {Actions} from 'react-native-router-flux';
import Meteor, {connectMeteor, Accounts} from 'react-native-meteor';
import NavigationBar from 'react-native-navbar';
import {Divider, Icon} from 'react-native-material-design';
import t from 'tcomb-form-native';
import AccordionPicker from '../components/AccordionPicker';

class ChangePassword extends Component{

  constructor(){
    super();
    console.log('on change pass')
  }

  getMeteorData(){
    return {
      user: Meteor.user()
    }
  }

  handleDone(){
    var value = this.refs.form.getValue();

    if(value){
      if(value.newPassword != value.confirmNewPassword){
        const err = "New Password and Confirm New Password value must equal";
        alert(err);
      }else{
        Accounts.changePassword(value.oldPassword, value.newPassword, (err)=>{
          if(err){
            console.log(err);
            alert(err.message);
          }else{
            alert('your password has been successfully changed.');
            Actions.pop();
          }
        });
      }
    }
  }

  _renderNavbar(){
    const title = {
      title: this.props.title,
      tintColor: '#FFF'
    };
    const leftButton = (
      <TouchableOpacity onPress={Actions.pop}>
        <Icon
          name="keyboard-arrow-left"
          color="#FFF"
          style={styles.backIcon}
        />
      </TouchableOpacity>
    );
    const rightButton = {
      title: 'Done',
      tintColor: '#FFF',
      handler: () => {
        this.handleDone()
      },
    };

    return (
      <NavigationBar
        title={title}
        leftButton={leftButton}
        rightButton={rightButton}
        style={styles.navBar}
      />
    )
  }

  renderForm(){
    const {user} = this.data;

    var Form = t.form.Form;

    var Schema = t.struct({
      oldPassword: t.String,
      newPassword: t.String,
      confirmNewPassword: t.String,
    });

    const factory = Platform.OS == "ios" ? AccordionPicker:"";
    var options = {
      fields: {
        oldPassword: {
          label: "Old Password",
          password: true,
          secureTextEntry: true
        },
        newPassword: {
          label: "New Password",
          password: true,
          secureTextEntry: true
        },
        confirmNewPassword: {
          label: "Confirm New Password",
          password: true,
          secureTextEntry: true
        },
      }
    };

    return (
      <View style={styles.formContainer}>
        <Form
            ref="form"
            type={Schema}
            options={options}
        />
      </View>
    )

  }

  render(){
    return (
      <View style={styles.container}>
        {this._renderNavbar()}
        {this.renderForm()}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navBar: {
    backgroundColor: '#d13843',
  },
  navBarTitle: {
    color: 'white',
    textAlign: "center",
    fontWeight:'bold',
    fontSize: 18
  },
  backIcon: {
    justifyContent:"center",
    marginTop: 8,
    // color: "#057ce4"
  },
  formContainer: {
    flex: 1,
    padding: 10
  },
});

connectMeteor(ChangePassword);

module.exports = ChangePassword;
