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
export const getSelectedUserFinishGame = async (userId) => {
    const userRef = ref(database, `Users/${userId}/finishedGame`);
    const snapshot = await get(userRef);
  
    if (snapshot.exists()) {
    
        return snapshot.val();
    } else {
        console.log("No user found");
        return null;
    }
};
export const setFinishArundaya = async (userId, pernah) => {
    try {
        const userRef = ref(database, `Users/${userId}/finishedArundaya`);
        await set(userRef , pernah);
    
    }catch (error) {
        console.log("Error updating FinishArundaya user: ", error);
        return false;
    }
}
export const getFinishArundaya = async (userId) => {
    const userRef = ref(database, `Users/${userId}/finishedArundaya`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : false;
}
export const setFinishQuizLutung = async (userId, pernah) => {
    try {
        const userRef = ref(database, `Users/${userId}/finishedQuizLutung`);
        await set(userRef , pernah);
    
    }catch (error) {
        console.log("Error updating quizlutung user: ", error);
        return false;
    }
}
export const setFinishQuizRaja = async (userId, pernah) => {
    try {
        const userRef = ref(database, `Users/${userId}/finishedQuizRaja`);
        await set(userRef , pernah);
    
    }catch (error) {
        console.log("Error updating quizRaja user: ", error);
        return false;
    }
}
export const setFinishArungi = async (userId, pernah) => {
    try {
        const userRef = ref(database, `Users/${userId}/finishedArungi`);
        await set(userRef , pernah);
    
    }catch (error) {
        console.log("Error updating arungi user: ", error);
        return false;
    }
}
export const setOnlineArundaya = async (userId, isOnline) => {
    try {
        const userRef = ref(database, `Users/${userId}/ismove`);
        await set(userRef , isOnline);
    
    }catch (error) {
        console.log("Error updating arungi user: ", error);
        return false;
    }
}
export const getSelectedUserFinishArungi = async (userId) => {
    const userRef = ref(database, `Users/${userId}/finishedArungi`);
    const snapshot = await get(userRef);
    console.log("usersnap"+userId);
    if (snapshot.exists()) {
      setFinishArungi(userId, true);
        return true;
    } else {
        setFinishArungi(userId, false);
        console.log("No data found");
        return false;
    }
};
export const getSelectedUserFinishQuizLutung = async (userId) => {
    const userRef = ref(database, `Users/${userId}/finishedQuizLutung`);
    const snapshot = await get(userRef);
    console.log("usersnap"+userId);
    if (snapshot.exists()) {
      setFinishQuizLutung(userId,true);
        return true;
    } else {
       setFinishQuizLutung(userId,false);
        console.log("No data found");
        return false;
       
    }
};
export const getSelectedUserFinishQuizRaja = async (userId) => {
    const userRef = ref(database, `Users/${userId}/finishedQuizRaja`);
    const snapshot = await get(userRef);
    console.log("usersnap"+userId);
    if (snapshot.exists()) {
      setFinishQuizRaja(userId,true);
        return true;
    } else {
        setFinishQuizRaja(userId,false);
        console.log("No data found");
        return false;
       
    }
};
export const getSelectedUserFinishArundaya = async (userId) => {
    const userRef = ref(database, `Users/${userId}/finishedArundaya`);
    const snapshot = await get(userRef);
    console.log("usersnap"+userId);
    if (snapshot.exists()) {
        setFinishArundaya(userId,true);
        return true;
    } else {
        setFinishArundaya(userId,false);
        console.log("No data found");
        return false;
       
    }
};
export const getSelectedUserPoints = async (userId, withTotal = true) => {
   // const userRef = ref(database, `Users/${userId}/quiz/totalPoint`);
    const userProfilePointRef = ref(database, `Users/${userId}/profilePoints`);
    const userkuislutungPointRef = ref(database, `Users/${userId}/kuisLutungPoints`);
    const userkuisraja4PointRef = ref(database, `Users/${userId}/kuisRaja4Points`);
    const usergamelutungPointRef = ref(database, `Users/${userId}/gameLutungPoints`);
    const usergameraja4PointRef = ref(database, `Users/${userId}/gameRaja4Points`);
    const userRedeeemCodeRef = ref(database, `Users/${userId}/redeemCode`);
  //  const quizRef = ref(database, `Quiz`);
    const snapshot = await get(userProfilePointRef);
    const userProfilePointSnapshot = await get(userProfilePointRef);
    if (snapshot.exists()) {
        const snapshotkuisLutung = await get(userkuislutungPointRef);
        const snapshotkuisRaja4 = await get(userkuisraja4PointRef);
        const snapshotgameLutung = await get(usergamelutungPointRef);
        const snapshotgameRaja4 = await get(usergameraja4PointRef);
        const totalPoint = snapshot.val() + snapshotkuisLutung.val() + snapshotkuisRaja4.val() + snapshotgameLutung.val() + snapshotgameRaja4.val();
        return totalPoint;

    } else {
        // Inisialisasi semua point references ke 0 jika tidak ada
        await set(userProfilePointRef, 0);
        await set(userkuislutungPointRef, 0);
        await set(userkuisraja4PointRef, 0);
        await set(usergamelutungPointRef, 0);
        await set(usergameraja4PointRef, 0);
        return 0;
    }
 
};
export const setprofilPoint= async (userId, point) => {
    const userRef = ref(database, `Users/${userId}/profilePoints`);
    await set(userRef, point);
}
export const getkuisRaja4Point= async (userId) => {
    const userRef = ref(database, `Users/${userId}/kuisRaja4Points`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : 0;
}
export const getkuisLutungPoint= async (userId) => {
    const userRef = ref(database, `Users/${userId}/kuisLutungPoints`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : 0;
}
export const setkuisLutungPoint= async (userId, point) => {
    const userRef = ref(database, `Users/${userId}/kuisLutungPoints`);
    await set(userRef, point);
}
export const setkuisRaja4Point= async (userId, point) => {
    const userRef = ref(database, `Users/${userId}/kuisRaja4Points`);
    await set(userRef, point);
}
export const setgameLutungPoint= async (userId, point) => {
    const userRef = ref(database, `Users/${userId}/gameLutungPoints`);
    await set(userRef, point);
}
export const setgameRaja4Point= async (userId, point) => {
    const userRef = ref(database, `Users/${userId}/gameRaja4Points`);
    await set(userRef, point);
}   
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
export const getIsAlreadySetProfil = async (userId) => {
    const userRef = ref(database, `Users/${userId}/isAlreadySetProfil`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return false;
    }
}
export const setIsAlreadySetProfil = async (userId, isAlreadySetProfil) => {
    const userRef = ref(database, `Users/${userId}/isAlreadySetProfil`);
    await set(userRef, isAlreadySetProfil);
}
export const updateProfileSkor = async (userId,  userData) => {
    try {
        const userRef = ref(database, `Users/${userId}`);
        const previousUser = await get(userRef);
        const updatedAt = new Date().toISOString();
        await set(userRef, {
            points: userData.points,
        });
        return true;
    } catch (error) {
        console.log("Error updating user: ", error);
        return false;
    }
}
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
            profilepoints: userData.points,
            updatedAt,
        });
        return true;
    } catch (error) {
        console.log("Error updating user: ", error);
        return false;
    }
};
export const updateProfileUsernoscore = async (userId, userData) => {
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

export const updateUserPoints = async (userId, pointsToAdd) => {
    //const userRef = ref(database, `Users/${userId}/quiz`);
    const userProfilePointRef = ref(database, `Users/${userId}/points`);

   // const userQuizSnapshot = await get(userRef);
    const userProfilePointSnapshot = await get(userProfilePointRef);

    let totalPoint = 0;

    //if (userQuizSnapshot.exists()) {
   //     const userQuiz = userQuizSnapshot.val();
    //    totalPoint = Object.values(userQuiz).reduce((acc, curr) => acc + curr, 0);

   // }
   if (userProfilePointSnapshot.exists()) {
      const usertot =userProfilePointSnapshot.val();
       totalPoint = usertot;
        console.log("updatetotal="+totalPoint);
   }
    // Update total point
    let newTotalPoint = totalPoint + pointsToAdd;
    if(newTotalPoint>500){
        newTotalPoint = 500;
    }

   
  await set(userProfilePointRef, newTotalPoint);
 // await updateProfileUser(userId, { Gender: "male", points: newTotalPoint });
    // Simpan kembali ke database
  //  await set(userRef, {
       // ...userQuizSnapshot.val(),
     //   totalPoint: newTotalPoint, // Update totalPoint
  //  });

    // Update poin di profile
   //const currentProfilePoints = userProfilePointSnapshot.exists() ? userProfilePointSnapshot.val() : 0;
   //await set(userProfilePointRef, newTotalPoint);
};

export const getMaxScoreQuizLutung = async (userId) => {
    const userRef = ref(database, `Users/${userId}/maxScoreQuizLutung`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : 0;
};

export const setMaxScoreQuizLutung = async (userId, score) => {
    const userRef = ref(database, `Users/${userId}/maxScoreQuizLutung`);
    await set(userRef, score);
};

export const getMaxScoreQuizRaja = async (userId) => {
    const userRef = ref(database, `Users/${userId}/maxScoreQuizRaja`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : 0;
};

export const setMaxScoreQuizRaja = async (userId, score) => {
    const userRef = ref(database, `Users/${userId}/maxScoreQuizRaja`);
    await set(userRef, score);
};
