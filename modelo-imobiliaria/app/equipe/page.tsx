import { Suspense } from "react";
import { TeamDashboard } from "@/components/team-dashboard";
export const metadata = { title: "Área da equipe" };
export default function TeamPage() { return <Suspense fallback={<main className="container editor-page">Preparando a equipe…</main>}><TeamDashboard /></Suspense>; }
