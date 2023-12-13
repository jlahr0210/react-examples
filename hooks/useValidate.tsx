import { EMAIL_REG_EX, PHONE_NUMBER_REG_EX } from "@/utils/constants";

function useValidate() {
  const validateEmail = (email: string) => {
    return email.match(EMAIL_REG_EX) ? true : false;
  };

  const validatePhone = (phoneNumber: string) => {
    return phoneNumber.match(PHONE_NUMBER_REG_EX) ? true : false;
  };

  return {
    validateEmail,
    validatePhone,
  };
}

export default useValidate;
