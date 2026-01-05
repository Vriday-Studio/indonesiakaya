import { ref, query, get, orderByKey, limitToLast, set, orderByChild, startAt, endAt } from "firebase/database";
import { database } from "./firebase";

export const getUserCount = async () => {
    const usersCountRef = ref(database, "isPlayerCount");
    const snapshot = await get(usersCountRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log("No users found");
        return 0;
    }
};

export const getUsersFromStartNovember = async (endAtDate, startAtDate = "2024-11-01T00:00:00.000Z") => {
    const usersRef = ref(database, "Users");
    let userQuery;
    if (endAtDate) {
        userQuery = query(usersRef, orderByChild("lastLoggedIn"), startAt(startAtDate), endAt(endAtDate));
    } else {
        userQuery = query(usersRef, orderByChild("lastLoggedIn"), startAt(startAtDate));
    }
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
        const usersData = snapshot.val();
        return Object.keys(usersData)
            .filter(key => key !== null || key !== undefined || key !== "")
            .sort((a, b) => new Date(usersData[b].lastLoggedIn) - new Date(usersData[a].lastLoggedIn))
            .map((key) => ({
            id: key,
            ...usersData[key],
            }));
    } else {
        console.log("No users available");
        return [];
    }
};

export const getUsersByPage = async (pageSize) => {
    const usersRef = ref(database, "Users");
    const usersQuery = query(usersRef, orderByChild("lastLoggedIn"), limitToLast(pageSize));
    const snapshot = await get(usersQuery);

    if (snapshot.exists()) {
        const usersData = snapshot.val();
        return Object.keys(usersData)
            .sort((a, b) => {
                const dateA = usersData[a].lastLoggedIn ? new Date(usersData[a].lastLoggedIn) : new Date(0);
                const dateB = usersData[b].lastLoggedIn ? new Date(usersData[b].lastLoggedIn) : new Date(0);
                return dateB - dateA;
            })
            .map((key) => ({
                id: key,
                ...usersData[key],
            }));
    } else {
        console.log("No users available");
        return [];
    }
};


export const getSelectedUser = async (userId) => {
    const userRef = ref(database, `Users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log("No user found");
        return null;
    }
};

export const getSelectedUserPoints = async (userId, withTotal = true) => {
    const userRef = ref(database, `Users/${userId}/quiz`);
    const userProfilePointRef = ref(database, `Users/${userId}/points`);
    const userRedeeemCodeRef = ref(database, `Users/${userId}/redeemCode`);
    const quizRef = ref(database, `Quiz`);
    const snapshot = await get(userRef);
    const userProfilePointSnapshot = await get(userProfilePointRef);
    const userRedeemCodeSnapshot = await get(userRedeeemCodeRef);
    const quizSnapshot = await get(quizRef);

    const quizData = quizSnapshot.val();
    const totalPointFromQuiz = quizData ? Object.values(quizData).reduce((acc, curr) => acc + Number(curr.totalPoint), 0) : 420;
    if (snapshot.exists()) {
        if (userRedeemCodeSnapshot.exists()) {
            return 0;
        }
        const userQuiz = snapshot.val();
        const userProfilePoint = userProfilePointSnapshot.val();
        const totalPoint = Object.values(userQuiz).reduce((acc, curr) => acc + curr, 0);
        if (withTotal) {
            return `${totalPoint + userProfilePoint} / ${totalPointFromQuiz + 80}`;
        } else {
            return totalPoint + userProfilePoint;
        }
    } else if (userProfilePointSnapshot.exists()) {
        if (withTotal) {
            return `${userProfilePointSnapshot.val()} / ${totalPointFromQuiz + 80}`;
        } else {
            return userProfilePointSnapshot.val();
        }
    } else {
        if (withTotal) {
            return `0 / ${totalPointFromQuiz + 80}`;
        } else {
            return 0;
        }
    }
};

export const getSelecterUserPointByQuizId = async (userId, quizId) => {
    const userRef = ref(database, `Users/${userId}/quiz/${quizId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return 0;
    }
};

export const updateSelectedUser = async (userId, userData) => {
    try {
        const userRef = ref(database, `Users/${userId}`);
        const previousUser = await get(userRef);
        const updatedAt = new Date().toISOString();
        await set(userRef, {
            ...previousUser.val(),
            Nama: userData.name,
            Role: userData.role,
            Email: userData.email,
            Gender: userData.gender,
            Tanggal_Lahir: userData.birthdate,
            Hp: userData.phone,
            updatedAt,
        });
        return true;
    } catch (error) {
        console.log("Error updating user: ", error);
        return false;
    }
};

export const updateProfileUser = async (userId, userData) => {
    try {
        const userRef = ref(database, `Users/${userId}`);
        const previousUser = await get(userRef);
        const updatedAt = new Date().toISOString();
        await set(userRef, {
            ...previousUser.val(),
            Nama: userData.name,
            Gender: userData.gender,
            Tanggal_Lahir: userData.birthdate,
            Hp: userData.phone,
            points: userData.points,
            updatedAt,
        });
        return true;
    } catch (error) {
        console.log("Error updating user: ", error);
        return false;
    }
};

export const updateTermsUser = async (userId) => {
    try {
        const userRef = ref(database, `Users/${userId}`);
        const previousUser = await get(userRef);
        const updatedAt = new Date().toISOString();
        await set(userRef, {
            ...previousUser.val(),
            terms: true,
            updatedAt,
        });
        return true;
    } catch (error) {
        console.log("Error updating user: ", error);
        return false;
    }
};

export const deleteUser = async (userId) => {
    const userRef = ref(database, `Users/${userId}`);
    await set(userRef, null);
    return true;
};

export const searchUserByEmail = async (email) => {
    const usersRef = ref(database, "Users");
    const usersQuery = query(usersRef, orderByKey());
    const snapshot = await get(usersQuery);

    if (snapshot.exists()) {
        const usersData = snapshot.val();
        const user = Object.keys(usersData).find((key) => usersData[key].Email === email);
        return user ? { id: user, ...usersData[user] } : null;
    } else {
        console.log("No users available");
        return null;
    }
};
