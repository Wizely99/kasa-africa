export const formatLocalizedDateTime = (date: Date | string): string => {

    
    const dateObj = new Date(date); // Convert string to Date object if needed
  
    return dateObj.toLocaleString('en-US', {
      hour12: false,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
