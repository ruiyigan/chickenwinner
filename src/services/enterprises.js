import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firebase-config";

const getEnterpriseRef = (uid) => {
    const enterpriseRef = doc(db, "enterprises", uid)
    return enterpriseRef
}

const getEnterpriseSnapshot = (uid) => {
    return getDoc(getEnterpriseRef(uid))
}

const getAllEnterpriseSnapshots = () => {
    return getDocs(collection(db, "enterprises"))
}

const addEnterprise = (uid, name, email) => {
    return setDoc(doc(db, "enterprises", uid), {
        name: name,
        email: email
    });
}


export default { getAllEnterpriseSnapshots, addEnterprise, getEnterpriseSnapshot }