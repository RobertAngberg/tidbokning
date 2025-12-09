export function useBookingStatus() {
  const statusVariant = (status: string) => {
    switch (status) {
      case "Bekräftad":
        return "success" as const;
      case "Väntande":
        return "secondary" as const;
      case "Inställd":
        return "destructive" as const;
      case "Slutförd":
        return "outline" as const;
      default:
        return "default" as const;
    }
  };

  return { statusVariant };
}
