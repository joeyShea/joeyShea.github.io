import { useEffect, useState } from "react";

export default function useVisitorID() {
  const initialID = sessionStorage.getItem("visitorID") || crypto.randomUUID();
  const [visitorID] = useState(initialID);

  useEffect(() => {
    sessionStorage.setItem("visitorID", visitorID);
  }, [visitorID]);

  return visitorID;
}
