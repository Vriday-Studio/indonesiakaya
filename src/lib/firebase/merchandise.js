import { get, ref, set } from "firebase/database";
import { database } from "./firebase";

export const getMerchandiseCount = async () => {
  const snapshot = await get(ref(database, `count/merchandise`));
  return snapshot.val() || 0;
};

export const createMerchandise = async (data) => {
  const createdAt = new Date().toISOString();
  const { name, type } = data;

  const merchandiseCount = await get(ref(database, `count/merchandise`));
  const merchandiseCountValue = merchandiseCount.val() || 0;

  await set(ref(database, `Merchandise/${merchandiseCountValue + 1}`), {
      name,
      type,
      createdAt,
      updatedAt: createdAt,
  });

  return await set(ref(database, `count/merchandise`), merchandiseCountValue + 1);
};

export const updateMerchandise = async (id, data) => {
  const updatedAt = new Date().toISOString();
  const { name, type } = data;

  await set(ref(database, `Merchandise/${id}`), {
      name,
      type,
      updatedAt,
  });

  return true;
}

export const deleteMerchandise = async (id) => {
  return await set(ref(database, `Merchandise/${id}`), null);
}

export const getAllMerchandise = async () => {
  const snapshot = await get(ref(database, `Merchandise`));
  const merchandise = snapshot.val();

  if (!merchandise) {
      return [];
  }

  const sortedKeys = Object.keys(merchandise).sort((a, b) => new Date(merchandise[b].createdAt) - new Date(merchandise[a].createdAt));

  return sortedKeys
      .map((key) => ({
          id: key,
          ...merchandise[key],
      }));
};

export const getMerchandiseByType = async (type) => {
  const snapshot = await get(ref(database, `Merchandise`));
  const merchandise = snapshot.val();
  const sortedKeys = merchandise && Object.keys(merchandise).sort((a, b) => new Date(merchandise[b].createdAt) - new Date(merchandise[a].createdAt));

  return sortedKeys
      .map((key) => ({
          id: key,
          ...merchandise[key],
      }))
      .filter((item) => item.type === type);
}