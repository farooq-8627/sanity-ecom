"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function AuthDebug() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [serverAuthState, setServerAuthState] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const checkServerAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth-check');
      const data = await response.json();
      setServerAuthState({
        status: response.status,
        data
      });
    } catch (error) {
      console.error("Error checking server auth:", error);
      setServerAuthState({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isLoaded) {
      checkServerAuth();
    }
  }, [isLoaded, isSignedIn]);
  
  if (!isLoaded) return <div>Loading auth state...</div>;
  
  return (
    <div className="p-4 border rounded-md bg-gray-50 my-4">
      <h2 className="text-lg font-bold mb-2">Auth Debug</h2>
      <div className="space-y-2 text-sm">
        <div><strong>Client Auth:</strong> {isSignedIn ? 'Signed In' : 'Signed Out'}</div>
        {isSignedIn && (
          <div>
            <strong>User:</strong> {user?.fullName} ({user?.primaryEmailAddress?.emailAddress})
          </div>
        )}
        <div className="mt-4">
          <strong>Server Auth:</strong> {loading ? 'Checking...' : serverAuthState ? 
            `Status: ${serverAuthState.status}, Authenticated: ${serverAuthState.data?.authenticated || false}` : 
            'Not checked'}
        </div>
        <Button 
          onClick={checkServerAuth} 
          disabled={loading}
          size="sm"
          variant="outline"
        >
          {loading ? 'Checking...' : 'Check Server Auth'}
        </Button>
      </div>
    </div>
  );
} 