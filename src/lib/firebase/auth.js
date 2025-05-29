import {
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    FacebookAuthProvider,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    verifyPasswordResetCode,
} from "firebase/auth";
import { auth, database } from "./firebase";
import { equalTo, get, orderByChild, query, ref, set } from "firebase/database";
import { getUserCount } from "./users";

export const addLogUserLogin = async (userId, dataUser) => {
    const currentDate = new Date();
    const formattedTime = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        timeZone: "Asia/Jakarta",
    });

    const user = { id: dataUser.id || userId, Email: dataUser.Email, Nama: dataUser.Nama, lastLoggedIn: currentDate.toISOString() };

    const logsCount = await get(ref(database, `Users/${userId}/logsCount`));
    const todayUsersCount = await get(ref(database, `TodayUsersIK/${formattedTime}/count/login`));

    await set(ref(database, `Users/${userId}/lastLoggedIn`), currentDate.toISOString());
    await set(ref(database, `Users/${userId}/logs/${logsCount.val() + 1}`), currentDate.toISOString());
    await set(ref(database, `Users/${userId}/logsCount`), logsCount.val() + 1);
    await set(ref(database, `TodayUsersIK/${formattedTime}/date`), currentDate.toISOString());
    await set(ref(database, `TodayUsersIK/${formattedTime}/users/${todayUsersCount.val() + 1}`), user);
    await set(ref(database, `TodayUsersIK/${formattedTime}/count/login`), todayUsersCount.val() + 1);
};

export const getUserByEmail = async (email, specificKey) => {
    const usersRef = ref(database, "Users");
    const queryRef = query(usersRef, orderByChild("Email"), equalTo(email));

    try {
        const snapshot = await get(queryRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const userId = Object.keys(userData)[0];
            const user = Object.values(userData)[0];
            return specificKey ? user[specificKey] : { ...user, id: user.id || userId };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error mengambil data user:", error);
        return null;
    }
};

export const signUp = async (data) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
        updateProfile(res.user, { displayName: data.name });
        const usersCount = await getUserCount();
        const createdAt = new Date().toISOString();

        const newUserId = Number(usersCount) + 1;
        const userRef = ref(database, `Users/${newUserId}`);
        const detailProfile = {
            ...(data.birthdate && { Tanggal_Lahir: data.birthdate }),
            ...(data.phone && { Hp: data.phone }),
            ...(data.gender && { Gender: data.gender }),
        };

        const dataUser = {
            Nama: data.name,
            terms: true,
            Role: "user",
            ...detailProfile,
            Email: res.user.email,
            uid: res.user.uid,
            id: newUserId,
            createdAt,
            updatedAt: createdAt,
        }

        await set(userRef, dataUser);

        const usersCountRef = ref(database, "isPlayerCount");
        await set(usersCountRef, newUserId);

        await addLogUserLogin(newUserId, dataUser);

        return true;
    } catch (error) {
        console.error("Error sign up:", error);
        throw error;
    }
};

export const signIn = async (data) => {
    try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        const user = await getUserByEmail(data.email);

        await addLogUserLogin(user.id, user);

        return true;
    } catch (error) {
        console.error("Error sign in:", error);
        throw error;
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Error logout:", error);
        throw error;
    }
};

export const authWithProvider = async (selectedProvider, loginUser) => {
    const provider = selectedProvider === "google" ? new GoogleAuthProvider() : new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    try {
        const userData = await getUserByEmail(user.email);
        if (!userData) {
            const usersCount = await getUserCount();
            const newUserId = Number(usersCount) + 1;

            const createdAt = new Date().toISOString();
            const userRef = ref(database, `Users/${newUserId}`);
            const updatedDataUser = {
                Nama: user.displayName,
                Email: user.email,
                Role: "user",
                uid: user.uid,
                id: newUserId,
                createdAt,
                updatedAt: createdAt,
            };
            await set(userRef, updatedDataUser);

            loginUser({
                user: updatedDataUser,
                redirect: "/",
            });

            const usersCountRef = ref(database, "isPlayerCount");
            await set(usersCountRef, newUserId);

            await addLogUserLogin(newUserId, updatedDataUser);

            return true;
        }

        await addLogUserLogin(userData.id, userData);
        if (!userData.terms) {
            return loginUser({
                user: userData,
                redirect: "/privacy-policy",
            });
        }
        loginUser({
            user: userData,
            redirect: "/",
        });

        return true;
    } catch (error) {
        console.error("Error authWithProvider: ", error);
        throw error;
    }
};

export const resetPassword = async (data) => {
    try {
        const user = await getUserByEmail(data.email.toLowerCase());
        if (!user) {
            throw new Error("User tidak ditemukan");
        }
        await sendPasswordResetEmail(auth, data.email);
        return true;
    } catch (error) {
        console.error("Error reset password:", error);
        throw error;
    }
};

export const verifyResetPasswordCode = async (oobCode) => {
    try {
        const emailUser = await verifyPasswordResetCode(auth, oobCode);
        return emailUser;
    } catch (error) {
        console.error("Error verify reset password code:", error);
        throw error;
    }
};

export const confirmResetPassword = async (data) => {
    try {
        await confirmPasswordReset(auth, data.oobCode, data.password);
        return true;
    } catch (error) {
        console.error("Error confirm reset password:", error);
        throw error;
    }
};
