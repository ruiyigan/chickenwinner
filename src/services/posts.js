import { doc, getDocs, collection, query, where, addDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config";

const getPostsByEnterpriseId = (uid) => {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, where('enterpriseRef', '==', doc(db, 'enterprises', uid)))
    return getDocs(q)
}

const addPostbyEnterpriseId = (PostObject) => {
    return setDoc(doc(db, 'posts', PostObject.id), PostObject)
}

export default { getPostsByEnterpriseId, addPostbyEnterpriseId }