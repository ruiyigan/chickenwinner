import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { db } from './services/firebase-config'

const Post = ({id, title, content, setPosts, posts, type}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(title)
    const [editContent, setEditContent] = useState(content)

    const updatePost = async (event) => {
        event.preventDefault()
        const PostObject = {
            title: editTitle,
            content: editContent,
            id: id
        }
        await setDoc(doc(db, 'posts', id), PostObject, { merge: true })
        setIsEditing(false)
        setPosts(posts.map(post => post.id === id ? PostObject : post))
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
        await deleteDoc(doc(db, 'posts', id))
        setPosts(posts.filter(post => post.id !== id))
    }

    return (
        <>
            <h3>{title}</h3>
            <p>{content}</p>
            {type === 'Social Enterprise' && <button onClick={() => setIsEditing(true)}>Edit</button>}
            {type === 'Social Enterprise' && <button onClick={() => deletePost()}>Delete</button>}
        </>
    )
}

export default Post