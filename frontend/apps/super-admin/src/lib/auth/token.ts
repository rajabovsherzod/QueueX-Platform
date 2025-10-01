const TOKEN_KEY = "enavbat_access_token";

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

// Debug function to inspect localStorage
export const debugLocalStorage = () => {
  if (!isBrowser) return;

  console.log("=== LocalStorage Debug ===");
  console.log("Total items:", localStorage.length);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key!);
    console.log(
      `${i + 1}. Key: "${key}" | Value: ${
        value ? `"${value.substring(0, 50)}..."` : "null"
      }`
    );
  }

  // Specifically check our token key
  const ourToken = localStorage.getItem(TOKEN_KEY);
  console.log(
    `\nOur token key "${TOKEN_KEY}":`,
    ourToken ? "EXISTS" : "NOT FOUND"
  );

  // Check browser's Application tab equivalent
  console.log("\n=== Manual Check Instructions ===");
  console.log("1. Open DevTools (F12)");
  console.log("2. Go to Application tab");
  console.log("3. Click Local Storage");
  console.log(`4. Look for key: "${TOKEN_KEY}"`);
  console.log("========================");
};

export const tokenStorage = {
  // Access token methods
  getAccessToken: (): string | null => {
    if (!isBrowser) return null;

    // Debug: Check all localStorage keys
    console.log("All localStorage keys:", Object.keys(localStorage));

    const token = localStorage.getItem(TOKEN_KEY);
    console.log("Getting access token with key:", TOKEN_KEY);
    console.log(
      "Token found:",
      token ? `Yes (${token.substring(0, 20)}...)` : "No"
    );

    // Check if token exists with different key name
    const allKeys = Object.keys(localStorage);
    const tokenKeys = allKeys.filter(
      (key) => key.includes("token") || key.includes("access")
    );
    console.log("Token-related keys in localStorage:", tokenKeys);

    return token;
  },

  setAccessToken: (token: string): void => {
    if (!isBrowser) return;
    console.log("Setting access token with key:", TOKEN_KEY);
    console.log(
      "Token to save:",
      token ? `${token.substring(0, 20)}...` : "Empty token"
    );

    localStorage.setItem(TOKEN_KEY, token);

    // Verify immediately after setting
    const savedToken = localStorage.getItem(TOKEN_KEY);
    console.log("Verification - token saved successfully:", !!savedToken);
  },

  removeAccessToken: (): void => {
    if (!isBrowser) return;
    console.log("Removing access token");
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    const hasToken = !!tokenStorage.getAccessToken();
    console.log(
      "Checking authentication:",
      hasToken ? "Authenticated" : "Not authenticated"
    );
    return hasToken;
  },

  clearTokens: (): void => {
    if (!isBrowser) return;
    console.log("Clearing all tokens");
    localStorage.removeItem(TOKEN_KEY);
  },
};
