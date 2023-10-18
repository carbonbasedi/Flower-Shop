import * as yup from "yup";

export const validationScheme = yup.object({
  title: yup.string().min(5).max(20).required(),
  subtitle: yup.string().min(20).max(200).required(),
  description: yup.string().min(50).max(300).required(),
  file: yup
    .mixed()
    .notRequired()
    .when("pictureUrl", {
      is: (value: string) => !value,
      then: (schema) => schema.required("Pic needed"),
      otherwise: (schema) => schema,
    }),
});
