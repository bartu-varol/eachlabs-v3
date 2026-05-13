'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Ctx = {
  minimized: boolean;
  setMinimized: (v: boolean) => void;
};

const Context = createContext<Ctx>({ minimized: false, setMinimized: () => {} });

export function AuthDevModeProvider({ children }: { children: ReactNode }) {
  const [minimized, setMinimized] = useState(false);
  return <Context.Provider value={{ minimized, setMinimized }}>{children}</Context.Provider>;
}

export function useAuthDevMode() {
  return useContext(Context);
}
