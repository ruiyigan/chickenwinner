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
        console.log("here", id)
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
                        class="border-2 border-black rounded-md border-solid"
                    />
                </div>
                <div>
                    Content
                    <input
                        name='author'
                        type='text'
                        value={editContent}
                        onChange={({ target }) => setEditContent(target.value)}
                        class="border-2 border-black rounded-md border-solid"
                    />
                </div>
                <button type='submit' class="inline-flex justify-center py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
        <div class="border-gray-300 border-2 rounded-xl w-[30rem] py-7 px-5">
            <div class="grid grid-cols-6 gap-3">
                <div class="col-span-2">
                <img src="https://events.duolingo.com/images/why_global.svg" />
                </div>

                <div div class="col-span-2">
                    <p class="text-gray-700 font-bold">{title}</p>
                    <p class="text-gray-500 mt-4">{content}</p>
                </div>

                <div div class="col-span-2">
                    {type === 'Social Enterprise' && <button class='rounded-md px-1 border-2 border-black-800 border-rounded' onClick={() => setIsEditing(true)}>Edit</button>}
                    {type === 'Social Enterprise' && <button class='rounded-md px-1 border-2 border-black-800' onClick={() => deletePost()}>Delete</button>}
                </div>
            </div>
        </div>
    )
}

export default Post