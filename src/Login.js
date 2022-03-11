import React, { useEffect, useState } from 'react';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { firebase, db } from './services/firebase-config.js'
import 'firebase/compat/auth';

import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
                // Forces account selection even when one account
                // is available.
                prompt: 'select_account'
            },
        },
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false,
    },
}

function Login() {
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [type, setType] = useState(null)

    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(userInfo => {
            setIsSignedIn(!!userInfo)
        })
        return () => unregisterAuthObserver()
    }, [])

    if (!isSignedIn) {
        return (
            <div>
                <h1>My App</h1>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </div>
        );
    }

    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', firebase.auth().currentUser.email))
    console.log("current user", firebase.auth().currentUser)
    const querySnapshot = getDocs(q)
    const signOut = () => {
        setType(null)
        firebase.auth().signOut()
    }
    querySnapshot.then(snapshot => {
        if (snapshot.docs.length >= 1) {
            setType(snapshot.docs[0].data().type)
        } else {
            console.log("outside", snapshot.docs)
        }
    })
    console.log("type", type)
    if (type != null) {
        if (type == 'Social Enterprise') {
            return (
                <div>
                    <h1>Social Enterprise</h1>
                    <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
                    <a onClick={() => signOut()}>Sign-out</a>
                </div>
            )
        }
        if (type == 'Individual') {
            return (
                <div>
                    <h1>Individual</h1>
                    <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
                    <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
                </div>
            )
        }
    }
    async function submitHandler(type) {
        try {
            const docRef = await addDoc(collection(db, "users"), {
                name: firebase.auth().currentUser.displayName,
                email: firebase.auth().currentUser.email,
                type: type
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
    return (
        <>
            <button onClick={() => submitHandler("Individual")}>
                Individual
            </button>
            <button onClick={() => submitHandler("Social Enterprise")}>
                Social Enterprise
            </button>
        </>
    )
}

export default Login;