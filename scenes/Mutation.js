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
import moment from 'moment';
import MutationLedger from './MutationLedger';
import Formatter from '../components/Formatter';
import Config from '../components/Config';


@connectMeteor
export default class Mutation extends Component {

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
    const handle = Meteor.subscribe('journal', this.selector(), this.options());
    Meteor.subscribe('account', "kas");

    return {
      userId: Meteor.userId(),
      user: Meteor.user(),
      account: Meteor.collection('account').findOne("kas")
      // ready: handle.ready()
    }
  }

  selector(){
    const search = this.state.search;
    return {
      'description': {$regex: search, $options: "i"},
    };
  }

  options(){
    return {limit: this.state.limit, sort: {createdAt: -1}};
  }

  renderNavbar(){
    const {user} = this.data;

    const title = {
      title: this.props.title,
    };

    return (
      <NavigationBar
        title={title}
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
      <View style={styles.card}>

        <View style={styles.journalContainer}>
          <View style={styles.journalLeft}>
            <Text style={styles.journalLeftText}>{moment(rowData.createdAt).format("DD/MM/YY")}</Text>
          </View>
          <View style={styles.journalRight}>
            <Text style={styles.journalRightText}>{rowData.description}</Text>
          </View>
        </View>

        <MutationLedger journalId={rowData._id}/>

        <Divider/>
      </View>
    );
  }

  render(){
    const {account} = this.data;
    const balance = account? account.balance: 0;

    return (
      <View style={styles.container}>
        {this.renderNavbar()}

        <View style={styles.body}>
          <SearchBar
            round
            lightTheme
            containerStyle={{backgroundColor: "#FFFF"}}
            inputStyle={{backgroundColor: "#f2f2f2"}}
            onChangeText={(text)=> this.setState({search: text})}
            placeholder='Search for mutations'
            underlineColorAndroid='transparent'
          />

          <MeteorListView
            renderScrollComponent={props => <InfiniteScrollView {...props} />}
            canLoadMore={this.state.canLoadMore}
            onLoadMoreAsync={this.handleLoadMoreAsync.bind(this)}
            collection="journal"
            selector={this.selector()}
            options={this.options()}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={{fontWeight: 'bold'}}>Saldo Kas: </Text>
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
  card: {
    flex: 1,
    padding: 10
  },
  journalContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  journalLeft: {
    flex: .75,
    justifyContent:"center",
  },
  journalLeftText: {
    fontSize: 12
  },
  journalRight: {
    flex: 3,
    justifyContent:"center",
  },
  journalRightText: {
    fontWeight: 'bold'
  },
  body: {
    flex: 10
  },
  footer: {
    flex: .5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#f6f6f6',
    marginBottom: 50
  },
  footerLeft: {
    flex: 2,
    alignItems: 'flex-start'
  },
  footerRight: {
    flex: 5,
    alignItems: 'flex-end'
  },
  navBar: {
    // backgroundColor: "#48b9fa"
  },
  icon: {
    justifyContent:"center",
    marginTop: 8,
    marginRight: 8,
  },
});
