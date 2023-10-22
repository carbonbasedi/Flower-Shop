import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import Inventory from "../../features/admin/Inventory/Inventory";
import Dashboard from "../../features/admin/dashboard/Dashboard";
import SliderList from "../../features/admin/slider/SliderList";
import ForgotPassword from "../../features/account/ForgotPassword";
import ResetPassword from "../../features/account/ResetPassword";
import AboutUsList from "../../features/admin/aboutUs/AboutUsList";
import DutyList from "../../features/admin/duty/DutyList";
import WorkerList from "../../features/admin/worker/WorkerList";
import CategoryList from "../../features/admin/category/CategoryList";
import ContactInfoList from "../../features/admin/contactInfo/ContactInfoList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      //authenticated routes
      {
        element: <RequireAuth />,
        children: [
          {
            path: "checkout",
            element: <CheckoutWrapper />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
        ],
      },
      //admin routes
      {
        element: <RequireAuth roles={["Admin"]} />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              {
                path: "inventory",
                element: <Inventory />,
              },
              {
                path: "sliderList",
                element: <SliderList />,
              },
              {
                path: "aboutUsList",
                element: <AboutUsList />,
              },
              {
                path: "dutyList",
                element: <DutyList />,
              },
              {
                path: "workerList",
                element: <WorkerList />,
              },
              {
                path: "categoryList",
                element: <CategoryList />,
              },
              {
                path: "contactInfo",
                element: <ContactInfoList />,
              },
            ],
          },
        ],
      },
      {
        path: "catalog",
        element: <Catalog />,
      },
      {
        path: "catalog/:id",
        element: <ProductDetails />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "server-error",
        element: <ServerError />,
      },
      {
        path: "not-found",
        element: <NotFound />,
      },
      {
        path: "basket",
        element: <BasketPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "resetPassword",
        element: <ResetPassword />,
      },
      {
        path: "*",
        element: <Navigate replace to="/not-found" />,
      },
    ],
  },
]);
