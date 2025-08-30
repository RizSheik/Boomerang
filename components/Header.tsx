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
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Logs } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

const Header = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setPhotoURL(user.photoURL ?? null);
        try {
          const res = await fetch(`/api/orders/count?uid=${user.uid}`, {
            cache: "no-store",
          });
          const json = await res.json();
          setOrdersCount(json?.count ?? 0);
        } catch {
          setOrdersCount(0);
        }
      } else {
        setUserId(null);
        setPhotoURL(null);
        setOrdersCount(0);
      }
    });
    return () => unsub();
  }, []);

  return (
    <header className="sticky top-0 z-50 py-4 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
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

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-90">
                {photoURL ? (
                  <Image
                    src={photoURL}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="rounded-full border border-border"
                  />
                ) : (
                  <span className="text-sm font-semibold hover:text-darkColor text-lightColor hoverEffect">
                    {userId ? "Account" : "Login"}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <div className="flex flex-col gap-1">
                {userId && (
                  <Link href="/orders" className="px-2 py-1.5 rounded hover:bg-muted">
                    Orders
                  </Link>
                )}
                {userId && (
                  <Link href="/studio" className="px-2 py-1.5 rounded hover:bg-muted">
                    Admin
                  </Link>
                )}
                {userId ? (
                  <button
                    onClick={() => signOut(auth)}
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
