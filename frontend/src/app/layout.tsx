import type { Metadata } from "next";
// import { ViewTransition } from 'react'
// import { DM_Serif_Text } from "next/font/google";
import "./css/globals.css";
import ThemeProvider from "../context/ThemeContext/Theme-provider";
import ApolloWrapper from "@/src/components/ApolloWrapper";

//agregar otra fuente mas amigable visualmente
// const DST = DM_Serif_Text({
//   subsets: ["latin"], weight: "400"
// });


export const metadata: Metadata = {
  title: "ToDo",
  description: "Gestión de tareas personales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        // className={`${DST.className} antialiased`}
      >
        {/* <ViewTransition> */}
          <ApolloWrapper>
            <ThemeProvider>
                {children}
            </ThemeProvider>
          </ApolloWrapper>
        {/* </ViewTransition> */}
      </body>
    </html>
  );
}

