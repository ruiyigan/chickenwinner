import React, { useEffect, useState } from 'react';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { firebase, db } from './services/firebase-config.js'
import 'firebase/compat/auth';

import { doc, setDoc, getDoc } from "firebase/firestore";
import SocialEnterprise from './SocialEnterprise.js';
import Individual from './Individual.js';

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            customParameters: {
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

    const signOut = () => {
        setType(null)
        setIsSignedIn(false)
        firebase.auth().signOut()
    }

    const individualRef = doc(db, "individuals", firebase.auth().currentUser.uid)
    getDoc(individualRef).then(snapshot => {
        if (snapshot.exists()) {
            setType("Individual")
        }
    })
    const enterpriseRef = doc(db, "enterprises", firebase.auth().currentUser.uid)
    getDoc(enterpriseRef).then(snapshot => {
        if (snapshot.exists()) {
            setType("Social Enterprise")
        }
    })

    if (type === 'Social Enterprise') {
        return (
            <SocialEnterprise signOut={signOut} id={firebase.auth().currentUser.uid} />
        )
    }
    if (type === 'Individual') {
        return (
            <Individual signOut={signOut} />
        )
    }

    async function submitHandler(type) {
        setType(type)
        if (type === 'Social Enterprise') {
            console.log('Social Enterprise')
            await setDoc(doc(db, "enterprises", firebase.auth().currentUser.uid), {
                name: firebase.auth().currentUser.displayName,
                email: firebase.auth().currentUser.email,
            });
            console.log("Created social entperise with ID: ", firebase.auth().currentUser.uid);
        }
        if (type === 'Individual') {
            console.log('Individual')
            await setDoc(doc(db, "individuals", firebase.auth().currentUser.uid), {
                name: firebase.auth().currentUser.displayName,
                email: firebase.auth().currentUser.email,
            });
            console.log("Created individual with ID: ", firebase.auth().currentUser.uid);
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