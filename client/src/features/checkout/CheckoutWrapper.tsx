import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import Loading from "../../app/layout/Loading";

const stripePromise = loadStripe(
  "pk_test_51NoMKsLtZh8FVoQEeipMpZeIkruam3FUhWDMHVO7Tft1pWLwoA19LduIy7uIPUQeqoqNH0tjZxvk9Ad9Mw0e9eKo00VdEF1pIb"
);

export default function CheckoutWrapper() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Payments.createPaymentIntent()
      .then((basket) => dispatch(setBasket(basket)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <Loading message="Loading Checkout ..." />;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
}
