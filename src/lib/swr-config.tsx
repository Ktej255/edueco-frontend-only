"use client";

import { SWRConfig } from "swr";
import axios from "axios";
import React from "react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface SWRProviderProps {
  children: React.ReactNode;
}

export const SWRProvider = ({ children }: SWRProviderProps) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        dedupingInterval: 2000,
      }}
    >
      {children}
    </SWRConfig>
  );
};
