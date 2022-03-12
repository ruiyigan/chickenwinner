import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config";

const getEnterpriseRef = (uid) => {
    const enterpriseRef = doc(db, "enterprises", uid)
    return enterpriseRef
}

const getEnterpriseSnapshot = (uid) => {
    return getDoc(getEnterpriseRef(uid))
}

const addEnterprise = (uid, name, email) => {
    return setDoc(doc(db, "enterprises", uid), {
        name: name,
        email: email
    });
}


export default { addEnterprise, getEnterpriseSnapshot }