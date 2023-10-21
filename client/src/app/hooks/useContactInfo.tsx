import { useEffect } from "react";
import {
  contactInfoSelector,
  fetchContactInfosAsync,
} from "../../features/admin/contactInfo/contactInfoSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function useContactInfo() {
  const contactInfo = useAppSelector(contactInfoSelector.selectAll);
  const dispatch = useAppDispatch();
  const { contactInfoLoaded } = useAppSelector((state) => state.contactInfo);

  useEffect(() => {
    if (!contactInfoLoaded) dispatch(fetchContactInfosAsync());
  }, [contactInfoLoaded, dispatch]);

  return {
    contactInfo,
    contactInfoLoaded,
  };
}
