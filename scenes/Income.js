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
import {Icon} from 'react-native-material-design';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import {Actions} from 'react-native-router-flux';
import Swipeout from 'react-native-swipe-out';
// import {subscribeCached} from 'react-native-meteor-redux';
// import {MeteorStore} from '../components/MyRedux';
import Config from '../components/Config';


@connectMeteor
export default class Income extends Component {

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
    // const sub = subscribeCached(MeteorStore, 'account', this.selector(), this.options());
    const handle = Meteor.subscribe('account', this.selector(), this.options());

    return {
      userId: Meteor.userId(),
      user: Meteor.user()
      // ready: handle.ready()
    }
  }

  componentDidMount(){
    const {user} = this.data;

    if(user && user.profile.group != "admin"){
      alert('sorry only admin able to access this page');
      Actions.pop();
    }
  }

  selector(){
    const search = this.state.search;
    return {
      'name': {$regex: search, $options: "i"},
      'type': "income"
    };
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
      <ListItem
        key={i}
        title={rowData.code}
        subtitle={rowData.name}
        onPress={()=> Actions.TransactionAdd({_id: rowData._id, name: rowData.name, accountType: rowData.type})}
      />
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
          placeholder='Search for income'
          underlineColorAndroid='transparent'
        />

        <MeteorListView
          renderScrollComponent={props => <InfiniteScrollView {...props} />}
          canLoadMore={this.state.canLoadMore}
          onLoadMoreAsync={this.handleLoadMoreAsync.bind(this)}
          collection="account"
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
  navBar: {
    // backgroundColor: "#48b9fa"
  },
  icon: {
    justifyContent:"center",
    marginTop: 8,
    marginRight: 8,
  },
});
