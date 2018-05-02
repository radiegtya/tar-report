import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Meteor, {connectMeteor, MeteorListView} from 'react-native-meteor';
import NavigationBar from 'react-native-navbar';
import {SearchBar, ListItem} from 'react-native-elements';
import {Icon, Divider} from 'react-native-material-design';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import {Actions} from 'react-native-router-flux';
import Swipeout from 'react-native-swipe-out';
import _Account from './_Account';
import Formatter from '../components/Formatter';
import moment from 'moment';
import Config from '../components/Config';


@connectMeteor
export default class LedgerFound extends Component {

  constructor(){
    super();
    this.increment = 10;

    this.state = {
      search: "",
      limit: this.increment,
      canLoadMore: true,
    };
  }

  getMeteorData(){
    const handle = Meteor.subscribe('ledger', this.selector(), this.options());

    return {
      userId: Meteor.userId(),
      // ready: handle.ready()
    }
  }

  selector(){
    const {accountId} = this.props;
    return {accountId: accountId};
  }

  options(){
    return {limit: this.state.limit, sort: {createdAt: -1}};
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

    return (
      <NavigationBar
        title={title}
        leftButton={leftButton}
        style={styles.navBar}
      />
    )
  }

  handleLoadMoreAsync(){
    const {ready} = this.data;

    this.setState({
      limit: this.state.limit + this.increment,
      canLoadMore: false
    });

    setTimeout(()=>{
      this.setState({
        canLoadMore: true
      });
    }, 2000);
  }

  renderRow(rowData, i){
    return (
      <View>
        <View style={styles.ledgerDateContainer}>
          <Text>{moment(rowData.createdAt).format("DD/MM/YY")}</Text>
        </View>
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
        <Divider/>
      </View>
    );
  }

  render(){
    const {balance} = this.props;

    return (
      <View style={styles.container}>
        {this.renderNavbar()}

        <View style={styles.body}>
          <MeteorListView
            renderScrollComponent={props => <InfiniteScrollView {...props} />}
            canLoadMore={this.state.canLoadMore}
            onLoadMoreAsync={this.handleLoadMoreAsync.bind(this)}
            collection="ledger"
            selector={this.selector()}
            options={this.options()}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={{fontWeight: 'bold'}}>Saldo: </Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={{fontWeight: 'bold'}}>Rp. {Formatter.currency(balance)}</Text>
          </View>
        </View>

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
    marginTop: 8,
    marginRight: 8,
  },
  body: {
    flex: 10
  },
  footer: {
    flex: .5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#f6f6f6'
  },
  footerLeft: {
    flex: 1,
    alignItems: 'flex-start'
  },
  footerRight: {
    flex: 5,
    alignItems: 'flex-end'
  },
  ledgerDateContainer: {
    justifyContent: 'center',
    padding: 5
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
