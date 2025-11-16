/**
 * Detects the user's timezone using the browser's Intl API
 * Falls back to America/Sao_Paulo if detection fails
 */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error("Failed to detect timezone:", error);
    return "America/Sao_Paulo"; // Fallback to Brazil timezone
  }
}

/**
 * Gets timezone from localStorage or detects it
 * This can be used in client components
 */
export function getTimezone(): string {
  if (typeof window === "undefined") {
    return "America/Sao_Paulo";
  }

  const stored = localStorage.getItem("user_timezone");
  if (stored) {
    return stored;
  }

  const detected = detectTimezone();
  localStorage.setItem("user_timezone", detected);
  return detected;
}

/**
 * Stores timezone in localStorage and cookie for Google OAuth flow
 * Should be called before redirecting to Google
 */
export function storeTimezoneForOAuth(): void {
  if (typeof window !== "undefined") {
    const timezone = detectTimezone();
    localStorage.setItem("oauth_timezone", timezone);
    // Also store in cookie for server-side access
    document.cookie = `user_timezone=${timezone}; path=/; max-age=3600; SameSite=Lax`;
  }
}

/**
 * Retrieves timezone stored for OAuth flow
 * Should be called in the OAuth callback
 */
export function getTimezoneFromOAuth(): string {
  if (typeof window !== "undefined") {
    const timezone = localStorage.getItem("oauth_timezone");
    if (timezone) {
      localStorage.removeItem("oauth_timezone"); // Clean up
      return timezone;
    }
  }
  return "America/Sao_Paulo";
}
