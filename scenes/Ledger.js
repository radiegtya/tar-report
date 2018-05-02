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
export default class Ledger extends Component {

  constructor(){
    super();
    this.increment = 5;
    this.state = {
      txtAccount: "",
      txtAccountId: "",
      txtAccountBalance: 0,
      showListView: false,
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

    let rightButton = (
      <TouchableOpacity>
        <Text style={{color: "#afafa4", marginTop: 12, marginRight: 7}}>Search</Text>
      </TouchableOpacity>
    );
    if(this.state.txtAccountId != "" && this.state.txtAccount != ""){
      rightButton = (
        <TouchableOpacity onPress={()=>this.handleSearch()}>
          <Text style={{color: "#057ce4", marginTop: 12, marginRight: 7}}>Search</Text>
        </TouchableOpacity>
      );
    }

    return (
      <NavigationBar
        title={title}
        rightButton={rightButton}
        style={styles.navBar}
      />
    )
  }

  handleSearch(){
    const {txtAccountId, txtAccountBalance} = this.state;
    Actions.LedgerFound({accountId: txtAccountId, balance: txtAccountBalance});
  }

  renderRow(rowData, i){
    return (
      <TouchableOpacity
        onPress={()=> this.setState({
          txtAccount: rowData.code + " - " + rowData.name,
          txtAccountId: rowData._id,
          txtAccountBalance: rowData.balance,
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
          <FormLabel>Choose Account</FormLabel>
          <FormInput ref='txtAccount' value={this.state.txtAccount} onChangeText={(text)=>{
            this.setState({
              txtAccount: text,
              showListView: true
            })
          }}/>
          {meteorListView}

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
