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
        <div class='text-center pt-4'>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Create New Post</h3>
            <form onSubmit={addPost}>
                <div>
                    <label class="block text-l font-medium text-gray-700">Title</label>
                    <input
                        name='title'
                        type='text'
                        value={newTitle}
                        onChange={({ target }) => setNewTitle(target.value)}
                        class= "border-2 border-black rounded-md border-solid"
                    />
                </div>
                <div>
                    <label class="block text-l font-medium text-gray-700">Content</label>
                    <input
                        name='author'
                        type='text'
                        value={newContent}
                        onChange={({ target }) => setNewContent(target.value)}
                        class= "border-2 border-black rounded-md border-solid"
                    />
                </div>
                <div class='pt-3'>
                    <button type='submit' class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        create
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateNewPost