import React, { useEffect, useState } from 'react';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { firebase, db } from './services/firebase-config.js'
import 'firebase/compat/auth';

import { collection, addDoc, doc, getDocs, query, where, setDoc, getDoc } from "firebase/firestore";
import SocialEnterprise from './SocialEnterprise.js';
import Individual from './Individual.js';

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

    const usersRef = doc(db, 'users', firebase.auth().currentUser.uid)
    getDoc(usersRef)
        .then(snapshot => {
            if (snapshot.exists()) {
                setType(snapshot.data().type)
            } else {
                console.log("does not exist", snapshot)
            }
        })

    const signOut = () => {
        setType(null)
        setIsSignedIn(false)
        firebase.auth().signOut()
    }
    
    if (type != null) {
        if (type == 'Social Enterprise') {
            return (
                <SocialEnterprise signOut={signOut} />
            )
        }
        if (type == 'Individual') {
            return (
                <Individual signOut={signOut} />
            )
        }
    }
    console.log(firebase.auth().currentUser.uid)
    async function submitHandler(type) {
        try {
            await setDoc(doc(db, "users", firebase.auth().currentUser.uid), {
                name: firebase.auth().currentUser.displayName,
                email: firebase.auth().currentUser.email,
                type: type
            });
            console.log("Document written with ID: ", firebase.auth().currentUser.uid);
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