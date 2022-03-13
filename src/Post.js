import { deleteDoc, doc, setDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { db, firebase } from './services/firebase-config'

const Post = ({post, setPosts, posts, type}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(post.title)
    const [editContent, setEditContent] = useState(post.content)
    const [editDateTime, setEditDateTime] = useState(post.dateTime)
    const [editDuration, setEditDuration] = useState(post.duration)
    const [editCapacity, setEditCapacity] = useState(post.capacity)

    const updatePost = async (event) => {
        event.preventDefault()
        let PostObject = {}
        if (post.postType === 'Activity') {
            PostObject = {
                id: post.id,
                postType: post.postType,
                title: editTitle,
                content: editContent,
                dateTime: editDateTime,
                duration: editDuration,
                capacity: editCapacity,
                slotsFilled: post.slotsFilled,
                participantIds: post.participantIds,
            }
        }
        else {
            PostObject = {
                id: post.id,
                postType: post.postType,
                title: editTitle,
                content: editContent,
                participantIds: post.participantIds
            }
        }
        await setDoc(doc(db, 'posts', post.id), PostObject, { merge: true })
        setIsEditing(false)
        setPosts(posts.map(mappedpost => mappedpost.id === post.id ? PostObject : mappedpost))
    }

    const activityPost = () => {
        const [date, time] = post.dateTime.split('T')
        return (
            <>
                <p class="text-gray-500 mt-4">Duration: {post.duration}</p>
                <p class="text-gray-500 mt-4">Date: {date}</p>
                <p class="text-gray-500 mt-4">Time: {time}</p>
                <p class="text-gray-500 mt-4">Slots Available: {post.capacity - post.slotsFilled}</p>
            </>
        )
    }

    const Acitivty = () => {
        return (
            <>
                <div class='pb-2'>
                    Date and Time
                    <input
                        type="datetime-local" 
                        value={editDateTime}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                        onChange={({ target }) => setEditDateTime(target.value)}
                        required
                    />
                </div>
                <div class='pb-2'>
                    Duration (Hour)
                    <input 
                        type="number" 
                        min="1"
                        value={editDuration}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                        onChange={({ target }) => setEditDuration(target.value)}
                        required
                    />
                </div>
                <div class='pb-2'>
                    Capacity
                    <input 
                        type="number" 
                        min="1"
                        value={editCapacity}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                        onChange={({ target }) => setEditCapacity(target.value)}
                        required
                    />
                </div>
            </>
        )
    }

    if (isEditing) {
        return (
            <div class="border-gray-300 border-2 rounded-xl w-3/4 py-7 px-5">
                <form onSubmit={updatePost} class="grid grid-cols-6 gap-3" >
                    <div class="col-span-6">
                        <div class='pb-2'>
                            Title: 
                            <input
                                name='title'
                                type='text'
                                value={editTitle}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                                onChange={({ target }) => setEditTitle(target.value)}
                            />
                        </div>
                        <div class='pb-2'>
                            Content: 
                            <input
                                name='author'
                                type='text'
                                value={editContent}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 light:bg-gray-700 light:border-gray-600 light:placeholder-gray-400 light:text-white light:focus:ring-blue-500 light:focus:border-blue-500"
                                onChange={({ target }) => setEditContent(target.value)}
                            />
                        </div>
                        {post.postType === "Activity" && Acitivty()}
                        <div class='pt-4 flex justify-end'>
                            <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type='submit'>
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    
    const deletePost = async () => {
        await deleteDoc(doc(db, 'posts', post.id))
        setPosts(posts.filter(filterdpost => filterdpost.id !== post.id))
    }

    const signUpActivity = async () => {
        const PostObject = {
            title: editTitle,
            content: editContent,
            id: post.id,
            participantIds: [...post.participantIds, firebase.auth().currentUser.uid],
            slotsFilled: post.slotsFilled + 1,
            capacity: post.capacity,
            duration: post.duration,
            dateTime: post.dateTime,
            postType: post.postType
        }
        await setDoc(doc(db, 'posts', post.id), PostObject, { merge: true })
        await updateDoc(doc(db, 'individuals', firebase.auth().currentUser.uid), {signedUpActivityIds: arrayUnion(post.id)})
        setPosts(posts.map(mappedpost => mappedpost.id === post.id ? PostObject : mappedpost))
    }

    return (
        <div class="border-gray-300 border-2 rounded-xl w-3/4 py-7 px-5">
            <div class="grid grid-cols-6 gap-3">
                <div class="col-span-5">
                    <h3 class="text-gray-700 font-bold">Title: {post.title}</h3>
                    <p class="text-gray-500 mt-4">Content: {post.content}</p>
                    {post.postType == 'Activity' && activityPost()}
                </div>

                <div class="flex-col]">
                    <div class="pb-2">
                        {type === 'Individual' && !post.participantIds.includes(firebase.auth().currentUser.uid) && post.slotsFilled < post.capacity && <button class="text-white bg-orange-400 hover:bg-orange-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => signUpActivity()}>Sign Up</button>}
                    </div>
                    <div class="pb-2">
                        {type === 'Social Enterprise' && <button class="text-white bg-gray-400 hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => setIsEditing(true)}>Edit</button>}
                    </div>
                    <div class="pb-2">
                        {type === 'Social Enterprise' && <button class="text-white bg-red-400 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => deletePost()}>Delete</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post