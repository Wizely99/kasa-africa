"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface Props {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: Readonly<Props>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}> 
     {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    {children} </QueryClientProvider>
  );
}
