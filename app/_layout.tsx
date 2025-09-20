import React, { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
// 🔥 Firebase
import { firebaseApp } from "@/services/firebaseConfig";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
// 🔔 Notifee for local notifications
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
// 📊 Mixpanel
import { initMixpanel, trackEvent, identifyUser } from "@/services/mixPanel";
import { storage } from "@/utils/storage";
import { sendTokenToServer } from "@/services/notifications";

SplashScreen.preventAutoHideAsync();

async function createNotificationChannel() {
  await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
  });
}

// Handle notification clicks → route user
function handleNotificationRouting(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {
  const data = remoteMessage.data;
  if (!data) return;

  // ✅ Chat notification with roomId
  if (data?.room_id) {
    router.push({
      pathname: "/(tabs)/chat/conversation",
    });
    return;
  }

  // ✅ Blogs / Notifications → blogs tab
  // if (["blogs", "notification"].includes(data.route)) {
  //   router.push("/(tabs)/blogs");
  //   return;
  // }

  // // ✅ Rewards / Quiz / Collection → quiz tab
  // if (["rewards", "quiz", "collection"].includes(data.route)) {
  //   router.push("/(tabs)/quiz");
  //   return;
  // }

  // ✅ Account / Referral → account tab
  // if (["account", "referral"].includes(data?.route)) {
  //   router.push("/(tabs)/account");
  //   return;
  // }

  // ✅ Default → Home
  router.push("/(tabs)/home");
}

export default function RootLayout() {

  const [userId, setUserId] = useState<string>("");
  useEffect(() => {
    let unsubscribeOnMessage: (() => void) | undefined;

    const getUserId = async () => {
      const id = await storage.getUserId();
      setUserId(id || "");
    }

    const setupApp = async () => {
      console.log("✅ Firebase initialized:", firebaseApp.name);

      // Initialize Mixpanel
      await initMixpanel();
      identifyUser(userId || ""); // Replace with logged-in user ID
      trackEvent("App Opened");

      // Setup notification channel
      await createNotificationChannel();

      // ✅ Request notification permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log("🔑 FCM Token:", token);
        try {
          const res = await sendTokenToServer(token);
          console.log("token sended to server: ", res);
        } catch (error) {
          throw error;
        }
      }

      // 🚀 Notifications opened from quit state
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        handleNotificationRouting(initialNotification);
      }

      // 🚀 Notifications opened from background
      messaging().onNotificationOpenedApp(remoteMessage => {
        handleNotificationRouting(remoteMessage);
      });

      // 🚀 Foreground notifications
      unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
        console.log("📩 Foreground message:", JSON.stringify(remoteMessage));

        const title =
          typeof remoteMessage.notification?.title === "string"
            ? remoteMessage.notification?.title
            : "New Notification";

        const body =
          typeof remoteMessage.notification?.body === "string"
            ? remoteMessage.notification?.body
            : "";

        // Show local notification
        await notifee.displayNotification({
          title,
          body,
          android: { channelId: "default" },
          data: remoteMessage.data,
        });
      });
    };

    getUserId();
    setupApp();

    return () => {
      if (unsubscribeOnMessage) unsubscribeOnMessage();
    };
  }, []);


  // ✅ Handle Notifee foreground tap events
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification?.data) {
        handleNotificationRouting({
          data: detail.notification.data,
          notification: detail.notification,
          messageId: detail.notification.id || "",
        } as any);
      }
    });
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0E0E0E" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="language-selection" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" translucent />
    </>
  );
}
