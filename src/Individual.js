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
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Individual</h2>
            <h2 class="mt-6 text-center text-xl font-bold text-gray-800">Welcome: {firebase.auth().currentUser.displayName}</h2>
            {enterpriseIds.map(id => <EnterpriseCard key={id} type={type} signOut={signOut} id={id} />)}
            <button class="absolute top-0 right-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => signOut()}>Sign-out</button>
        </div>
    )
}

export default Individual