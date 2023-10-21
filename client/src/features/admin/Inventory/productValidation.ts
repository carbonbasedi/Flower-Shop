import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup.string().max(20).required("Please provide name for product"),
  price: yup
    .number()
    .typeError("input must be number")
    .required("Price is required field")
    .moreThan(0),
  quantityInStock: yup.number().required("Quantitiy is required field").min(0),
  description: yup.string().max(150).required("Please provide description"),
  categoryId: yup.number().required("Please choose category"),
  discount: yup.number(),
  isFeatured: yup.boolean(),
  file: yup
    .mixed()
    .notRequired()
    .when("pictureUrl", {
      is: (value: string) => !value,
      then: (schema) => schema.required("Image is requred"),
      otherwise: (schema) => schema,
    }),
});
