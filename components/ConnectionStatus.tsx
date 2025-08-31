"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { syncLocalRolesWithFirestore } from "@/lib/userRoles";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const ConnectionStatus = () => {
  const { isOnline, user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error("Cannot sync while offline");
      return;
    }

    setIsSyncing(true);
    try {
      await syncLocalRolesWithFirestore();
      toast.success("Data synced successfully!");
    } catch (error) {
      console.error("Manual sync failed:", error);
      toast.error("Sync failed. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  if (!user) return null; // Only show for authenticated users

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              Connection Status
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-yellow-600" />
              Offline Mode
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Connected to database</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-600">Using local storage</span>
              </>
            )}
          </div>
          
          {isOnline && (
            <Button
              onClick={handleManualSync}
              disabled={isSyncing}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              {isSyncing ? (
                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Sync Data
            </Button>
          )}
        </div>
        
        {!isOnline && (
          <p className="text-xs text-muted-foreground mt-2">
            Your data is stored locally. It will sync automatically when you're back online.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectionStatus;
