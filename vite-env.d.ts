/// <reference types="vite/client" />

// Type declarations for raw text file imports
declare module '*.txt?raw' {
  const content: string;
  export default content;
}
