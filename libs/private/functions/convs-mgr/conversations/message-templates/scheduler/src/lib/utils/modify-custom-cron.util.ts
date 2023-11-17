export function ModifyCronString(cronString: string): [string, number | null] {
  const regex = /\/(\d+)$/;
  const match = cronString.match(regex);

  if (match) {
      // Extracting the number
      const number = parseInt(match[1], 10);

      // Removing '/number' from the end representing the every x weeks interval
      const modifiedCronString = cronString.replace(regex, ''); 
      return [modifiedCronString, number];
  }

  // Return original string and null if no match
  return [cronString, null]; 
}