import { useCallback } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import useVisitorID from "./UseVisitorID";

const useSubmitStats = () => {
  const userID = useVisitorID();

  const submitStats = useCallback(async () => {
    if (!userID) {
      console.warn("No userID available, skipping stats submission.");
      return;
    }

    // Retrieve stats
    const myDistance = parseInt(sessionStorage.getItem("mouseDistance") || "0", 10);
    const myButtons = parseInt(sessionStorage.getItem("buttons") || "0", 10);

    // Calculate time spent
    const startTime = parseFloat(sessionStorage.getItem("startTime") || performance.now().toString());
    const mySeconds = Math.floor((performance.now() - startTime) / 1000);

    // Reference user document
    const userDocRef = doc(db, "userStats", userID);

    try {
      await setDoc(userDocRef, {
        distance: myDistance,
        seconds: mySeconds,
        buttons: myButtons,
        timestamp: new Date(),
      }, { merge: true });

      console.log("User stats submitted successfully!");
    } catch (error) {
      console.error(`Error updating stats for user ${userID}:`, error);
    }
  }, [userID]);

  return submitStats;
};

export default useSubmitStats;
