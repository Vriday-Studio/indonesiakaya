import { database } from "./firebase";
import { ref, set, get } from "firebase/database";
import { uploadSingleFile } from "./utils";

export const createQuiz = async (data) => {
    try {
        const createdAt = new Date().toISOString();
        const { questions } = data;

        const quizCount = await get(ref(database, `count/QuizAR`));
        let quizCountValue = quizCount.val() || 0;

        if (questions.length > 0) {
            const updatedQuestions = await Promise.all(
                questions.map(async (question) => {
                    if (question.image && question.image.length > 0) {
                        if (typeof question.image[0] === "object") {
                            const file = question.image[0];
                            const downloadURL = await uploadSingleFile(file, `quiz/${quizCountValue}/questions`);
                            return { ...question, image: downloadURL };
                        }
                    }
                    return question;
                })
            );

            const totalPoint = updatedQuestions.reduce((acc, curr) => acc + Number(curr.point), 0);

            const quizData = { ...data, id: quizCountValue, questions: updatedQuestions, totalPoint, createdAt };
            await set(ref(database, `Quiz/${quizCountValue}`), quizData);
            await set(ref(database, `Artworks/${data.artworkId}/quiz`), quizData);

            quizCountValue += 1;
            await set(ref(database, `count/QuizAR`), quizCountValue);

            return true;
        }

        await set(ref(database, `Quiz/${quizCountValue}`), { ...data, createdAt });
        await set(ref(database, `Artworks/${data.artworkId}/quiz`), data);

        quizCountValue += 1;
        await set(ref(database, `count/QuizAR`), quizCountValue);

        return true;
    } catch (error) {
        throw new Error("Error creating quiz: ", error);
    }
};

export const updateQuiz = async (data, quizId) => {
    try {
        const updatedAt = new Date().toISOString();
        const { questions } = data;

        const previousQuiz = await get(ref(database, `Quiz/${quizId}`));
        const previousQuizData = previousQuiz.val();

        if (questions.length > 0) {
            const updatedQuestions = await Promise.all(
                questions.map(async (question) => {
                    if (question.image && question.image.length > 0) {
                        if (typeof question.image[0] === "object") {
                            const file = question.image[0];
                            const downloadURL = await uploadSingleFile(file, `quiz/${quizId}/questions`);
                            return { ...question, image: downloadURL };
                        }
                    }
                    return question;
                })
            );

            const totalPoint = updatedQuestions.reduce((acc, curr) => acc + Number(curr.point), 0);

            const quizData = { ...previousQuizData, artworkId: data.artworkId, title: data.title, id: quizId, questions: updatedQuestions, totalPoint, updatedAt };
            await set(ref(database, `Quiz/${quizId}`), quizData);
            await set(ref(database, `Artworks/${data.artworkId}/quiz`), quizData);

            if (previousQuizData.artworkId !== data.artworkId) {
                await set(ref(database, `Artworks/${previousQuizData.artworkId}/quiz`), null);
            }

            return true;
        }

        await set(ref(database, `Quiz/${quizId}`), { ...data, updatedAt });
        await set(ref(database, `Artworks/${data.artworkId}/quiz`), data);

        return true;
    } catch (error) {
        throw new Error("Error updating quiz: ", error);
    }
};

export const getQuiz = async (quizId) => {
    const quizRef = ref(database, `Quiz/${quizId}`);
    const snapshot = await get(quizRef);

    if (!snapshot.exists()) {
        throw new Error("Quiz not found for this artwork");
    }

    return snapshot.val();
};

export const getQuizListUser = async (quizId) => {
    const quizRef = ref(database, `Quiz/${quizId}/users`);
    const snapshot = await get(quizRef);

    if (!snapshot.exists()) {
        throw new Error("Quiz not found for this artwork");
    } else {
        const users = snapshot.val();
        const sortedUsers = Object.values(users).sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt));
        return sortedUsers;
    }
};


export const getQuizByArtworkId = async (artworkId) => {
    const quizRef = ref(database, `Artworks/${artworkId}/quiz`);
    const snapshot = await get(quizRef);

    if (!snapshot.exists()) {
        throw new Error("Quiz not found for this artwork");
    }

    return snapshot.val();
};

export const getAllQuiz = async () => {
    const snapshot = await get(ref(database, "Quiz"));
    const quizzes = snapshot.val() || {};
    return Object.keys(quizzes)
        .map((key) => ({
            id: key,
            ...quizzes[key],
        }));
};

export const getQuizCount = async () => {
    const quizRef = ref(database, `count/QuizAR`);
    const snapshot = await get(quizRef);
    return snapshot.val();
};

export const deleteQuiz = async (quizId) => {
    try {
        const currentQuizData = await get(ref(database, `Quiz/${quizId}`));
        const currentQuiz = currentQuizData.val();
        
        await set(ref(database, `Quiz/${quizId}`), null);
        await set(ref(database, `Artworks/${currentQuiz.artworkId}/quiz`), null);
        return true;
    } catch (error) {
        throw new Error("Error deleting quiz: ", error);
    }
};

export const addSolvedQuiz = async (user, quizId, point) => {
    try {
        const { id, Email, Nama } = user;

        const userQuizRef = ref(database, `Users/${id}/quiz/${quizId}`);
        const userQuizAttemptRef = ref(database, `Users/${id}/quizAttempt/${quizId}`);
        const quizRef = ref(database, `Quiz/${quizId}/users/${id}`);
        const countUserRef = ref(database, `Quiz/${quizId}/usersCount`);
        const countUser = await get(countUserRef);
        const countQuizAttempt = await get(userQuizAttemptRef);

        await set(userQuizRef, point);
        await set(userQuizAttemptRef, countQuizAttempt.val() + 1);
        await set(quizRef, { id, Email, Nama, point, solvedAt: new Date().toISOString() });
        await set(countUserRef, countUser.val() + 1);
        return true;
    } catch (error) {
        throw new Error("Error adding solved quiz: ", error);
    }
};

export const getUserQuizAttempt = async (userId, quizId) => {
    const userQuizAttemptRef = ref(database, `Users/${userId}/quizAttempt/${quizId}`);
    const snapshot = await get(userQuizAttemptRef);
    return snapshot.val();
}

export const getMinimalPointQuiz = async () => {
    const snapshot = await get(ref(database, `Settings/quizMinimalPoint`));
    return snapshot.val();
};

export const getCanClaim = async () => {
    const snapshot = await get(ref(database, `Settings/canClaim`));
    return snapshot.val();
};

export const setRedeemSettings = async (data) => {
    try {
        await set(ref(database, `Settings/quizMinimalPoint`), data.point);
        await set(ref(database, `Settings/canClaim`), data.canClaim);
        return true;
    } catch (error) {
        throw new Error("Error setting minimal point: ", error);
    }
};
