import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup.string().required(),
  surname: yup.string().required(),
  dutyId: yup.number().required(),
  file: yup
    .mixed()
    .notRequired()
    .when("pictureUrl", {
      is: (value: string) => !value,
      then: (schema) => schema.required("Pic needed"),
      otherwise: (schema) => schema,
    }),
});
