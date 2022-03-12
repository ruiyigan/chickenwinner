import React from 'react'
import { useEffect, useState } from 'react'
import EnterpriseCard from './EnterpriseCard.js'
import { firebase } from './services/firebase-config.js'
import enterpiseService from './services/enterprises.js'

const Individual = ({ type, signOut }) => {
    const [enterpriseIds, setEnterpriseIds] = useState([])
    useEffect(() => {
        enterpiseService.getAllEnterpriseSnapshots()
            .then(querySnapshot => {
                const enterprises = querySnapshot.docs.map((doc) => doc.id)
                setEnterpriseIds(enterprises)
            }
            )
    }, [])
    return (
        <div>
            <h1>Individual</h1>
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
            {enterpriseIds.map(id => <EnterpriseCard key={id} type={type} signOut={signOut} id={id} />)}
            <button onClick={() => signOut()}>Sign-out</button>
        </div>
    )
}

export default Individual