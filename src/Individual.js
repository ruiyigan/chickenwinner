import React from 'react'
import { firebase } from './services/firebase-config.js'

const Individual = ({signOut}) => {
    return (
        <div>
            <h1>Individual</h1>
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
            <button onClick={() => signOut()}>Sign-out</button>
        </div>
    )
}

export default Individual