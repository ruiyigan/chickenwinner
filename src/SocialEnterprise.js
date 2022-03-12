import React from 'react'
import { useState } from 'react'
import { firebase, db } from './services/firebase-config.js'
import { collection, addDoc } from "firebase/firestore"

const CreateNewPost = () => {
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('') 
    const addPost = async (event) => {
        event.preventDefault()
        const PostObject = {
            title: newTitle,
            content: newContent
        }
        const docRef = await addDoc(collection(db, 'posts'), PostObject)
        console.log("Document written with ID: ", docRef.id)
        console.log(newTitle, newContent)
        setNewTitle('')
        setNewContent('')
    }
    return (
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
    )
}

const SocialEnterprise = ({ signOut }) => {
    const [posts, setPosts] = useState([])
    return (
        <div>
            <h1>Social Enterprise</h1>
            <h2>Posts</h2>
            {posts}
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
            <CreateNewPost />
            <button onClick={() => signOut()}>Sign-out</button>
        </div>
    )
}

export default SocialEnterprise