"use client";

import { Button } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export default function DegenerativesID() {
  const { data: session, status } = useSession();
  return (
    <>
      <Button
        radius="full"
        variant="solid"
        color="primary"
        className="bg-foreground text-background"
        onClick={() => {
          signIn("twitter");
        }}
      >
        Sign in with X/Twitter
      </Button>
    </>
  );
}
