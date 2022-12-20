export function __isCommand(text: string)
{
  if (text.includes('#')) return true;
  
  return false;
}