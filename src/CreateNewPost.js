import React from 'react'
import { useState } from 'react'
import { firebase, db } from './services/firebase-config.js'
import { doc } from "firebase/firestore"
import postService from './services/posts.js'
import { v4 as uuidv4 } from 'uuid'

const CreateNewPost = ({ posts, setPosts }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const addPost = async (event) => {
        event.preventDefault()
        const postId = uuidv4()
        const PostObject = {
            id: postId,
            title: newTitle,
            content: newContent,
            enterpriseRef: doc(db, 'enterprises', firebase.auth().currentUser.uid)
        }
        await postService.addPostbyEnterpriseId(PostObject)
        setNewTitle('')
        setNewContent('')
        setPosts([...posts, PostObject])
    }
    return (
        <>
            <h3>Create New Post</h3>
            <form onSubmit={addPost}>
                <div>
                    Title
                    <input
                        name='title'
                        type='text'
                        value={newTitle}
                        onChange={({ target }) => setNewTitle(target.value)}
                    />
                </div>
                <div>
                    Content
                    <input
                        name='author'
                        type='text'
                        value={newContent}
                        onChange={({ target }) => setNewContent(target.value)}
                    />
                </div>
                <button type='submit'>
                    create
                </button>
            </form>
        </>
    )
}

export default CreateNewPost