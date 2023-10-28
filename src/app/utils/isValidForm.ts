import { FormGroup } from "@angular/forms";
import { validatePin } from "./validatePin";

/**
   * This function validates the form to submit it
   */
export function isValidForm(data: FormGroup): boolean {
  const fullName = data.get('fullName')!.value;
  const email = data.get('email')!.value;
  const isDoctor = data.get('isDoctor')!.value;

  // Verify if there're null values
  const isFullNameValid = !!fullName;
  const isEmailValid = !!email;
  const isPinValid = validatePin(data);

  if(isDoctor) {
    data.get('role')?.setValue('doctor');

    const license = data.get('license')!.value;
    const profession = data.get('profession')!.value;
    const description = data.get('description')!.value;
    const cost = data.get('cost')!.value;
    const officeAddress = data.get('officeAddress')!.value;

    // Verify if there're null values
    const isLicenseValid = !!license;
    const isProfessionValid = !!profession;
    const isDescriptionValid = !!description;
    const isCostValid = !!cost;
    const isOfficeAddressValid = !!officeAddress;

    const isDoctorValid = isLicenseValid && isProfessionValid && isDescriptionValid && isCostValid && isOfficeAddressValid;

    return isDoctorValid && isFullNameValid && isEmailValid && isPinValid;
  }

  data.get('role')?.setValue('patient');
  return isFullNameValid && isEmailValid && isPinValid;
}
