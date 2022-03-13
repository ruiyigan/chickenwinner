import React from 'react'
import { useState, useEffect } from 'react'
import CreateNewPost from './CreateNewPost.js'
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
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Social Enterprise</h2>
            <h2 class="mt-6 text-center text-xl font-bold text-gray-800">Welcome: {enterpriseData.name}</h2>
            {type === 'Social Enterprise' && <CreateNewPost setPosts={setPosts} posts={posts} />}
            <Posts posts={posts} setPosts={setPosts} type={type}/>
            {type === 'Social Enterprise' && <button class="absolute top-0 right-0 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => signOut()}>Sign-out</button>}
        </div>
    )
}

export default SocialEnterprise