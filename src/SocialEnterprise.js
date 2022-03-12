import React from 'react'
import { useState, useEffect } from 'react'
import { firebase, db } from './services/firebase-config.js'
import CreateNewPost from './CreateNewPost.js'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import Posts from './Posts.js'
import enterpriseService from './services/enterprises.js'
import postService from './services/posts.js'

const SocialEnterprise = ({ type, signOut, id }) => {
    const [posts, setPosts] = useState([])
    const [enterpriseData, setEnterpriseData] = useState({})
    useEffect(() => {
        postService.getPostsByEnterpriseId(id)
            .then(snapshot => {
                setPosts(snapshot.docs.map(doc => doc.data()))
            })
        enterpriseService.getEnterpriseSnapshot(id)
            .then(snapshot => {
                setEnterpriseData(snapshot.data())
            })
    }, [])
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