import React from "react";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import BillingForm from "@/components/extended/BillingForm";

const Billing = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subscriptionPlan={subscriptionPlan} />;
};

export default Billing;
