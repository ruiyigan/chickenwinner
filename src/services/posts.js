import { doc, getDocs, collection, query, where, addDoc } from "firebase/firestore";
import { db } from "./firebase-config";

const getPostsByEnterpriseId = (uid) => {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, where('enterpriseRef', '==', doc(db, 'enterprises', uid)))
    return getDocs(q)
}

const addPostbyEnterpriseId = (PostObject) => {
    return addDoc(collection(db, 'posts'), PostObject)
}

export default { getPostsByEnterpriseId, addPostbyEnterpriseId }