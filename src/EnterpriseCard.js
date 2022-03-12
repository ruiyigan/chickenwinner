import React from 'react'
import { useState, useEffect } from 'react'
import SocialEnterprise from './SocialEnterprise.js'
import enterpriseService from './services/enterprises.js'

const EnterpriseCard = ({ type, signOut, id }) => {
    const [enterpriseName, setEnterpriseName] = useState('')
    const [isClicked, setIsClicked] = useState(false)
    useEffect(() => {
        enterpriseService.getEnterpriseSnapshot(id)
            .then(snapshot => {
                setEnterpriseName(snapshot.data().name)
            }
            )
    }, [])

    if (isClicked) {
        return (
            <SocialEnterprise type={type} signOut={signOut} id={id} />
        )
    }
    return (
        <button onClick={() => setIsClicked(true)}>
            {enterpriseName}
        </button>
    )
}

export default EnterpriseCard