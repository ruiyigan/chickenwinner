import { deleteDoc, doc, setDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { db, firebase } from './services/firebase-config'

const Post = ({post, setPosts, posts, type}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(post.title)
    const [editContent, setEditContent] = useState(post.content)

    const updatePost = async (event) => {
        event.preventDefault()
        const PostObject = {
            title: editTitle,
            content: editContent,
            id: post.id
        }
        await setDoc(doc(db, 'posts', post.id), PostObject, { merge: true })
        setIsEditing(false)
        setPosts(posts.map(mappedpost => mappedpost.id === post.id ? PostObject : mappedpost))
    }

    const activityPost = () => {
        const [date, time] = post.dateTime.split('T')
        return (
            <>
                <p>Duration: {post.duration}</p>
                <p>Date: {date}</p>
                <p>Time: {time}</p>
                <p>Slots Available: {post.capacity - post.slotsFilled}</p>
            </>
        )
    }

    if (isEditing) {
        return (
            <div>
                <form onSubmit={updatePost}>
                <div>
                    Title
                    <input
                        name='title'
                        type='text'
                        value={editTitle}
                        onChange={({ target }) => setEditTitle(target.value)}
                    />
                </div>
                <div>
                    Content
                    <input
                        name='author'
                        type='text'
                        value={editContent}
                        onChange={({ target }) => setEditContent(target.value)}
                    />
                </div>
                <button type='submit'>
                    Save
                </button>
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
        <>
            <h3>Title: {post.title}</h3>
            <p>Content: {post.content}</p>
            {post.postType == 'Activity' && activityPost()}
            {type === 'Individual' && !post.participantIds.includes(firebase.auth().currentUser.uid) && post.slotsFilled < post.capacity && <button onClick={() => signUpActivity()}>Sign Up</button>}
            {type === 'Social Enterprise' && <button onClick={() => setIsEditing(true)}>Edit</button>}
            {type === 'Social Enterprise' && <button onClick={() => deletePost()}>Delete</button>}
        </>
    )
}

export default Post