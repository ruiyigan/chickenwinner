import React from 'react'

const Posts = ({ posts }) => {
    return (
        <>
            <h2>Posts</h2>
            {posts.map(post => <p key={post.title}> {post.title} {post.content} </p>)}
        </>
    )
}

export default Posts