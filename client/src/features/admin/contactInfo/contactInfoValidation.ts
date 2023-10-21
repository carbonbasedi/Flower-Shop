import * as yup from "yup";

export const validationScheme = yup.object({
  address: yup.string().required(),
  phoneNumber1: yup
    .string()
    .required()
    .matches(
      /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,
      { message: "Number must match format '+994125554422' " }
    ),
  phoneNumber2: yup
    .string()
    .matches(
      /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,
      {
        message: "Number must match format '+994125554422' ",
        excludeEmptyString: true,
      }
    ),
  phoneNumber3: yup
    .string()
    .matches(
      /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,
      {
        message: "Number must match format '+994125554422' ",
        excludeEmptyString: true,
      }
    ),
  webAddress1: yup
    .string()
    .required()
    .email()
    .typeError("Input must match email type"),
  webAddress2: yup.string().email().nullable(),
  webAddress3: yup.string().email().nullable(),
  mapLocation: yup.string().required(),
});
