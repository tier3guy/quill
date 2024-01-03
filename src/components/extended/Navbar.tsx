import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import {
  currentUser,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "@/components/extended/UserAccountNav";
import MobileNav from "@/components/extended/MobileNav";

const Navbar = async () => {
  const user = await currentUser();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span className="text-2xl">quill.</span>
          </Link>

          <MobileNav isAuth={!!user} />

          <div className="hidden items-center space-x-6 sm:flex">
            {!user ? (
              <>
                <Link href="/pricing">Pricing</Link>
                <SignInButton>Sign in</SignInButton>
                <SignUpButton>
                  <div className="flex items-center cursor-pointer">
                    Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                  </div>
                </SignUpButton>
              </>
            ) : (
              <>
                <Link href="/dashboard">Dashboard</Link>

                <UserAccountNav
                  name={
                    !user.firstName || !user.lastName
                      ? "Your Account"
                      : `${user.firstName} ${user.lastName}`
                  }
                  email={
                    user.emailAddresses.length > 0
                      ? user.emailAddresses[0].emailAddress
                      : ""
                  }
                  imageUrl={user.imageUrl ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
