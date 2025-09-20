import { FirebaseApp, initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBK-MYbL80nbzD4fFbdkv3X00f0dLTbMfw",
  authDomain: "push-notification-demo-dd790.firebaseapp.com",
  projectId: "push-notification-demo-dd790",
  storageBucket: "push-notification-demo-dd790.appspot.com",
  messagingSenderId: "522528984565",
  appId: "1:522528984565:web:72cf76e831c668c77624bc",
  measurementId: "G-S8K3CLE4RP",
};

export const firebaseApp: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
