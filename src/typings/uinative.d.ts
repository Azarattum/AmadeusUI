declare global {
  interface Window {
    UINative?: {
      nativeAudio: () => void;
      feedback: (
        type:
          | "selection"
          | "light"
          | "medium"
          | "heavy"
          | "rigid"
          | "soft"
          | "success"
          | "warning"
          | "error"
      ) => void;
    };
  }
}

export {};
