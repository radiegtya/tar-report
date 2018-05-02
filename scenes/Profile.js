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
import Meteor, {connectMeteor} from 'react-native-meteor';
import NavigationBar from 'react-native-navbar';
import {Divider, Icon} from 'react-native-material-design';
import t from 'tcomb-form-native';
import AccordionPicker from '../components/AccordionPicker';

class Profile extends Component{

  constructor(){
    super();
  }

  getMeteorData(){
    return {
      user: Meteor.user()
    }
  }

  handleDone(){
    var value = this.refs.form.getValue();

    if(value){
      Meteor.collection('users').update(Meteor.userId(), {$set:{'profile.name': value.name}}, (err, _id)=>{
        if(err){
          console.log(err);
          alert(err.message);
        }else{
          Actions.pop();
        }
      });
    }
  }

  _renderNavbar(){
    const title = {
      title: this.props.title,
      tintColor: '#FFF'
    }
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
      name: t.String,
    });

    const factory = Platform.OS == "ios" ? AccordionPicker:"";
    var options = {
      fields: {
        name: {
          label: "Name",
        },
      }
    };

    const value = {
      name: user.profile.name
    }

    return (
      <View style={styles.formContainer}>
        <Form
            ref="form"
            type={Schema}
            options={options}
            value={value}
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
    flex: 1
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

connectMeteor(Profile);

module.exports = Profile;
