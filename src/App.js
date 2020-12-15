import React, {useEffect} from 'react'
import { Text } from "react-native";
import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth'

import { NavigationAction, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AddPost from './screen/AddPost'
import SignIn from './screen/SignIn'
import SignUp from './screen/SignUp'
import Home from './screen/Home'
import CustomerHeader from "./layout/CustomerHeader";

import { SET_USER, IS_AUTHENTICATED } from "./action/action.Types";

import database from '@react-native-firebase/database'
import EmptyContainer from './components/EmptyContainer'
import { requestPermission } from "./utils/AddPermission";
import { connect, useDispatch } from 'react-redux';
import CustomHeader from './layout/CustomerHeader';

const Stack = createStackNavigator();

const App = ({authState}) => {

  const  dispatch = useDispatch();

  const onAuthStateChnage = (user) => {
    if(user){
      dispatch({
        type: IS_AUTHENTICATED,
        payload: true
      })

      console.log(user._user.uid)

      database()
        .ref(`/user/${user._user.uid}`)
        .on('value', (snapshot) => {
          console.log('User Details', snapshot.val())

          dispatch({
            type: SET_USER,
            payload: snapshot.val()
          })
        })
    } else {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: false
      })
    }
  }

  useEffect(() => {
    requestPermission()
    const subscriber = auth().onAuthStateChanged(onAuthStateChnage)
    return subscriber
  }, [])

  if(authState.loading){
    return <EmptyContainer />
  }

    return(
      <>
        <NavigationContainer>
          <Stack.Navigator
          screenOptions={{
            header: (props) => <CustomHeader {...props} />
          }}
          >
            {authState.isAuthenticated ? (
              <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AddPost" component={AddPost} />
              </>
            ) : (
              <>
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="SignUp" component={SignUp} />
              </>
            ) }
          </Stack.Navigator>
        </NavigationContainer>
      </>
    )
}

const mapStateToProps = (state) => ({
  authState: state.auth
})

export default connect(mapStateToProps)(App)