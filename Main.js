import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import {Actions, Scene, Router, Switch, Modal} from 'react-native-router-flux';
import Login from './scenes/Login';
import Account from './scenes/Account';
import AccountAdd from './scenes/AccountAdd';
import AccountEdit from './scenes/AccountEdit';
import Mutation from './scenes/Mutation';
import Journal from './scenes/Journal';
import JournalAdd from './scenes/JournalAdd';
import LedgerAdd from './scenes/LedgerAdd';
import Ledger from './scenes/Ledger';
import LedgerFound from './scenes/LedgerFound';
import Profile from './scenes/Profile';
import ChangePassword from './scenes/ChangePassword';
import Settings from './scenes/Settings';
import Income from './scenes/Income';
import Spending from './scenes/Spending';
import TransactionAdd from './scenes/TransactionAdd';
import Meteor, {createContainer} from 'react-native-meteor';
import {Icon, Tabs, Tab} from 'react-native-elements';
import Config from './components/Config';

Meteor.connect(Config.ddpUrl);

class TabIcon extends Component {
    render(){
      const title = this.props.title;
      let icon = "";

      if(title == "Choose Income"){
        icon = "input";
      }else if(title == "Choose Spending"){
        icon = "output";
      }else if(title == "Balance Mutation"){
        icon = "account-balance";
      }else if(title == "Journals"){
        icon = "library-books";
      }else if(title == "Accounts"){
        icon = "note";
      }else if(title == "Ledgers"){
        icon = "book";
      }else if(title == "Settings"){
        icon = "settings";
      }

      return (
          <Icon name={icon} color={this.props.selected ? '#057ce4' :'#afafa4'}/>
      );
    }
}

class Main extends Component {

  constructor() {
    super()
  }

  componentWillMount() {
    this.scenes = Actions.create(
      <Scene key="root" component={createContainer(this.composer, Switch)} selector={this.selector} tabs={true}>
        <Scene key="unauthorized" hideNavBar={true}>
          <Scene key="Login" component={Login} title="Main" hideNavBar={true}/>
        </Scene>
        <Scene key="authorized" hideNavBar={true} >
          <Scene key="tabbar" tabs={true} tabBarStyle={{backgroundColor:'#f7f7f7'}}>
            <Scene key="Mutation" component={Mutation} title="Balance Mutation" icon={TabIcon} hideNavBar={true}/>
            <Scene key="Journal" component={Journal} title="Journals" icon={TabIcon} hideNavBar={true}/>
            <Scene key="Ledger" component={Ledger} title="Ledgers" icon={TabIcon} hideNavBar={true}/>
            <Scene key="Settings" component={Settings} title="Settings" icon={TabIcon} hideNavBar={true}/>
          </Scene>
          <Scene key="Income" component={Income} title="Choose Income" hideNavBar={true}/>
          <Scene key="Spending" component={Spending} title="Choose Spending" hideNavBar={true}/>
          <Scene key="TransactionAdd" component={TransactionAdd} title="Add Transaction" hideNavBar={true}/>
          <Scene key="Account" component={Account} title="Accounts" hideNavBar={true}/>
          <Scene key="JournalAdd" component={JournalAdd} title="Add Journal" hideNavBar={true}/>
          <Scene key="LedgerAdd" component={LedgerAdd} title="Journal Account" hideNavBar={true}/>
          <Scene key="AccountAdd" component={AccountAdd} title="Add Account" hideNavBar={true}/>
          <Scene key="AccountEdit" component={AccountEdit} title="Edit Account" hideNavBar={true}/>
          <Scene key="LedgerFound" component={LedgerFound} title="Ledger Result" hideNavBar={true}/>
          <Scene key="ChangePassword" component={ChangePassword} title="Change Password" hideNavBar={true}/>
          <Scene key="Profile" component={Profile} title="Profile" hideNavBar={true}/>
        </Scene>
      </Scene>

    );

  }

  composer() {
    return {
      connected: Meteor.status().connected,
      user: Meteor.user()
    }
  }

  selector(data, props) {
    if (!data.user) {
      return "unauthorized";
    } else {
      return "authorized";
    }
  }

  render() {
    return <Router scenes={this.scenes}/>
  }
}

module.exports = Main;
