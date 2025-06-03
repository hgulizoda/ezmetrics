export function formatPhoneNumber(phoneNumber?: string) {
  return phoneNumber
    ? phoneNumber.replace(/ /g, '').replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
    : '';
}
