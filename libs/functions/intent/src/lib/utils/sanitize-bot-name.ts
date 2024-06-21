export function ValidateAndSanitize(input: string): string {
  // Define the regular expression pattern
  const regex = /^[a-zA-Z\d_-]{1,500}$/;

  // Check if the input matches the pattern
  if (regex.test(input)) {
    return input; // Input is valid, no replacements needed
  } else {
    // Replace non-matching characters with underscores
    return input.replace(/[^a-zA-Z\d_-]/g, '_');
  }
}