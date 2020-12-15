import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import database from '@react-native-firebase/database';

export const signUp = (data) => async (dispatch) => {
    console.log(data)
    const {name,instaUserName, bio, email, password, country, image} = data

    auth()
    .createUserWithEmailAndPassword(email, password)
    .then((data) => {
        console.log(data)
        console.log("User Creation was Successful!")

        database()
        .ref('/users/' + data.user.uid)
        .set({
            name,
            instaUserName,
            country,
            image,
            bio,
            uid: data.user.uid,
            password
        })
        .then(() => console.log('Data set Successsfully!'))
        Snackbar.show({
            text: 'Account created!',
            textColor: 'white',
            backgroundColor: '#1b262c'
        })
    })
    .catch((error) => {
        console.log(error)
        Snackbar.show({
            text: 'Signup failed',
            textColor: 'white',
            backgroundColor: 'red'
        })
    })
}

export const signIn = (data) => async (dispatch) => {
    console.log(data)
    const { email, password } = data;

    auth()
        .signInWithEmailAndPassword(email,password)
        .then(() => {
            console.log("SignIn Successfully!")
            Snackbar.show({
                text: 'Account SignIn',
                textColor: 'white',
                backgroundColor: '#1b262c'
            })
        })
        .catch((error) => {
            console.log(error)
            Snackbar.show({
                text: 'SignIn failed',
                textColor: 'white',
                backgroundColor: 'red'
            })
        })
}

export const signOut = () => async (dispatch) => {
    auth()
    .signOut()
    .then(() => {
        Snackbar.show({
            text: 'SignOut Success',
            textColor: 'white',
            backgroundColor: '#1b262c'
        })
    })
    .catch((error) => {
        console.log(error)
        Snackbar.show({
            text: 'SignOut failed',
            textColor: 'white',
            backgroundColor: 'red'
        })
    })
}