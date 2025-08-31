"use client";
import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const WishListPage = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Log in to view your wishlist items. Don't miss out on your cart products to make the payment!" />
      )}
    </>
  );
};

export default WishListPage;
