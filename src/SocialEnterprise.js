import React from 'react'
import { useState, useEffect } from 'react'
import { firebase, db } from './services/firebase-config.js'
import CreateNewPost from './CreateNewPost.js'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import Posts from './Posts.js'

const SocialEnterprise = ({ type, signOut, id }) => {
    const [posts, setPosts] = useState([])
    const [enterpriseData, setEnterpriseData] = useState({})
    useEffect(() => {
        const postRef = collection(db, 'posts')
        const q = query(postRef, where('userRef', '==', doc(db, 'users', id)))
        getDocs(q)
            .then(snapshot => {
                setPosts(snapshot.docs.map(doc => doc.data()))
            })
        const enterpriseRef = doc(db, 'enterprises', id)
        getDoc(enterpriseRef)
            .then(snapshot => {
                setEnterpriseData(snapshot.data())
                console.log("socialenterprise data", snapshot.data())
            })
    }, [])
    console.log("hello")
    return (
        <div>
            <h2>Social Enterprise {enterpriseData.name}</h2>
            {type === 'Social Enterprise' && <CreateNewPost setPosts={setPosts} posts={posts} />}
            <Posts posts={posts} />
            {type === 'Social Enterprise' && <button onClick={() => signOut()}>Sign-out</button>}
        </div>
    )
}

export default SocialEnterprise