import React from 'react'
import { useState } from 'react'
import { firebase, db } from './services/firebase-config.js'
import { doc } from "firebase/firestore"
import postService from './services/posts.js'
import { v4 as uuidv4 } from 'uuid'

const CreateNewPost = ({ posts, setPosts }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newContent, setNewContent] = useState('')
    const [newDateTime, setNewDateTime] = useState('')
    const [newDuration, setNewDuration] = useState(0)
    const [newCapacity, setNewCapacity] = useState(0)
    const [isActivity, setIsActivity] = useState(false)
    const [postType, setPostType] = useState('')

    const addPost = async (event) => {
        event.preventDefault()
        const postId = uuidv4()
        let PostObject = {}
        if (isActivity) {
            PostObject = {
                id: postId,
                title: newTitle,
                content: newContent,
                postType: postType,
                dateTime: newDateTime,
                duration: newDuration,
                capacity: newCapacity,
                participantIds: [],
                slotsFilled: 0,
                enterpriseRef: doc(db, 'enterprises', firebase.auth().currentUser.uid)
            }
        }
        else {
            PostObject = {
                id: postId,
                title: newTitle,
                content: newContent,
                postType: postType,
                enterpriseRef: doc(db, 'enterprises', firebase.auth().currentUser.uid)
            }
        }
        await postService.addPostbyEnterpriseId(PostObject)
        setNewTitle('')
        setNewContent('')
        setNewDateTime('')
        setNewDuration(0)
        setNewCapacity(0)
        setPosts([...posts, PostObject])
    }

    const onChangeValue = (event) => {
        if (event.target.value == 'Activity') {
            setIsActivity(true)
            setPostType('Activity')
        } else {
            setIsActivity(false)
            setPostType('Post')
        }
    }

    const Acitivty = () => {
        return (
            <>
                <div>
                    Date and Time
                    <input
                        type="datetime-local" 
                        value={newDateTime}
                        onChange={({ target }) => setNewDateTime(target.value)}
                        required
                    />
                </div>
                <div>
                    Duration (Hour)
                    <input 
                        type="number" 
                        min="1"
                        value={newDuration}
                        onChange={({ target }) => setNewDuration(target.value)}
                        required
                    />
                </div>
                <div>
                    Capacity
                    <input 
                        type="number" 
                        min="1"
                        value={newCapacity}
                        onChange={({ target }) => setNewCapacity(target.value)}
                        required
                    />
                </div>
            </>
        )
    }

    return (
        <>
            <h3>Create New Post</h3>
            <div>
                <input onChange={onChangeValue} type="radio" value="Post" name="post" /> Post
                <input onChange={onChangeValue} type="radio" value="Activity" name="post" /> Activity
            </div>
            <form onSubmit={addPost} autoComplete="off">
                <div>
                    Title
                    <input
                        name='title'
                        type='text'
                        value={newTitle}
                        onChange={({ target }) => setNewTitle(target.value)}
                        required
                    />
                </div>
                <div>
                    Content
                    <input
                        name='author'
                        type='text'
                        value={newContent}
                        onChange={({ target }) => setNewContent(target.value)}
                        required
                    />
                </div>
                {isActivity && Acitivty()}
                <button type='submit'>
                    create
                </button>
            </form>
        </>
    )
}

export default CreateNewPost