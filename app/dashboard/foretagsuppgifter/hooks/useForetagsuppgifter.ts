import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Foretag } from "../../../_server/db/schema/foretag";

interface UseForetagsuppgifterProps {
  foretag: Foretag | null;
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export function useForetagsuppgifter({ foretag, action }: UseForetagsuppgifterProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoUrl, setLogoUrl] = useState(foretag?.logoUrl || "");

  const [state, formAction, isPending] = useActionState<
    { success: boolean; error?: string } | null,
    FormData
  >(action, null);

  // Hantera logo upload
  const handleLogoUpload = (url: string) => {
    setLogoUrl(url);
  };

  // Auto-refresh vid success
  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  // Hantera utloggning
  const handleLoggaUt = async () => {
    setIsLoggingOut(true);
    try {
      const { authClient } = await import("../../../_lib/auth-client");
      await authClient.signOut();
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Fel vid utloggning:", error);
      setIsLoggingOut(false);
    }
  };

  return {
    // State
    logoUrl,
    isLoggingOut,
    state,
    isPending,

    // Actions
    formAction,
    handleLogoUpload,
    handleLoggaUt,
  };
}
