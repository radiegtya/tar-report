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
import JournalLedger from './JournalLedger';
import Config from '../components/Config';


@connectMeteor
export default class Journal extends Component {

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

    return {
      userId: Meteor.userId(),
      user: Meteor.user()
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

    let rightButton = <View></View>;
    if(user && user.profile.group == "admin"){
      rightButton = (
        <TouchableOpacity onPress={()=>Actions.JournalAdd()}>
          <Icon
            name="create"
            style={styles.icon}
            size={25}
            color="#057ce4"
          />
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

        <JournalLedger journalId={rowData._id}/>

        <Divider/>
      </View>
    );
  }

  render(){
    return (
      <View style={styles.container}>
        {this.renderNavbar()}

        <SearchBar
          round
          lightTheme
          containerStyle={{backgroundColor: "#FFFF"}}
          inputStyle={{backgroundColor: "#f2f2f2"}}
          onChangeText={(text)=> this.setState({search: text})}
          placeholder='Search for journals'
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
  navBar: {
    // backgroundColor: "#48b9fa"
  },
  icon: {
    justifyContent:"center",
    marginTop: 8,
    marginRight: 8,
  },
});
