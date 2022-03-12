import React from 'react'

const Posts = ({ posts }) => {
    return (
        <>
            <h2>Posts</h2>
            {posts.map(post => <p> {post.title} {post.content} </p>)}
        </>
    )
}

export default Posts