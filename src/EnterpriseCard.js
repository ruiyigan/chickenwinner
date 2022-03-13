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
        <button class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded flex flex-col my-3 w-64 text-center" onClick={() => setIsClicked(true)}>
            {enterpriseName}
        </button>
    )
}

export default EnterpriseCard