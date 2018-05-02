import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Config from '../components/Config';
import {Actions} from 'react-native-router-flux';
import Meteor, {createContainer} from 'react-native-meteor';
import {Cell, CustomCell, Section, TableView} from 'react-native-tableview-simple';
import NavigationBar from 'react-native-navbar';
import {Icon, Avatar} from 'react-native-material-design';
// import ImagePicker from 'react-native-image-picker';

class Settings extends Component{

  constructor(){
    super();
    this.state = {
      pressCount: 0,
    }
  }

  handleSignOut() {
    Meteor.logout(()=>{
      //redirect to login page
      Actions.Login();
    });
  }

  renderNavbar(){
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

  handleUpload(){
    const {userId} = this.props;
    const base64Prefix = 'data:image' + '/' + 'jpeg' + ';base64,';
    const options = {
      title: '',
      quality: 0.7,
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        var base64Data = base64Prefix + response.data;

        Meteor.call('Storage.upload', base64Data, response.fileName, (err, file)=>{
          if(!err){
            Meteor.collection('users').update(userId, {
              $set: {
                'profile.picture': file.url
              }
            });
          }
        });

      }
    });
  }

  resetDatabase(){
    if(this.props.user.profile.group == "admin"){
      this.setState({pressCount: this.state.pressCount + 1});
      if(this.state.pressCount == 3){
        Meteor.call('resetDatabase', (err, res)=>{
          if(err){
            alert(JSON.stringify(err));
          }else{
            alert('database successfully reset');
            this.setState({pressCount: 0});
          }
        });
      }
    }else{
      alert('only admin can do this!');
    }
  }

  render(){
    const {user} = this.props;

    let avatar = require('../images/default-pp.png');
    if(user && user.profile.picture){
        avatar = {uri: user.profile.picture};
    }

    return (
      <View style={styles.container}>
        {this.renderNavbar()}

        <Section>
          <CustomCell contentContainerStyle={{height: 80}}>
              <View style={{flex:1}}>
                <Avatar image={<Image source={avatar}/>}/>
              </View>
              <View style={{flex: 3, justifyContent: 'flex-start', marginLeft: 0}}>
                <Text>{user?user.username:""}</Text>
                <Text style={styles.textBlue}>online</Text>
                <Text style={[styles.textRed, styles.textSmall]}>Tar Report {Config.version}</Text>
              </View>
          </CustomCell>
          {/*<Cell cellStyle="Basic" title="Change Profile Picture" accessory="DisclosureIndicator" onPress={() => this.handleUpload()} titleTextColor="#007AFF" />*/}
        </Section>

        <Section>
          {/* <Cell cellStyle="Basic" title="Profile" accessory="DisclosureIndicator" onPress={() => Actions.Profile()} titleTextColor="#007AFF" /> */}
          {/* <Cell cellStyle="Basic" title="Change Password" accessory="DisclosureIndicator" onPress={() => Actions.ChangePassword()} titleTextColor="#007AFF" /> */}
          {<Cell cellStyle="Basic" title="Add Income" accessory="DisclosureIndicator" onPress={() => Actions.Income()} titleTextColor="#007AFF" />}
          {<Cell cellStyle="Basic" title="Add Spending" accessory="DisclosureIndicator" onPress={() => Actions.Spending()} titleTextColor="#007AFF" />}
          {<Cell cellStyle="Basic" title="Master - Account" accessory="DisclosureIndicator" onPress={() => Actions.Account()} titleTextColor="#007AFF" />}
          {<Cell cellStyle="Basic" title="Reset Database" accessory="DisclosureIndicator" onPress={() => this.resetDatabase()} titleTextColor="#fbdb62" />}
          <Cell cellStyle="Basic" title="Sign Out" accessory="DisclosureIndicator" onPress={() => this.handleSignOut()} titleTextColor="red" />
        </Section>

      </View>
    )
  }

}

export default createContainer(params=>{
  return {
    user: Meteor.user(),
    userId: Meteor.userId()
  };
}, Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    // backgroundColor: '#d13843',
  },
  textBlue: {
    color: '#178b8b'
  },
  textRed: {
    color: '#dd1144'
  },
  textSmall: {
    fontSize: 9
  }
});
