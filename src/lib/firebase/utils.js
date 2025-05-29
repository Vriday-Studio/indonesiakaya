import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const uploadMultipleImages = async (files, folderName = "images") => {
    const arrayFiles = Array.from(files);
    const uploadPromises = arrayFiles.map(async (file) => {
        const storageRef = ref(storage, `${folderName}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    });

    return Promise.all(uploadPromises);
};

export const uploadSingleFile = async (file, folderName = "images") => {
    const storageRef = ref(storage, `${folderName}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}