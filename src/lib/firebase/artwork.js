import { ref, set, get } from "firebase/database";
import { database } from "./firebase";
import { uploadMultipleImages } from "./utils";

export const getArtworkCount = async () => {
    const artworkRef = ref(database, `count/Artworks`);
    const snapshot = await get(artworkRef);
    return snapshot.val() || 0;
};

export const removeAllArtworks = async () => {
    const artworkRef = ref(database, `Artworks`);
    set(artworkRef, null);
};

export const createArtwork = async (data) => {
    const createdAt = new Date().toISOString();
    const { title, description, status, area, material, year, media, size, startAtIndex, endAtIndex, image } = data;
    const imageUrl = image ? await uploadMultipleImages(image, "artworks") : "";

    const targetIndex = Array.from({ length: Number(data.endAtIndex) - Number(data.startAtIndex) + 1 }, (_, i) => i + Number(data.startAtIndex));

    const artworkCount = await get(ref(database, `count/Artworks`));
    const artworkCountValue = artworkCount.val() || 0;

    await set(ref(database, `Artworks/${artworkCountValue + 1}`), {
        id: artworkCountValue + 1,
        title,
        description,
        status,
        area,
        material,
        year,
        media,
        size,
        targetIndex,
        startAtIndex,
        endAtIndex,
        image: imageUrl,
        createdAt,
        updatedAt: createdAt,
    });

    return await set(ref(database, `count/Artworks`), artworkCountValue + 1);
};

export const getAllArtworks = async () => {
    const snapshot = await get(ref(database, "Artworks"));
    const artworks = snapshot.val() || {};
    return Object.keys(artworks)
        .map((key) => ({
            id: key,
            ...artworks[key],
        }));
};

export const getSelectedArtwork = async (id) => {
    const snapshot = await get(ref(database, `Artworks/${id}`));
    return snapshot.val();
};

export const getSelectedArtworkByIndex = async (index) => {
    const snapshot = await get(ref(database, "Artworks"));
    const artworks = snapshot.val() || {};
    const selectedArtwork = Object.keys(artworks)
        .map((key) => ({
            id: key,
            ...artworks[key],
        }))
        .find((artwork) => artwork.targetIndex.includes(Number(index)));
    return selectedArtwork;
}

export const getArtworksNoQuiz = async (quizId) => {
    const snapshot = await get(ref(database, "Artworks"));
    const artworks = snapshot.val() || {};

    if (quizId === "create") {
        return Object.keys(artworks)
            .filter((key) => key !== "count")
            .map((key) => ({
                id: key,
                ...artworks[key],
            }))
            .filter((artwork) => !artwork.quiz);
    }

    const currentQuizData = await get(ref(database, `Quiz/${quizId}`));
    const currentQuiz = currentQuizData.val();

    const currentArtworkValue = await getSelectedArtwork(currentQuiz.artworkId);
    const mappedArtworksValue = {
        id: currentQuiz.artworkId,
        title: currentArtworkValue.title,
    }
    return [mappedArtworksValue, ...Object.keys(artworks)
            .filter((key) => key !== "count")
            .map((key) => ({
                id: key,
                ...artworks[key],
            }))
            .filter((artwork) => !artwork.quiz)];
};

export const updateArtwork = async (id, data) => {
    const updatedAt = new Date().toISOString();
    const previousArtwork = await getSelectedArtwork(id);
    let imageUrl = null;
    if (data.image instanceof FileList) {
        imageUrl = await uploadMultipleImages(data.image, "artworks");
    } else {
        imageUrl = data.image;
    }

    const targetIndex = Array.from({ length: Number(data.endAtIndex) - Number(data.startAtIndex) + 1 }, (_, i) => i + Number(data.startAtIndex));
    return await set(ref(database, `Artworks/${id}`), {
        ...data,
        users: previousArtwork.users || {},
        usersCount: previousArtwork.usersCount || 0,
        quiz: previousArtwork.quiz || {},
        image: imageUrl,
        targetIndex,
        updatedAt,
    });
};
