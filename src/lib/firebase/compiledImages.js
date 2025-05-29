import { ref, set, get } from "firebase/database";
import { database } from "./firebase";
import { uploadSingleFile } from "./utils";

export const getCompiledImagesCount = async () => {
    const artworkRef = ref(database, `count/CompiledImages`);
    const snapshot = await get(artworkRef);
    return snapshot.val() || 0;
};

export const removeAllCompiledImages = async () => {
    const artworkRef = ref(database, `CompiledImages`);
    const artworkCountRef = ref(database, `count/CompiledImages`);
    set(artworkRef, null);
    set(artworkCountRef, 0);
};

export const createCompiledImage = async (file) => {
    const createdAt = new Date().toISOString();
    const imageUrl = await uploadSingleFile(file, "compiledimages");

    const artworkCountRef = ref(database, `count/CompiledImages`);
    const artworkCountSnapshot = await get(artworkCountRef);
    let artworkCount = artworkCountSnapshot.val() || 0;

    const newArtworkRef = ref(database, `CompiledImages/${artworkCount}`);
    await set(newArtworkRef, {
        title: file.name,
        image: imageUrl,
        createdAt,
    });

    artworkCount += 1;
    await set(artworkCountRef, artworkCount);
};

export const getAllCompiledImages = async () => {
    const snapshot = await get(ref(database, "CompiledImages"));
    const artworks = snapshot.val() || {};
    return Object.keys(artworks)
        .map((key) => ({
            id: key,
            ...artworks[key],
        }));
};