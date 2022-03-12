import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config";

const getIndividualRef = (uid) => {
    const individualRef = doc(db, "individuals", uid)
    return individualRef
}

const getIndividualSnapshot = (uid) => {
    return getDoc(getIndividualRef(uid))
}

const addIndividual = (uid, name, email) => {
    return setDoc(doc(db, "individuals", uid), {
        name: name,
        email: email
    });
}

export default { getIndividualSnapshot, addIndividual }