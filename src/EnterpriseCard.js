import { getDoc, doc } from 'firebase/firestore'
import { firebase, db } from './services/firebase-config.js'
import React from 'react'
import { useState, useEffect } from 'react'
import SocialEnterprise from './SocialEnterprise.js'


const EnterpriseCard = ({type, signOut, id}) => {
    const [enterpriseName, setEnterpriseName] = useState('')
    const [isClicked, setIsClicked] = useState(false)
    useEffect(() => {
        const enterpriseRef = doc(db, 'enterprises', id)
        getDoc(enterpriseRef)
            .then(snapshot => {
                setEnterpriseName(snapshot.data().name)
            }
            )
    }, [])

    if (isClicked) {
        return (
            <SocialEnterprise type={type} signOut={signOut} id={id}/>
        )
    }
    return (
        <button onClick={() => setIsClicked(true)}>
            {enterpriseName}
        </button>
    )
}

export default EnterpriseCard