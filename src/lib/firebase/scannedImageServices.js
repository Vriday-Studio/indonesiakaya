import { ref, get, set } from "firebase/database";
import { database } from "./firebase";
import { getArtworkCount } from "./artwork";

export const addImageScannedByUser = async (user, imageId) => {
    try {
        const currentDate = new Date();
        const formattedTime = currentDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
        });

        const artworkRef = ref(database, `Artworks/${imageId}/users/${user.id}`);
        const snapshot = await get(artworkRef);
        const imageRef = ref(database, `Users/${user.id}/collection/${imageId}`);
        const artworkTitle = await get(ref(database, `Artworks/${imageId}/title`));
        const userCount = await get(ref(database, `Artworks/${imageId}/usersCount`));
        const scanLogCount = await get(ref(database, `Artworks/${imageId}/scanLogCount`));
        const scanArtworkLogRef = ref(database, `Artworks/${imageId}/scanLog/${scanLogCount.val() + 1}`);
        const todayServerScanCount = await get(ref(database, `TodayUsersIK/${formattedTime}/count/scan`));
        const todayServerLogScanRef = ref(database, `TodayUsersIK/${formattedTime}/scan/${todayServerScanCount.val() + 1}`);
        const dataUserScan = { id: user.id, Email: user.Email, Nama: user.Nama, scannedAt: currentDate.toISOString() };

        await set(artworkRef, dataUserScan);
        await set(scanArtworkLogRef, dataUserScan);
        await set(todayServerLogScanRef, { ...dataUserScan, artworkTitle: artworkTitle.val() });
        await set(imageRef, true);
        if (!snapshot.exists()) await set(ref(database, `Artworks/${imageId}/usersCount`), userCount.val() + 1);
        await set(ref(database, `Artworks/${imageId}/scanLogCount`), scanLogCount.val() + 1);
        await set(ref(database, `TodayUsersIK/${formattedTime}/count/scan`), todayServerScanCount.val() + 1);

        return true;
    } catch (error) {
        console.error("Error addImageScannedByUser: ", error);
        return false;
    }
};

const getUserCountByArtworkId = async (imageId) => {
    const snapshot = await get(ref(database, `Artworks/${imageId}/usersCount`));
    return snapshot.val();
}

const getScannedImagesByUser = async (userId) => {
    const userRef = ref(database, `Users/${userId}/collection`);
    const snapshot = await get(userRef);
    const data = snapshot.val();

    if (data) {
        return Object.keys(data);
    } else {
        return [];
    }
};

export const getCountFromTotal = async (userId) => {
    const data = await getScannedImagesByUser(userId);
    const artworkCount = await getArtworkCount();

    if (data && artworkCount) {
        return `${data.length} / ${artworkCount}`;
    } else {
        return 0;
    }
};
