export function formatPhoneNumber(phone: string): string {
  const country = phone.slice(0, 4); // +998
  const operator = phone.slice(4, 6); // 97
  const firstPart = phone.slice(6, 9); // 146
  const secondPart = phone.slice(9, 11); // 02
  const thirdPart = phone.slice(11, 13); // 11

  return `${country} (${operator}) ${firstPart} ${secondPart} ${thirdPart}`;
}
