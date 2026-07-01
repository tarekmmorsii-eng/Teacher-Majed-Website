import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyBYBwnq2vBW4lwcuPh17JuiXAXiW8wCSgc",
  authDomain: "teacher-majed-website.firebaseapp.com",
  projectId: "teacher-majed-website",
  storageBucket: "teacher-majed-website.firebasestorage.app",
  messagingSenderId: "538821922126",
  appId: "1:538821922126:web:0bd8aba737d981da28a21f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const data = JSON.parse(fs.readFileSync("./data/siteContent.json", "utf-8"));

async function seed() {
  try {
    await setDoc(doc(db, "data", "siteData"), data);
    console.log("Successfully seeded database!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
