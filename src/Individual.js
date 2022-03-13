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
            <>
                {enterpriseIds.map(id => <EnterpriseCard key={id} type={type} signOut={signOut} id={id} />)}
            </>
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
            <h1>Individual</h1>
            <div>
                <input onChange={onChangeValue} type="radio" value="Browse" name="view" /> Browse
                <input onChange={onChangeValue} type="radio" value="Schedule" name="view" /> Schedule
            </div>
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
            {isSchedule ? <Schedule /> : <Browse />}
            <button onClick={() => signOut()}>Sign-out</button>
        </div>
    )
}

export default Individual