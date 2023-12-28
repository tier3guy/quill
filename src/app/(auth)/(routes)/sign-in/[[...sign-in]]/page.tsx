import React from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="p-8 grid place-content-center">
      <SignIn afterSignInUrl={"/dashboard"} />
    </div>
  );
};

export default SignInPage;
