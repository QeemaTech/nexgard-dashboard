import { useEffect, useState } from "react";
import clinicsApi from "../api/clinicsApi";

function useClinicOptions() {
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    let active = true;
    clinicsApi.list({ limit: 100 }).then((response) => {
      if (active) setClinics(response.data.data || []);
    });
    return () => {
      active = false;
    };
  }, []);

  return clinics;
}

export default useClinicOptions;
