"use client";

import { useEffect, createContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import showAlert from "../utils/alert";
import APIURL from "../utils/apiUrl";
import Swal from "sweetalert2"; // 🔁 Assure-toi que `sweetalert2` est installé

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [token, setAuthTokens] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("token");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      return jwtDecode(localStorage.getItem("token"));
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // ✅ Connexion
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await axios.post(`${APIURL}/admin/login`, {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuthTokens(data);
      const decodedToken = jwtDecode(data.token);
      setUser(decodedToken);
      localStorage.setItem("token", JSON.stringify(data.token));

      if (decodedToken.role === "ADMIN") {
        router.push("/dashboard/admin?sucess=true&&redirect=true");
      } else {
        router.push("/login");
      }

      showAlert("Login Success 🚀✅", "success");
    },
    onError: (error) => {
      let messageError = "Une erreur est survenue";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          messageError = error.response.data;
        } else if (typeof error.response.data === "object") {
          messageError = Object.values(error.response.data)
            .flat()
            .join("\n");
        }
      }

      Swal.fire({
        title: `Erreur lors de la connexion ❌`,
        text: messageError,
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        width: "auto",
        customClass: {
          popup: "swal2-toast",
        },
      });
    },
  });

  // ✅ Inscription
  const registerMutation = useMutation({
    mutationFn: async ({ nomComplet, email, role, password }) => {
      const response = await axios.post(`${APIURL}/auth/register`, {
        nomComplet,
        email,
        role,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAuthTokens(data);
      const decodedToken = jwtDecode(data.token);
      setUser(decodedToken);
      localStorage.setItem("token", JSON.stringify(data.token));

      if (decodedToken.role === "ADMIN") {
        router.push("/dashboard/admin?sucess=true&&redirect=true");
      } else {
        router.push("/login");
      }

      showAlert("Inscription réussie 🚀✅", "success");
    },
    onError: (error) => {
      let messageError = "Une erreur est survenue";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          messageError = error.response.data;
        } else if (typeof error.response.data === "object") {
          messageError = Object.values(error.response.data)
            .flat()
            .join("\n");
        }
      }

      Swal.fire({
        title: `Erreur lors de l'inscription ❌`,
        text: messageError,
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        width: "auto",
        customClass: {
          popup: "swal2-toast",
        },
      });
    },
  });

  // ✅ Déconnexion
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("token");
    router.push("/login");
    showAlert("Déconnecté 🫡", "success");
  };

  const contextData = {
    token,
    user,
    loginMutation,
    registerMutation,
    logoutUser,
    loading,
    setUser,
    setAuthTokens,
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
