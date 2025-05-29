import { endAt, get, orderByChild, query, ref, startAt } from "firebase/database";
import { database } from "./firebase";

export const getTodayServerFromStartNovember = async (endAtDate, startAtDate = "2024-11-01T00:00:00.000Z") => {
    const todayServerRef = ref(database, "TodayUsersIK");
    let todayServerQuery;

    if (endAtDate) {
        todayServerQuery = query(todayServerRef, orderByChild("date"), startAt(startAtDate), endAt(endAtDate));
    } else {
        todayServerQuery = query(todayServerRef, orderByChild("date"), startAt(startAtDate));
    }

    const snapshot = await get(todayServerQuery);

    if (snapshot.exists()) {
        const todayServerData = snapshot.val();
        return Object.keys(todayServerData).map((key) => ({
            ...todayServerData[key],
        }));
    } else {
        console.log("No todayServer available");
        return [];
    }
};
