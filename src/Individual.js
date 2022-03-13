import React from 'react'
import { useEffect, useState } from 'react'
import EnterpriseCard from './EnterpriseCard.js'
import { db, firebase } from './services/firebase-config.js'
import enterpiseService from './services/enterprises.js'
import individualService from './services/individuals.js'
import { doc, getDoc } from 'firebase/firestore'
import Post from './Post.js'
import Posts from './Posts.js'
import { act } from 'react-dom/test-utils'

const Individual = ({ type, signOut }) => {
    const [enterpriseIds, setEnterpriseIds] = useState([])
    const [isSchedule, setIsSchedule] = useState(false)
    const [signedUpActivities, setSignedUpActivities] = useState([])

    useEffect(() => {
        enterpiseService.getAllEnterpriseSnapshots()
            .then(querySnapshot => {
                const enterprises = querySnapshot.docs.map((doc) => doc.id)
                setEnterpriseIds(enterprises)
            }
            )
    }, [])
    const onChangeValue = (event) => {
        if (event.target.value == 'Schedule') {
            getActivities()
            setIsSchedule(true)
        } else {
            setIsSchedule(false)
        }
    }

    const Browse = () => {
        return (
            <div class='text-center'>
                {enterpriseIds.map(id => <EnterpriseCard key={id} type={type} signOut={signOut} id={id} />)}
            </div>
        )
    }

    const getActivities = async() => {
        const individualSnapshot = await individualService.getIndividualSnapshot(firebase.auth().currentUser.uid)
        const signedUpActivityIds = individualSnapshot.data().signedUpActivityIds
    
        const activities = []
        for (let activityId of signedUpActivityIds) {
            const postRef = doc(db, 'posts', activityId)
            const postSnapshot = await getDoc(postRef)
            activities.push(postSnapshot.data())
        }
        console.log("activities", activities)
        setSignedUpActivities(activities)
    }
    const Schedule = () => {
        return (
            <>
                <Posts type={type} posts={signedUpActivities}/>
            </>
        )
    }

    return (
        <div>
            <h1 class="text-center text-base text-gray-600 font-bold uppercase leading-10">Welcome</h1>
            <h1 class="text-center text-2xl text-gray-800 font-bold uppercase leading-10">{firebase.auth().currentUser.displayName}</h1>
            <div class='text-center'>
                <input class="mx-4" onChange={onChangeValue} type="radio" value="Browse" name="view" /> 
                <label class="text-blue-500 font-bold leading-10">
                    Browse
                </label>
                <input class="mx-4" onChange={onChangeValue} type="radio" value="Schedule" name="view" />
                <label class="text-blue-500 font-bold leading-10">
                    Schedule
                </label>
            </div>
            {isSchedule ? <Schedule /> : <Browse />}
            
            <button class="absolute top-10 right-10 bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full" onClick={() => signOut()}>Sign-out</button>
        </div>
    )
}

export default Individual