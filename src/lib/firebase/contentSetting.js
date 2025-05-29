import { get, ref, remove, set, update } from "firebase/database";
import { database } from "./firebase";
import { uploadMultipleImages } from "./utils";

export const getContentSettingCount = async (tag) => {
    const snapshot = await get(ref(database, `Settings/count/${tag}`));
    return snapshot.val();
};

export const getContentSettingByTag = async (tag, sort = "desc", isFilter = true) => {
    const snapshot = await get(ref(database, `Settings/${tag}`));
    const contentSettings = snapshot.val() || {};
    
    let sortedKeys = Object.keys(contentSettings);
    if (sort === "desc") {
        sortedKeys = sortedKeys.sort((a, b) => b.localeCompare(a));
    } else if (sort === "asc") {
        sortedKeys = sortedKeys.sort((a, b) => a.localeCompare(b));
    }
    
    let filteredSettings = sortedKeys
        .map((key) => ({
            id: key,
            ...contentSettings[key],
        }));
    
    if (isFilter) {
        filteredSettings = filteredSettings.filter((setting) => setting.status === true);
    }
    
    return filteredSettings;
};


export const createContentSetting = async ({ data }) => {
    const createdAt = new Date().toISOString();
    const { title, description, status, tag, images } = data;

    const imageUrls = images && (await uploadMultipleImages(images, "settings"));

    const settingContentCount = await get(ref(database, `Settings/count/${data.paramTag}`));
    const settingContentCountValue = settingContentCount.val() || 0;

    await set(ref(database, `Settings/${data.paramTag}/${settingContentCountValue + 1}`), {
        title,
        description,
        status,
        tag: tag || data.paramTag,
        images: imageUrls,
        createdAt,
        updatedAt: createdAt,
    });

    return await set(ref(database, `Settings/count/${data.paramTag}`), settingContentCountValue + 1);
};

export const getSelectedContentSetting = async ({ data }) => {
    const snapshot = await get(ref(database, `Settings/${data.tag}/${data.id}`));
    return snapshot.val();
};

export const updateContentSetting = async ({ data }) => {
    const updatedAt = new Date().toISOString();
    const { title, description, tag, status, images } = data;
    let imageUrls = null;

    if (images instanceof FileList) {
        imageUrls = await uploadMultipleImages(images, "settings");
    } else {
        imageUrls = images;
    }

    return update(ref(database, `Settings/${data.paramTag}/${data.id}`), {
        title,
        description,
        status,
        tag: tag || data.paramTag,
        images: imageUrls,
        updatedAt,
    });
};

export const deleteContentSetting = async ({ data }) => {
    return remove(ref(database, `Settings/${data.tag}/${data.id}`));
};
