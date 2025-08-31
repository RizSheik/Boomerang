"use client";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Logs, Wifi, WifiOff } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

const Header = () => {
  const { user, isAdmin, signOut, isOnline } = useAuth();
  const [ordersCount, setOrdersCount] = useState<number>(0);

  useEffect(() => {
    if (user) {
      // Fetch orders count when user is authenticated
      const fetchOrdersCount = async () => {
        try {
          const res = await fetch(`/api/orders/count?uid=${user.uid}`, {
            cache: "no-store",
          });
          const json = await res.json();
          setOrdersCount(json?.count ?? 0);
        } catch {
          setOrdersCount(0);
        }
      };
      
      fetchOrdersCount();
    } else {
      setOrdersCount(0);
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-50 py-4 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      {/* Offline Status Bar */}
      {!isOnline && (
        <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium">
          <WifiOff className="inline h-4 w-4 mr-2" />
          You're offline. Some features may not work properly.
        </div>
      )}
      
      <Container className="flex items-center justify-between text-foreground">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteButton />
          <ThemeToggle />

          {/* Online/Offline Status Indicator */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-yellow-600" />
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-90">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="rounded-full border border-border"
                  />
                ) : (
                  <span className="text-sm font-semibold hover:text-darkColor text-lightColor hoverEffect">
                    {user ? "Account" : "Login"}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="flex flex-col gap-1">
                {user && (
                  <Link href="/orders" className="px-2 py-1.5 rounded hover:bg-muted">
                    Orders
                  </Link>
                )}
                {isAdmin && (
                  <Link href="/admin" className="px-2 py-1.5 rounded hover:bg-muted">
                    Admin Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link href="/studio" className="px-2 py-1.5 rounded hover:bg-muted">
                    Sanity Studio
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={signOut}
                    className="text-left px-2 py-1.5 rounded hover:bg-muted"
                  >
                    Logout
                  </button>
                ) : (
                  <div className="px-2 py-1.5">
                    <SignIn />
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Container>
    </header>
  );
};

export default Header;
