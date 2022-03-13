import React from 'react'
import { useState } from 'react'
import { firebase, db } from './services/firebase-config.js'
import { doc } from "firebase/firestore"
import postService from './services/posts.js'
import { v4 as uuidv4 } from 'uuid'

const CreateNewPost = ({ posts, setPosts, setCreatePost }) => {
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
        setCreatePost(false)
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
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Date and Time
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        type="datetime-local" 
                        value={newDateTime}
                        onChange={({ target }) => setNewDateTime(target.value)}
                        required
                    />
                </div>
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                        Duration (hours)
                    </label>
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        type="number" 
                        min="1"
                        value={newDuration}
                        onChange={({ target }) => setNewDuration(target.value)}
                        required
                    />
                </div>
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    Capacity
                    <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
            <div class="text-center">
                <input onChange={onChangeValue} type="radio" value="Post" name="post" /> 
                <label class="text-blue-500 font-bold leading-10 pr-2 pl-1">
                    Post
                </label>
                <input onChange={onChangeValue} type="radio" value="Activity" name="post" />
                <label class="text-blue-500 font-bold leading-10 pr-2 pl-1">
                    Activity
                </label>
            </div>
            <form onSubmit={addPost} autoComplete="off">
                <div class="flex flex-col gap-5 items-center bg-white">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Title
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            name='title'
                            type='text'
                            value={newTitle}
                            onChange={({ target }) => setNewTitle(target.value)}
                            required
                        />
                    </div>
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Content
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            name='author'
                            type='text'
                            value={newContent}
                            onChange={({ target }) => setNewContent(target.value)}
                            required
                        />
                    </div>
                    {isActivity && Acitivty()}
                    <button type='submit' class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Create
                    </button>

                </div>
            </form>
        </>
    )
}

export default CreateNewPost