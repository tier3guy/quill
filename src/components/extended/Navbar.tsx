import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/components/extended/MaxWidthWrapper";
import { UserButton, auth } from "@clerk/nextjs";
import { buttonVariants } from "../ui/button";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  const { userId } = auth();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href={"/"} className="flex z-40 font-semibold text-3xl">
            quill.
          </Link>

          {/* TODO : ADD MOBILE NAVBAR */}

          <div className="hidden sm:flex items-center space-x-4">
            {!userId ? (
              <>
                <Link
                  href={"/pricing"}
                  className="hover:bg-gray-100 px-3 py-1 rounded-sm"
                >
                  Pricing
                </Link>
                <Link
                  href="/sign-in"
                  className="hover:bg-gray-100 px-3 py-1 rounded-sm"
                >
                  Sign In
                </Link>
                <Link
                  href={"/sign-up"}
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Get Started <ArrowRight />
                </Link>
              </>
            ) : (
              <>
                <Link href={"/dashboard"}>Dashboard</Link>
                <Link
                  href={"/pricing"}
                  className="hover:bg-gray-100 px-3 py-1 rounded-sm"
                >
                  Pricing
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
