import React, { useEffect, useState } from 'react';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { firebase, db } from './services/firebase-config.js'
import 'firebase/compat/auth';

import { doc, setDoc, getDoc } from "firebase/firestore";
import SocialEnterprise from './SocialEnterprise.js';
import Individual from './Individual.js';

import individualService from './services/individuals.js';
import enterpriseService from './services/enterprises.js';

import './index.css'

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
                <h1 class="mt-6 text-center text-3xl font-extrabold text-purple-700 leading-10">raiSE</h1>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </div>
        );
    }

    const signOut = () => {
        setType(null)
        setIsSignedIn(false)
        firebase.auth().signOut()
    }

    const individualSnapshot = individualService.getIndividualSnapshot(firebase.auth().currentUser.uid)
    individualSnapshot
        .then(snapshot => {
            if (snapshot.exists()) {
                setType('Individual')
            }
        })

    const enterpriseSnapshot = enterpriseService.getEnterpriseSnapshot(firebase.auth().currentUser.uid)
    enterpriseSnapshot
        .then(snapshot => {
            if (snapshot.exists()) {
                setType("Social Enterprise")
            }
        })

    if (type === 'Social Enterprise') {
        return (
            <>
                <h1 class="text-center text-base text-gray-600 font-bold uppercase leading-10">Welcome</h1>
                <SocialEnterprise type={type} signOut={signOut} id={firebase.auth().currentUser.uid} />
            </>
        )
    }
    if (type === 'Individual') {
        return (
            <Individual type={type} signOut={signOut} />
        )
    }

    async function submitHandler(type) {
        setType(type)
        if (type === 'Social Enterprise') {
            await enterpriseService.addEnterprise(firebase.auth().currentUser.uid, firebase.auth().currentUser.displayName, firebase.auth().currentUser.email)  
        }
        if (type === 'Individual') {
             await individualService.addIndividual(firebase.auth().currentUser.uid, firebase.auth().currentUser.displayName, firebase.auth().currentUser.email)
        }
    }

    return (
        <div class='flex flex-col pt-36 items-center'>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3 " onClick={() => submitHandler("Individual")}>
                Individual
            </button>
            <button class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded my-3 " onClick={() => submitHandler("Social Enterprise")}>
                Social Enterprise
            </button>
        </div>
    )
}

export default Login;