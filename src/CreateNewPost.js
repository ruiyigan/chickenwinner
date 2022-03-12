import React from 'react'
import { useState } from 'react'
import { firebase, db } from './services/firebase-config.js'
import { collection, addDoc, doc } from "firebase/firestore"

const CreateNewPost = ({ posts, setPosts }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const addPost = async (event) => {
        event.preventDefault()
        const PostObject = {
            title: newTitle,
            content: newContent,
            userRef: doc(db, 'users', firebase.auth().currentUser.uid)
        }
        const docRef = await addDoc(collection(db, 'posts'), PostObject)
        console.log("Document written with ID: ", docRef.id)
        console.log(newTitle, newContent)
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