import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup.string().max(20).required(),
  brand: yup.string().required(),
  type: yup.string().required(),
  price: yup.number().required().moreThan(0),
  quantityInStock: yup.number().required().min(0),
  description: yup.string().max(150).required(),
  file: yup
    .mixed()
    .notRequired()
    .when("pictureUrl", {
      is: (value: string) => !value,
      then: (schema) => schema.required("Pic needed"),
      otherwise: (schema) => schema,
    }),
});
