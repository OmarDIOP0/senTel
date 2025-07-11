import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../utils/apiUrl";
import { AdminProfile } from "../types/Admin";
import showAlert from "../utils/alert";

export const useAdminService = () => {
  const [profileData, setProfileData] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminProfile = async () => {
    try {
      const tokenStr = localStorage.getItem("token");
      const authTokens = tokenStr ? JSON.parse(tokenStr) : null;

      if (!authTokens?.token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authTokens.token}`,
          Accept: "application/json",
        },
      });

      setProfileData(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Erreur lors du chargement du profil admin");
      setLoading(false);
      showAlert("Erreur lors de la récupération du profil admin", "error");
    }
  };
    const fetAllClients = async () => {
    try {
      const tokenStr = localStorage.getItem("token");
      const authTokens = tokenStr ? JSON.parse(tokenStr) : null;

      if (!authTokens?.token) {
        throw new Error("Token d'authentification non trouvé");
      }

      const response = await axios.get(`${API_URL}/client`, {
        headers: {
          Authorization: `Bearer ${authTokens.token}`,
          Accept: "application/json",
        },
      });

      setClients(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur API:", err);
      setError("Erreur lors du chargement de la liste des clients");
      setLoading(false);
      showAlert("Erreur lors de la récupération des clients", "error");
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetAllClients();
  }, []);

  return {
    profileData,
    clients,
    loading,
    error,
  };
};
