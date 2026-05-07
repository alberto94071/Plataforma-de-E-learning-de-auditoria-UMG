import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuditPro · Curso de Auditoría | UMG",
  description: "Plataforma interactiva de aprendizaje de Auditoría Financiera - Universidad Mariano Gálvez de Guatemala",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
