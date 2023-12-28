import React from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="p-8 grid place-content-center">
      <SignUp afterSignInUrl={"/dashboard"} />
    </div>
  );
};

export default SignUpPage;
