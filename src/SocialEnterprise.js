import React from 'react'
import { useState, useEffect } from 'react'
import CreateNewPost from './CreateNewPost.js'
import Posts from './Posts.js'
import enterpriseService from './services/enterprises.js'
import postService from './services/posts.js'

const SocialEnterprise = ({ type, signOut, id }) => {
    const [posts, setPosts] = useState([])
    const [enterpriseData, setEnterpriseData] = useState({})
    const [createPost, setCreatePost] = useState(false)

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

    const toggleCreateNewPost = () => {
        setCreatePost(!createPost)
    }
    return (
        <div>
            <h1 class="text-center text-2xl text-gray-800 font-bold uppercase leading-10">{enterpriseData.name}</h1>
            <div class="pt-2 text-center">
                <button onClick={() => toggleCreateNewPost()} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">{createPost ? "Hide" : "Create New Post"}</button>
            </div>
            {type === 'Social Enterprise' && createPost && <CreateNewPost setPosts={setPosts} posts={posts} />}
            <Posts posts={posts} setPosts={setPosts} type={type}/>
            {type === 'Social Enterprise' && 
                <button class="absolute top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => signOut()} >
                    Sign out
                </button>
            }
        </div>
    )
}

export default SocialEnterprise