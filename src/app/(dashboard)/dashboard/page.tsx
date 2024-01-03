import React from "react";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import Dashboard from "@/components/extended/Dashboard";
import MaxWidthWrapper from "@/components/extended/MaxWidthWrapper";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const DashboardPage = async () => {
  const user = await currentUser();
  const dbUser = await db.user.findFirst({
    where: {
      id: user?.id,
    },
  });
  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <MaxWidthWrapper>
      <Dashboard subscriptionPlan={subscriptionPlan} />
    </MaxWidthWrapper>
  );
};

export default DashboardPage;
