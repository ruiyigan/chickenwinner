import React from 'react'
import Post from './Post.js'

const Posts = ({ posts, setPosts, type }) => {
    return (
        <>
            <div class="h-screen flex flex-col gap-5 items-center bg-white">
                <h2 class="mt-6 text-center text-xl font-bold text-gray-800">Posts</h2>
                {posts.map(post => <Post type={type} key={post.id} id={post.id} title={post.title} content={post.content} setPosts={setPosts} posts={posts}/>)}
            </div>
        </>
    )
}

export default Posts