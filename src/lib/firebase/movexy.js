import { get, ref, set, update } from "firebase/database";
import { database } from "./firebase";
let lastItem = "";
let Koleksi = false;
let isEvent = false;
let jumlahkol = 0;
let grupTerpilih = 1;
let namaEvent = ""; // Variable untuk menyimpan nama event
export const updatepersecond = async (gender) => {
  let mg=gender;
  var gen="Demo";
  if(mg === "female"){
    gen="Demo2";
  }
  // Get isevent value from Firebase
  const eventRef = ref(database, `count/${gen}/isevent`);
  const snapshot = await get(eventRef);
  if (snapshot.exists()) {
      isEvent = snapshot.val();
  }
  const koleksiRef = ref(database, `count/${gen}/Koleksi`);
  const snapshotKol = await get(koleksiRef);
  if (snapshotKol.exists()) {
      Koleksi = snapshotKol.val();
  }

  const lastitemRef = ref(database, `count/itemTerkumpul`);
  const lastitemKol = await get(lastitemRef);
  if ( lastitemKol.exists()) {
  //  console.log="val last="+lastitemKol.val();
     lastItem= lastitemKol.val();
  }
  const grupitemRef = ref(database, `count/grupItem`);
  const grupitemKol = await get(grupitemRef);
  if ( grupitemKol.exists()) {
   // window.console.log('itemxy='+grupitemKol.val());
   // console.log="val last="+lastitemKol.val();
     grupTerpilih= grupitemKol.val();
  }
  // Get event name value from Firebase
  const eventNameRef = ref(database, `count/${gen}/event`);
  const eventSnapshot = await get(eventNameRef);
  if (eventSnapshot.exists()) {
      namaEvent = eventSnapshot.val();
  }

  return isEvent;
}
export const updatemove = async (x,y,gender) => {
    let mx=x;
    let my=y;
    let mg=gender;
    var gen="Demo";
    if(mg === "female"){
      gen="Demo2";
    }
  
    // Update the value in Firebase database
    await set(ref(database, `count/${gen}/moveX`), mx);
    await set(ref(database, `count/${gen}/moveY`), my);
    await onlineGender(mg, true);
    
}
export const KoleksitoFalse = async (gender) => {
  let mg=gender;
  var gen="Demo";
  if(mg === "female"){
    gen="Demo2";
  }
  await set(ref(database, `count/${gen}/Koleksi`), false);
}
export const TamuTrue = async (tamustr) => {
  var gen=tamustr;
  
  await set(ref(database, `count/tamuistana`), gen);
}
export const Raja4True = async (tamustr) => {
  var gen=tamustr;
  
  await set(ref(database, `count/Demo/isOnline`), gen);
}
export const setJumlahUserTamu = async (jumlah) => {
  var gen= parseInt(jumlah);
  
  await set(ref(database, `count/jumlahtamu`), gen);
}
export const getJumlahUserTamu = async () => {
  const jumlahRef = ref(database, `count/jumlahtamu`);
  const snapshot = await get(jumlahRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }else{
    return 0;
  }
}

export const KoleksiHitung = async (gender) => {
  let mg=gender;
  var gen="Demo";
  if(mg === "female"){
    gen="Demo2";
  }
  const jum = ref(database, `count/Koleksiraja`);
  const snapshot = await get(jum);
  if (snapshot.exists()) {
     jumlahkol =parseInt(snapshot.val()) ;
  }
}
export const getonlineGender = async (gender) => {
  let mg=gender;
  var gen="Demo";
  if(mg === "female"){
    gen="Demo2";
  }

  const snapshot = await get(ref(database, `count/${gen}/isOnline`));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return false;
}
export const onlineGender = async (gender, isOnline) => {
  let mg=gender;
  var gen="Demo";
  if(mg === "female"){
    gen="Demo2";
  }
  await set(ref(database, `count/${gen}/isOnline`), isOnline);
}

// Export isEvent dan namaEvent
export const getIsEvent = () => isEvent;
export const getNamaEvent = () => namaEvent;
export const getKoleksi = () => Koleksi;
export const getLastItem = () => lastItem;
export const getGrupItem = () => grupTerpilih;
export const getJumlahkol = () => jumlahkol;
export const chat = async (chtstring,gender) => {
  
  let cht=chtstring;
  let mg=gender;
  var gen="Demo";
  if(mg === "female"){
    gen="Demo2";
  }
   
  // Update the value in Firebase database
    await set(ref(database, `count/`+gen+`/ischat`), true);
     await set(ref(database, `count/`+gen+`/chat`), cht);
     // Mengupdate nilai chat

}

