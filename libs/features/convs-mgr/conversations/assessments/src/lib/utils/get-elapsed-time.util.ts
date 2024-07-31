export function UpdateElapsedTime(startTime: number): string {
  const currentTime = Date.now();
  const timeDiff = currentTime - startTime;

  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return (_padNumber(hours) + ':' + 
    _padNumber(minutes) + ':' + 
    _padNumber(seconds))
}

function _padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}