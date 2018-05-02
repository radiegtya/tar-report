import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Button from 'react-native-button';
import Meteor, {connectMeteor} from 'react-native-meteor';
import NavigationBar from 'react-native-navbar';
import {Icon} from 'react-native-material-design';
import Config from '../components/Config';
var windowSize = Dimensions.get('window');

@connectMeteor
class Login extends Component{

  constructor(){
    super();
    this.readyCounter = 0;
    this.state = {
      username: "",
      password: "",
      isRenderSignInButton: false,
      visibleHeight: Dimensions.get('window').height,
    }
  }

  componentWillMount(){
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
  }

  keyboardWillShow (e) {
    let newSize = Dimensions.get('window').height - e.endCoordinates.height
    this.setState({visibleHeight: newSize})
  }

  keyboardWillHide (e) {
    this.setState({visibleHeight: Dimensions.get('window').height})
  }

  handleNext(){
    // const {ready, user} = this.data;
    var username = this.state.username;

    if(!username){
      var err = "Please input username/email!";
      alert(err);
    }else{
      const selector = {
        $or: [
          {'emails.address': {$regex: username, $options: 'i'}},
          {'username': {$regex: username, $options: 'i'}},
        ]
        // 'username': {$regex: username, $options: 'i'}
      };
      Meteor.call('Users.findOne', selector, (err, res)=>{
        if(res){
          this.setState({isRenderSignInButton: true});
        }else{
          var errText = "Sorry, We can't find this username/email";
          alert(errText);
        }
      });
    }

  }

  handleSignIn(){
    var username = this.state.username;
    var password = this.state.password;

    if(!password){
      var err = "Please input password!";
      alert(err);
    }else{
      Meteor.loginWithPassword(username, password, (err)=>{
        if(err)
          alert(err.reason);
        else{
          console.log('successfully loggedIn');
          this.setState({isRenderSignInButton: false});
          Actions.tabbar();
        }
      });
    }
  }

  _renderNavbar(){
    const title = {
      title: "",
      tintColor: '#FFF'
    };

    const leftButton = (
      <TouchableOpacity onPress={()=>this.setState({isRenderSignInButton: false, username: ""})}>
        <Icon
          name="chevron-left"
          style={styles.icon}
          color="#FFF"
        />
      </TouchableOpacity>
    );

    if(this.state.isRenderSignInButton){
      return (
        <NavigationBar
          title={title}
          leftButton={leftButton}
          style={styles.navBar}
        />
      );
    }
  }

  _renderInput(){
    let content = null;

    if(!this.state.isRenderSignInButton){
      content = (
        <View style={styles.inputContainer}>
            <View style={{flex: 1}}>
              <Icon name="face" style={{marginTop: 10}}/>
            </View>
            <View style={{flex: 5}}>
              <TextInput
                  style={[styles.input, styles.darkFont]}
                  placeholder="Email/Username"
                  placeholderTextColor="#303030"
                  value={this.state.username}
                  onChangeText={(text) => this.setState({username: text})}
              />
            </View>
        </View>
      );
    }else{
      content = (
        <View style={styles.inputContainer}>
            <View style={{flex: 1}}>
              <Icon name="vpn-key" style={{marginTop: 10}}/>
            </View>
            <View style={{flex: 5}}>
              <TextInput
                  password={true}
                  style={[styles.input, styles.darkFont]}
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor="#303030"
                  value={this.state.password}
                  onChangeText={(text) => this.setState({password: text})}
              />
            </View>
        </View>
      );
    }

    return content;

  }

  _renderActionButton(){
    let content = null;

    if(!this.state.isRenderSignInButton){
      content = (
        <Button style={[styles.signin, styles.whiteFont]} onPress={()=>this.handleNext()}>Next</Button>
      )
    }else{
      content = (
        <Button style={[styles.signin, styles.whiteFont]} onPress={()=>this.handleSignIn()}>Sign In</Button>
      )
    }

    return content;

  }

  render(){
    return (
       <View style={styles.container}>
       {this._renderNavbar()}
       <View style={{height: this.state.visibleHeight}}>
           {/** <Image style={styles.bg} source={require('../img/bg.png')} /> */}
           <View style={styles.header}>
               <Image style={styles.mark} source={require('../images/logo.png')} />
               <Text>TAR Report {Config.version}</Text>
           </View>
           <View style={styles.inputs}>
               {this._renderInput()}
               <View style={styles.forgotContainer}>
                   <Text style={styles.greyFont}></Text>
               </View>
           </View>
           <View>
               {this._renderActionButton()}
           </View>
           <View style={styles.signup}>
              {/*<Button style={styles.darkFont} onPress={Actions.Register}>Don't have an account?<Text style={styles.darkFont}>  Sign Up</Text></Button>*/}
           </View>
           </View>
       </View>
   );
  }

  componentWillUnmount(){
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: '#FFFFFF'
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    },
    navBar: {
      backgroundColor: '#786c6a',
    },
    icon: {
      marginTop: 7
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .5,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 128,
        height: 128
    },
    signin: {
        justifyContent: 'center',
        backgroundColor: '#3b3533',
        padding: 20,
        alignItems: 'center'
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15,
      marginBottom: 10
    },
    inputs: {
        flex: .25
    },
    inputPassword: {
        marginLeft: 15,
        width: 20,
        height: 21,
        marginTop: 15
    },
    inputUsername: {
      marginLeft: 15,
      width: 20,
      height: 20,
      marginTop: 15
    },
    inputContainer: {
        flexDirection:"row",
        padding: 10,
        paddingBottom: 0,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent'
    },
    input: {
        height: 50,
        fontSize: 14
    },
    forgotContainer: {
      alignItems: 'flex-end',
      padding: 15,
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    },
    darkFont: {
      color: '#303030'
    }
});

module.exports = Login;
