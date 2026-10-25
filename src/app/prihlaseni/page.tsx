import { LoginForm } from "@/app/prihlaseni/LoginForm";
import { t } from "@/lib/i18n";
import type { Metadata } from "next";
import { Suspense } from "react";

export function generateMetadata(): Metadata {
  return { title: t().login.title };
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm copy={t().login} />
    </Suspense>
  );
}
