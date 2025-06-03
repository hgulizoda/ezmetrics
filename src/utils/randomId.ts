export const generateRandomId = (length: number): string => {
    let hexString = '';
    for (let i = 0; i < length; i += 1) {
      const randomHexDigit = Math.random() * 16;
      hexString += randomHexDigit.toString(16);
    }
    return hexString;
  };