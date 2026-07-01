import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getSiteData() {
  try {
    const docRef = doc(db, "data", "siteData");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error reading site data from Firebase:", error);
    return null;
  }
}

// saveSiteData is no longer needed on the server side
// The admin dashboard will use Firebase client SDK directly to save data.
export async function saveSiteData(data: any) {
  throw new Error("saveSiteData should be called from the client side using Firebase SDK.");
}
