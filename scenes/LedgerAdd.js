import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {Icon} from 'react-native-material-design';
import {Actions} from 'react-native-router-flux';
import { FormLabel, FormInput, ButtonGroup, ListItem } from 'react-native-elements';
import Meteor, {connectMeteor, MeteorListView} from 'react-native-meteor';

@connectMeteor
export default class LedgerAdd extends Component {

  constructor(){
    super();
    this.increment = 3;
    this.state = {
      txtAccount: "",
      txtAccountId: "",
      txtAmount: 0,
      showListView: false,
      totalNext: 0,
      totalDebit: 0,
      totalCredit: 0,
      selectedIndex: 0,
      limit: this.increment,
    };
  }

  getMeteorData(){
    const handle = Meteor.subscribe('account', this.selector(), this.options());

    return {
      // ready: handle.ready()
    }
  }

  selector(){
    const search = this.state.txtAccount;
    return {
      $or: [
          {'code': {$regex: search, $options: "i"}},
          {'name': {$regex: search, $options: "i"}},
      ]
    };
  }

  options(){
    return {limit: this.state.limit, sort: {createdAt: -1}};
  }

  renderNavbar(){
    const title = {
      title: this.props.title,
    };

    let leftButton = (
      <TouchableOpacity>
        <Text style={{color: "#afafa4", marginTop: 12, marginLeft: 7}}>Done</Text>
      </TouchableOpacity>
    );
    if(this.state.totalDebit == this.state.totalCredit && this.state.totalDebit > 0 && this.state.totalCredit > 0){
      leftButton = (
        <TouchableOpacity onPress={()=>Actions.pop({popNum: this.state.totalNext})}>
          <Text style={{color: "#057ce4", marginTop: 12, marginLeft: 7}}>Done</Text>
        </TouchableOpacity>
      )
    }

    let rightButton = (
      <TouchableOpacity>
        <Text style={{color: "#afafa4", marginTop: 12, marginRight: 7}}>Add More</Text>
      </TouchableOpacity>
    );
    if(this.state.txtAmount != 0 && this.state.txtAccountId != ""){
      rightButton = (
        <TouchableOpacity onPress={()=>this.handleAdd()}>
          <Text style={{color: "#057ce4", marginTop: 12, marginRight: 7}}>Add</Text>
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
    const {journalId} = this.props;
    const {txtAccountId, txtAmount} = this.state;
    let debit = 0;
    let credit = 0;
    if(this.state.selectedIndex == 0)
      debit = Number(txtAmount);
    else
      credit = Number(txtAmount);

    Meteor.collection('ledger').insert({
      journalId: journalId,
      accountId: txtAccountId,
      debit: debit,
      credit: credit
    }, (err, res)=>{
      if(err){
        console.log(err);
      }else{
        //update account.balance
        Meteor.collection('account').update(txtAccountId, {
          $inc: {
            balance: debit > 0 ?debit: (credit * -1)
          }
        });

        //set state to first state
        this.setState({
          txtAccountId: "",
          txtAmount: 0,
          txtAccount: "",
          totalNext: this.state.totalNext + 1,
          totalDebit: this.state.totalDebit + debit,
          totalCredit: this.state.totalCredit + credit,
        });
      }
    });
  }

  renderRow(rowData, i){
    return (
      <TouchableOpacity
        onPress={()=> this.setState({
          txtAccount: rowData.code + " - " + rowData.name,
          txtAccountId: rowData._id,
          showListView: false
        })}>
          <ListItem
            key={i}
            title={rowData.code}
            subtitle={rowData.name}
          />
      </TouchableOpacity>
    );
  }

  render(){
    const buttons = ['Debit', 'Credit'];
    const { selectedIndex } = this.state;

    let meteorListView = null;
    if(this.state.showListView){
      meteorListView = (
        <MeteorListView
          collection="account"
          selector={this.selector()}
          options={this.options()}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
        />
      )
    }

    return (
      <View style={styles.container}>
        {this.renderNavbar()}

        <ScrollView>
          <FormLabel>Account</FormLabel>
          <FormInput ref='txtAccount' value={this.state.txtAccount} onChangeText={(text)=>{
            this.setState({
              txtAccount: text,
              showListView: true
            })
          }}/>
          {meteorListView}

          <ButtonGroup
            onPress={(selectedIndex)=> this.setState({selectedIndex})}
            selectedIndex={selectedIndex}
            buttons={buttons} />

          <FormLabel>Amount</FormLabel>
          <FormInput keyboardType={'numeric'} value={this.state.txtAmount} onChangeText={(text)=>this.setState({txtAmount: text})}/>
        </ScrollView>
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
