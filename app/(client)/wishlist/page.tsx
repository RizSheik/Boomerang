"use client";
import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const WishListPage = () => {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  return <>{uid ? <WishListProducts /> : <NoAccess details="Log in to view your wishlist items. Don’t miss out on your cart products to make the payment!" />}</>;
};

export default WishListPage;
