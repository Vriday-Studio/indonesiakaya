import { get, ref, set } from "firebase/database";
import { database } from "./firebase";

export const createTarget = async (newUrl) => {
    try {
        const targetUrlRef = ref(database, "targetUrl");
        await set(targetUrlRef, newUrl);
    } catch (error) {
        console.error("Error add target:", error);
        throw error;
    }
};

export const getTargetUrl = async () => {
    try {
        const targetUrlRef = ref(database, "targetUrl");
        const snapshot = await get(targetUrlRef);
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error("Error get target url:", error);
        throw error;
    }
}