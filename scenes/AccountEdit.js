import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {Icon} from 'react-native-material-design';
import {Actions} from 'react-native-router-flux';
import { FormLabel, FormInput } from 'react-native-elements';
import Meteor, {connectMeteor} from 'react-native-meteor';

@connectMeteor
export default class AccountEdit extends Component {

  constructor(){
    super();
    this.state = {
      txtCode: "",
      txtName: ""
    };
  }

  getMeteorData(){
    const handle = Meteor.subscribe('account', this.selector());

    return {
      ready: handle.ready(),
      account: Meteor.collection('account').findOne(this.selector())
    }
  }

  componentDidMount(){
    const {code, name} = this.data.account;

    this.setState({
      txtCode: code,
      txtName: name
    })
  }

  selector(){
    const {_id} = this.props;
    return _id;
  }

  renderNavbar(){
    const title = {
      title: this.props.title,
    };

    const leftButton = (
      <TouchableOpacity onPress={()=>Actions.pop()}>
        <Icon
          name="keyboard-arrow-left"
          style={styles.icon}
          color={'#057ce4'}
        />
      </TouchableOpacity>
    );

    let rightButton = (
      <TouchableOpacity>
        <Text style={{color: "#afafa4", marginTop: 12, marginRight: 7}}>Save</Text>
      </TouchableOpacity>
    );
    if(this.state.txtCode != "" && this.state.txtName != ""){
      rightButton = (
        <TouchableOpacity onPress={()=>this.handleSave()}>
          <Text style={{color: "#057ce4", marginTop: 12, marginRight: 7}}>Save</Text>
        </TouchableOpacity>
      );
    }

    return (
      <NavigationBar
        title={title}
        leftButton={leftButton}
        rightButton={rightButton}
        style={styles.navBar}
      />
    )
  }

  handleSave(){
    const {txtCode, txtName} = this.state;

    Meteor.collection('account').update(this.selector(), {
      $set: {
        code: txtCode,
        name: txtName
      }
    }, ()=>{
      this.setState({
        txtCode: "",
        txtName: ""
      });

      Actions.pop();
    });
  }

  render(){
    return (
      <View style={styles.container}>
        {this.renderNavbar()}

        <FormLabel>Code</FormLabel>
        <FormInput
          value={this.state.txtCode}
          onChangeText={(text)=>this.setState({txtCode: text})}/>

        <FormLabel>Name</FormLabel>
        <FormInput
          value={this.state.txtName}
          onChangeText={(text)=>this.setState({txtName: text})}/>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    // backgroundColor: "#48b9fa"
  },
  icon: {
    justifyContent:"center",
    marginTop: 7
  },
});
