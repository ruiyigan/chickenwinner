import React from 'react'
import Post from './Post.js'

const Posts = ({ posts, setPosts, type }) => {
    return (
        <>
            <h2>Posts</h2>
            {posts.map(post => <Post type={type} key={post.id} post={post} setPosts={setPosts} posts={posts}/>)}
        </>
    )
}

export default Posts