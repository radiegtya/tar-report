import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Meteor, {connectMeteor, MeteorListView} from 'react-native-meteor';
import _Account from './_Account';
import Formatter from '../components/Formatter';
import Config from '../components/Config';


@connectMeteor
export default class MutationLedger extends Component {

  constructor(){
    super();
  }

  getMeteorData(){
    const handle = Meteor.subscribe('ledger', this.selector(), this.options());

    return {
    }
  }

  selector(){
    const {journalId} = this.props;
    return {journalId: journalId, accountId: {$ne: "kas"}};
  }

  options(){
    return {sort: {createdAt: 1}};
  }

  renderRow(rowData, i){
    return (
      <View style={styles.ledgerContainer}>
        <View style={styles.ledgerLeft}>
          <Text style={styles.ledgerLeftText}>{rowData.debit?"D":"K"}</Text>
        </View>
        <View style={styles.ledgerCenter}>
          <_Account _id={rowData.accountId}/>
        </View>
        <View style={styles.ledgerRight}>
          <Text style={styles.ledgerRightText}>Rp. {rowData.debit?Formatter.currency(rowData.debit):Formatter.currency(rowData.credit)}</Text>
        </View>
      </View>
    );
  }

  render(){
    return (
        <MeteorListView
          collection="ledger"
          selector={this.selector()}
          options={this.options()}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
        />
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
    marginTop: 8,
    marginRight: 8,
  },
  ledgerContainer: {
    flexDirection: 'row',
    justifyContent:"center",
    padding: 5,
    marginBottom: 10
  },
  ledgerLeft: {
    flex: .75,
    justifyContent:"center",
  },
  ledgerCenter: {
    flex: 2,
    justifyContent:"center",
  },
  ledgerRight: {
    flex: 1,
    justifyContent:"center",
  },
});
