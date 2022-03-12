import React from 'react'
import { useState, useEffect } from 'react'
import { firebase, db } from './services/firebase-config.js'
import CreateNewPost from './CreateNewPost.js'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import Posts from './Posts.js'

const SocialEnterprise = ({ signOut, id }) => {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const postRef = collection(db, 'posts')
        const q = query(postRef, where('userRef', '==', doc(db, 'users', id)))
        getDocs(q)
            .then(snapshot => {
                console.log(snapshot.docs.map(doc => doc.data()))
                setPosts(snapshot.docs.map(doc => doc.data()))
            })
    }, [])
    return (
        <div>
            <h1>Social Enterprise {firebase.auth().currentUser.displayName}</h1>
            <CreateNewPost setPosts={setPosts} posts={posts}/>
            <Posts posts={posts}/>
            <button onClick={() => signOut()}>Sign-out</button>
        </div>
    )
}

export default SocialEnterprise