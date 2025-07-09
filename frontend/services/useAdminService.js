import { useQuery } from "@tanstack/react-query";
import API_URL from "../utils/apiUrl";
import {ApiResponse} from "../types/ApiResponse";
import axios from "axios";
import showAlert from "../utils/alert";
import {AdminProfile} from "../types/Admin";
export const useAdminService = () => {
    const fetchAdminProfile = useQuery<ApiResponse<AdminProfile>>({
        queryKey: ["adminProfile"],
        queryFn: async () => {
            const authTokens = JSON.parse(localStorage.getItem("token"));
            const response = await axios.get(`${API_URL}/auth/profile`, {
                withCredentials: true,
                    headers: {
                    Authorization: `Bearer ${authTokens?.access}`,
                    Accept: "application/json",
                    },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch profile");
            }
            return response.json();
        },
        onSuccess: (data) => {
      console.log("Admin profile fetched successfully:", data);
    },
    onError: (error) => {
      showAlert("Erreur lors de la récupération du profile admin", "error");
    },
    });


      return { fetchAdminProfile };
}