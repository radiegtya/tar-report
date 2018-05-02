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
export default class JournalAdd extends Component {

  constructor(){
    super();
    this.state = {
      txtDescription: "",
    };
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
        <Text style={{color: "#afafa4", marginTop: 12, marginRight: 7}}>Next</Text>
      </TouchableOpacity>
    );
    if(this.state.txtDescription != ""){
      rightButton = (
        <TouchableOpacity onPress={()=>this.handleAdd()}>
          <Text style={{color: "#057ce4", marginTop: 12, marginRight: 7}}>Next</Text>
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

  handleAdd(){
    const {txtDescription} = this.state;

    Meteor.collection('journal').insert({
      description: txtDescription,
    }, (err, res)=>{
      this.setState({
        txtDescription: "",
      });

      Actions.LedgerAdd({journalId: res});
    });
  }

  render(){
    return (
      <View style={styles.container}>
        {this.renderNavbar()}

        <FormLabel>Description</FormLabel>
        <FormInput onChangeText={(text)=>this.setState({txtDescription: text})}/>
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
