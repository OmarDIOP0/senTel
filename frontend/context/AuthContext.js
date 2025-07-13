"use client";

import { useEffect, createContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import showAlert from "../utils/alert";
import APIURL from "../utils/apiUrl";
import Swal from "sweetalert2"; 

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
    try {
      const parsed = JSON.parse(localStorage.getItem("token"));
      return parsed?.token ? jwtDecode(parsed.token) : null;
    } catch (e) {
      console.error("Erreur lors du décodage du token :", e);
      return null;
    }
  }
  return null;
});

  const [loading, setLoading] = useState(true);

  // ✅ Connexion
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await axios.post(`${APIURL}/auth/admin/login`, {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const tokenObject = { token: data.token };
      setAuthTokens(tokenObject); // stocke un objet cohérent avec ce que tu attends
      setUser(jwtDecode(data.token));
      localStorage.setItem("token", JSON.stringify(tokenObject)); // ✅ EN OBJET

      router.push("/dashboard?sucess=true&&redirect=true");
      showAlert("Login Success 🚀✅", "success");

      if (decodedToken) {
        router.push("/dashboard?sucess=true&&redirect=true");
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

      // Swal.fire({
      //   title: `Erreur lors de la connexion ❌`,
      //   text: messageError,
      //   icon: "error",
      //   toast: true,
      //   timer: 6000,
      //   position: "top-right",
      //   timerProgressBar: true,
      //   showConfirmButton: false,
      //   width: "auto",
      //   customClass: {
      //     popup: "swal2-toast",
      //   },
      // });
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
        const tokenObject = { token: data.token };
        setAuthTokens(tokenObject); // stocke un objet cohérent avec ce que tu attends
        setUser(jwtDecode(data.token));
        localStorage.setItem("token", JSON.stringify(tokenObject)); // ✅ EN OBJET

        router.push("/dashboard?sucess=true&&redirect=true");
        showAlert("Login Success 🚀✅", "success");

      if (decodedToken.role === "ADMIN") {
        router.push("/dashboard?sucess=true&&redirect=true");
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
