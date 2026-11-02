import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function trackWebsiteVisit() {
  if (typeof window === "undefined") return;

  // Prevent multiple double counts within the same browser session
  const sessionKey = "astro_motion_visited_session";
  const hasVisited = sessionStorage.getItem(sessionKey);

  try {
    const statsRef = doc(db, "stats", "website");

    if (!hasVisited) {
      sessionStorage.setItem(sessionKey, "true");
      await setDoc(
        statsRef,
        {
          pageViews: increment(1),
          uniqueVisits: increment(1),
          totalDownloadsKB: increment(320), // Estimated average page payload transfer
          lastVisitedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      await setDoc(
        statsRef,
        {
          pageViews: increment(1),
          totalDownloadsKB: increment(150),
          lastVisitedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    // Ignore background tracking errors if Firestore rules restricted or offline
  }
}
