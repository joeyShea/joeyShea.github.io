import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

interface UserStats {
  userID: string;
  distance: number;
  seconds: number;
  buttons: number;
  timestamp?: string;
}

const fetchAllStats = async (): Promise<UserStats[]> => {
  const userStatsCollection = collection(db, "userStats");

  try {
    const querySnapshot = await getDocs(userStatsCollection);
    const allStats: UserStats[] = querySnapshot.docs.map((doc) => ({
      userID: doc.id,
      ...doc.data(),
    })) as UserStats[]; // Explicitly type as UserStats[]

    return allStats;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return [];
  }
};


export default fetchAllStats;
