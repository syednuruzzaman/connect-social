"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function DatabaseTest() {
  const { user } = useUser();
  const [dbStatus, setDbStatus] = useState("Testing...");

  useEffect(() => {
    if (user) {
      // Test if we can reach the database
      fetch('/api/test-db')
        .then(res => res.json())
        .then(data => {
          setDbStatus(data.success ? "Database connected!" : "Database error");
        })
        .catch(() => setDbStatus("Connection failed"));
    }
  }, [user]);

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <p className="text-sm text-blue-800">DB Status: {dbStatus}</p>
      {user && <p className="text-sm text-green-800">User: {user.firstName} {user.lastName}</p>}
    </div>
  );
}
