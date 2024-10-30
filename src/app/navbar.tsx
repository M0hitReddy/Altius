"use client";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const session = useSession();
  return (
    <>
      <div className="w-full p-4 flex border-b">
        <div className="flex gap-3 self-end w-max">
          {/* {!session && <Button variant="outline">Sign in</Button>} */}
          {session && (
            <Button variant="default" onClick={() => signOut()}>
              Log out
            </Button>
          )}
          {!session && (
            <Button variant="default" onClick={() => signIn()}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
