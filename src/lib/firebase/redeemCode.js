import { get, limitToLast, orderByChild, query, ref, set } from "firebase/database";
import { database } from "./firebase";
import { getMinimalPointQuiz } from "./quiz";

const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

export const createRedeemCode = async (user, selectedOption) => {
    try {
        const redeemCodeIdValue = generateCode();
        const createdAt = new Date().toISOString();

        const redeemCode = await get(ref(database, `count/RedeemCode`));
        let redeemCodeValue = redeemCode.val() || 0;

        await set(ref(database, `RedeemCode/${redeemCodeIdValue}`), { id: redeemCodeIdValue, status: false, type: selectedOption, user, createdAt });

        await set(ref(database, `Users/${user.id}/redeemCode`), redeemCodeIdValue);

        await set(ref(database, `Users/${user.id}/points`), 0);

        redeemCodeValue += 1;
        await set(ref(database, `count/RedeemCode`), redeemCodeValue);

        return redeemCodeIdValue;
    } catch (error) {
        throw new Error("Error creating redeem code: ", error);
    }
};

export const updateRedeemCode = async (redeemCodeId, status) => {
    try {
        await set(ref(database, `RedeemCode/${redeemCodeId}/status`), status);
        return true;
    } catch (error) {
        throw new Error("Error updating redeem code: ", error);
    }
};

export const updateRedeemMerchandise = async (redeemCodeId, merchandise) => {
    try {
        await set(ref(database, `RedeemCode/${redeemCodeId}/merchandise`), merchandise);
        return true;
    } catch (error) {
        throw new Error("Error updating redeem merchandise: ", error);
    }
};

export const checkRedeemCodeById = async (redeemCodeId) => {
    try {
        const redeemCode = await get(ref(database, `RedeemCode/${redeemCodeId}`));
        return redeemCode.val();
    } catch (error) {
        throw new Error("Error checking redeem code status: ", error);
    }
};

export const getRedeemCodeByUser = async (user) => {
    try {
        const redeemCode = await get(ref(database, `Users/${user}/redeemCode`));
        return redeemCode.val();
    } catch (error) {
        throw new Error("Error getting redeem code by user: ", error);
    }
};

export const getRedeemByPage = async (pageSize) => {
    const redeemCodeRef = ref(database, "RedeemCode");
    const redeemCodeQuery = query(redeemCodeRef, orderByChild("createdAt"), limitToLast(pageSize));
    const snapshot = await get(redeemCodeQuery);

    if (snapshot.exists()) {
        const redeemCodeData = snapshot.val();
        return Object.keys(redeemCodeData)
            .sort((a, b) => redeemCodeData[b].createdAt.localeCompare(redeemCodeData[a].createdAt))
            .map((key) => ({
                id: key,
                ...redeemCodeData[key],
            }));
    } else {
        console.log("No redeem code available");
        return [];
    }
};

export const getAllRedeemCode = async () => {
    try {
        const redeemCode = await get(ref(database, `RedeemCode`));
        const redeemCodes = redeemCode.val();
        return Object.keys(redeemCodes).map((key) => ({ id: key, ...redeemCodes[key] }));
    } catch (error) {
        throw new Error("Error getting all redeem code: ", error);
    }
};

export const getRedeemCodeCount = async () => {
    try {
        const redeemCode = await get(ref(database, `count/RedeemCode`));
        return redeemCode.val();
    } catch (error) {
        throw new Error("Error getting redeem code count: ", error);
    }
};

export const deleteRedeemCode = async (redeemCodeId) => {
    try {
        await set(ref(database, `RedeemCode/${redeemCodeId}`), null);
        return true;
    } catch (error) {
        throw new Error("Error deleting redeem code: ", error);
    }
};

export const searchRedeemCode = async (redeemCodeId) => {
    try {
        const dbRef = ref(database, `RedeemCode/${redeemCodeId}`);
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error) {
        throw new Error(`Error searching redeem code: ${error.message}`);
    }
};
