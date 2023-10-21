import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (process.env.NODE_ENV === "development") await sleep();
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 403:
        toast.error("You are not allowed to do that !");
        break;
      case 404:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, data: FormData) =>
    axios
      .post(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  putForm: (url: string, data: FormData) =>
    axios
      .put(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
};

function createFormData(item: any) {
  let formData = new FormData();
  for (const key in item) {
    formData.append(key, item[key]);
  }
  return formData;
}

const Admin = {
  createProduct: (product: any) =>
    requests.postForm("products", createFormData(product)),
  updateProduct: (product: any) =>
    requests.putForm("products", createFormData(product)),
  deleteProduct: (id: number) => requests.delete(`products/${id}`),
  createSlider: (slider: any) =>
    requests.postForm("slider", createFormData(slider)),
  updateSlider: (slider: any) =>
    requests.putForm("slider", createFormData(slider)),
  deleteSlider: (id: number) => requests.delete(`slider/${id}`),
  createAboutUs: (aboutUs: any) =>
    requests.postForm("aboutUs", createFormData(aboutUs)),
  updateAboutUs: (aboutUs: any) =>
    requests.putForm("aboutUs", createFormData(aboutUs)),
  deleteAboutUs: (id: number) => requests.delete(`aboutUs/${id}`),
  createDuty: (duty: any) => requests.postForm("duty", createFormData(duty)),
  updateDuty: (duty: any) => requests.putForm("duty", createFormData(duty)),
  deleteDuty: (id: number) => requests.delete(`duty/${id}`),
  createWorker: (worker: any) =>
    requests.postForm("worker", createFormData(worker)),
  updateWorker: (worker: any) =>
    requests.putForm("worker", createFormData(worker)),
  deleteWorker: (id: number) => requests.delete(`worker/${id}`),
  createCategory: (category: any) =>
    requests.postForm("category", createFormData(category)),
  updateCategory: (category: any) =>
    requests.putForm("category", createFormData(category)),
  deleteCategory: (id: number) => requests.delete(`category/${id}`),
  paidOrders: () => requests.get("orders/adminOrdersList"),
  orderDelivered: (id: number) => requests.delete(`orders/${id}`),
  createContactInfo: (contactInfo: any) =>
    requests.postForm("contactInfo", createFormData(contactInfo)),
  updateContactInfo: (contactInfo: any) =>
    requests.putForm("contactInfo", createFormData(contactInfo)),
  deleteContactInfo: (id: number) => requests.delete(`contactInfo/${id}`),
};

const Catalog = {
  list: (params: URLSearchParams) => requests.get("products", params),
  details: (id: number) => requests.get(`products/${id}`),
  fetchFilters: () => requests.get("products/filters"),
};

const TestErrors = {
  get400Error: () => requests.get("bugs/bad-request"),
  get401Error: () => requests.get("bugs/unauthorized"),
  get404Error: () => requests.get("bugs/not-found"),
  get500Error: () => requests.get("bugs/server-error"),
  getValidationError: () => requests.get("bugs/validation-error"),
};

const Basket = {
  get: () => requests.get("basket"),
  addItem: (productId: number, quantity = 1) =>
    requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) =>
    requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const Account = {
  login: (values: any) => requests.post("account/login", values),
  register: (values: any) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
  fetchAddress: () => requests.get("account/savedAddress"),
  forgotPassword: (values: any) =>
    requests.post("account/forgotPassword", values),
  logout: () => requests.get("account/logout"),
  resetPasswordGet: () => requests.get("account/resetPasswordGet"),
  resetPassword: (values: any) =>
    requests.post("account/resetPassword", values),
};

const Orders = {
  list: () => requests.get("orders"),
  fetch: (id: number) => requests.get(`orders/${id}`),
  create: (values: any) => requests.post("orders", values),
};

const Payments = {
  createPaymentIntent: () => requests.post("payments", {}),
};

const Slider = {
  list: (params: URLSearchParams) => requests.get("slider", params),
  details: (id: number) => requests.get(`slider/${id}`),
};

const AboutUs = {
  list: () => requests.get("aboutUs"),
  details: (id: number) => requests.get(`aboutUs/${id}`),
};

const Duty = {
  list: () => requests.get("duty"),
  details: (id: number) => requests.get(`duty/${id}`),
};

const Worker = {
  list: (params: URLSearchParams) => requests.get("worker", params),
  details: (id: number) => requests.get(`worker/${id}`),
  fetchFilters: () => requests.get("worker/filters"),
};

const Category = {
  list: () => requests.get("category"),
  details: (id: number) => requests.get(`category/${id}`),
};

const ContactInfo = {
  list: () => requests.get("contactInfo"),
  details: (id: number) => requests.get(`contactInfo/${id}`),
};

const agent = {
  Catalog,
  TestErrors,
  Basket,
  Account,
  Orders,
  Payments,
  Admin,
  Slider,
  AboutUs,
  Duty,
  Worker,
  Category,
  ContactInfo,
};

export default agent;
