import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {Icon} from 'react-native-material-design';
import {Actions} from 'react-native-router-flux';
import Meteor, {connectMeteor} from 'react-native-meteor';
import { FormLabel, FormInput } from 'react-native-elements';

export default class TransactionAdd extends Component {

  constructor(){
    super();
    this.state = {
      txtDescription: "",
      txtAmount: 0
    };
  }

  renderNavbar(){
    const title = {
      title: "+ " + this.props.name,
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
    if(this.state.txtDescription != "" && this.state.txtAmount != ""){
      rightButton = (
        <TouchableOpacity onPress={()=>this.handleAdd()}>
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

  handleAdd(){
    const {txtDescription, txtAmount} = this.state;
    const amount = Number(txtAmount);
    const accountId = this.props._id;
    const type = this.props.accountType;
    let firstAccount = "";
    let firstDebit = 0;
    let firstCredit = 0;
    let secondAccount = "";
    let secondDebit = 0;
    let secondCredit = 0;
    if(type == "income"){
      firstAccount = "kas";
      firstDebit = amount;
      firstCredit = 0;
      secondAccount = accountId;
      secondDebit = 0;
      secondCredit = amount;
    }else {
      firstAccount = accountId;
      firstDebit = amount;
      firstCredit = 0;
      secondAccount = "kas";
      secondDebit = 0;
      secondCredit = amount;
    }

    //create journal first
    Meteor.collection('journal').insert({
      description: txtDescription,
    }, (err, res)=>{
      this.setState({
        txtDescription: "",
        txtAmount: ""
      });

      //insert first ledger
      Meteor.collection('ledger').insert({
        journalId: res,
        accountId: firstAccount,
        debit: firstDebit,
        credit: firstCredit
      });

      //insert second ledger
      Meteor.collection('ledger').insert({
        journalId: res,
        accountId: secondAccount,
        debit: secondDebit,
        credit: secondCredit
      });

      //update second.account.balance
      Meteor.collection('account').update(secondAccount, {
        $inc: {
          balance: secondDebit > 0 ?secondDebit: (secondCredit * -1)
        }
      }, (err, res)=>{
        if(err){
          alert(err)
        }else {

        }
      });

      //update first.account.balance
      Meteor.collection('account').update(firstAccount, {
        $inc: {
          balance: firstDebit > 0 ?firstDebit: (firstCredit * -1)
        }
      }, (err, res)=>{
        if(err){
          alert(JSON.stringify(err))
          return false;
        }else{
          Actions.pop();
          Actions.pop();
          Actions.Mutation();
        }
      });

    });

  }

  render(){
    return (
      <View style={styles.container}>
        {this.renderNavbar()}

        <FormLabel>Description</FormLabel>
        <FormInput onChangeText={(text)=>this.setState({txtDescription: text})}/>
        <FormLabel>Amount</FormLabel>
        <FormInput keyboardType={'numeric'} value={this.state.txtAmount} onChangeText={(text)=>this.setState({txtAmount: text})}/>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navBar: {
    // backgroundColor: "#48b9fa"
  },
  icon: {
    justifyContent:"center",
    marginTop: 7
  },
});
