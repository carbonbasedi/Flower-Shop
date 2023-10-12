import * as yup from "yup";

export const validationSchema = yup.object({
  title: yup.string().max(20).required(),
  subtitle: yup.string().max(100).required(),
  buttonLink: yup.string().max(10).required(),
  file: yup
    .mixed()
    .notRequired()
    .when("pictureUrl", {
      is: (value: string) => !value,
      then: (schema) => schema.required("Pic needed"),
      otherwise: (schema) => schema,
    }),
});
