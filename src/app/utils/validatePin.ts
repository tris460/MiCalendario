import { FormGroup } from '@angular/forms';

/**
 * Verifies the content of the PIN input
 * @param data - The FormGroup containing the PIN and noPin controls
 * @returns Boolean depending on whether the value in the PIN input is valid
 */
export function validatePin(data: FormGroup): boolean {
  const pin = data.get('pin')!.value;
  const noPin = data.get('noPin')!.value;

  if (noPin) {
    return true;
  }
  if (pin && /^[0-9]{4}$/.test(pin)) {
    return true;
  }

  return false;
}
