// src/app/(app)/layout.tsx
'use client';

import { ContextProvider } from '@/context/MyContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ContextProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ContextProvider>
  );
}