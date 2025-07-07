import {useEffect, createContext, useState} from 'react';
import showAlert from '../utils/constants';

const AuthContext = createContext();
export default AuthContext;


export const AuthProvider =({children}) =>{
    const [authTokens, setAuthTokens] = useState(()=>
        localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens"))
        : null
    );

    const [user, setUser] = useState(()=>
        localStorage.getItem("authTokens")
       ? jwtDecode(localStorage.getItem('authTokens'))
       : null
);
    const [loading,setLoading] =useState(true);
    const navigate = useNavigate();

    //Mutation pour la connexion

    const loginMutation = useMutation({
        mutationFn: async ({email, password}) =>{
            const response = await axios.post(`${APIURL}/token/`,{email, password});
            return response.data;
        },
        onSuccess: (data) => {
            setAuthTokens(data);
            const decodedToken = jwtDecode(data.access);
            setUser(decodedToken);
            localStorage.setItem('authTokens', JSON.stringify(data));
            // Redirection vers le tableau de bord
            if (decodedToken.role === 'student') {
                navigate('/');
            }
            else {
                navigate('/dashboard/teacher?sucess=true&&redirect=true');
            }
            // navigate('/dashboard');
            showAlert("Login Success🚀✅", "success");
        },
        onError: (error) => {
            let messageError = "Une erreur est survenue";
            if(error.response && error.response.data){
              if(typeof error.response.data === "string"){
                messageError = error.response.data;
              }else if(typeof error.response.data === "object"){
                messageError = Object.values(error.response.data).flat().join("\n");
              }
            }
            swal.fire({
              title: `Erreur lors de la connexion❌ ${messageError}`,
              icon: "error",
              toast: true,
              timer: 6000,
              position: "top-right",
              timerProgressBar: true,
              showConfirmButton: false,
              width: "auto", 
              customClass: {
                popup: 'swal2-toast', 
              }
            });
          },
    });
    // Mutation pour l'inscription
    const registerMutation = useMutation({
        mutationFn: async ({ email,role, password, confirm_password }) => {
          const response = await axios.post(`${APIURL}/register/`, {
            email,
            role,
            password,
            confirm_password,
          });
          return response.data;
        },
        onSuccess: () => {
          navigate("/login");
          showAlert("Registration Success🚀✅", "success");
        },
        onError: (error) => {
          let messageError = "Une erreur est survenue";
          if(error.response && error.response.data){
            if(typeof error.response.data === "string"){
              messageError = error.response.data;
            }else if(typeof error.response.data === "object"){
              messageError = Object.values(error.response.data).flat().join("\n");
            }
          }
          swal.fire({
            title: `Erreur lors de l'inscription❌ ${messageError}`,
            icon: "error",
            toast: true,
            timer: 6000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
            width: "auto", 
              customClass: {
                popup: 'swal2-toast', 
              }
          });
        },
      });
    // Mutation pour google
    const googleLoginMutation = useMutation({
      mutationFn: async(credential) =>{
        const response = await axios.post(`${APIURL}/login/google/`, {
          token: credential,
        });
        return response.data;
      },
      onSuccess:(data) =>{
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        navigate('/dashboard');
        showAlert("Google Registration Success 🚀✅", "success");
      },
      onError: (error) => {
        // showAlert("Google Authentication Failed ❌", "error");
        let messageError = "Une erreur est survenue";
        if(error.response && error.response.data){
          if(typeof error.response.data === "string"){
            messageError = error.response.data;
          }else if(typeof error.response.data === "object"){
            messageError = Object.values(error.response.data).flat().join("\n");
          }
        }
        swal.fire({
          title: `Google Authentication Failed ❌${messageError}`,
          icon: "error",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
          width: "auto", 
            customClass: {
              popup: 'swal2-toast', 
            }
        });
    }
    });
    const handleGoogleSuccess = (response) => {
      const { credential } = response;
      if (!credential) {
        showAlert("Google Authentication Failed ❌: No credential found", "error");
        return;
      }
      googleLoginMutation.mutate({token:credential});
  };
  const handleGoogleFailure = () => {
    showAlert("Google Authentication Failed ❌", "error");
};

        // Fonction de déconnexion
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login");
        showAlert("You have been logged out 🫡", "success");
    };
    const refreshToken = useMutation({
      mutationFn: async () => {
        const response = await axios.post(`${APIURL}/token/refresh/`, {
          refresh: authTokens.refresh,
        });
        return response.data;
      },
      onSuccess: (data) => {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
      },
      onError: (error) => {
        console.error("Erreur lors du refresh du token", error);
        logoutUser();
      },
    })

    // Donnees du contexte
    const contextData = {
        authTokens,
        user,
        loginMutation,
        registerMutation,
        logoutUser,
        loading,
        setUser,
        setAuthTokens,
        refreshToken,
        handleGoogleSuccess,
        handleGoogleFailure,
        googleLoginMutation
    };

    // Effet pour decoder le token au chargement
    useEffect(()=>{
        if(authTokens){
            setUser(jwtDecode(authTokens.access));
            const refreshinterval = setInterval(()=>{
              refreshToken.mutate();
            },3000000);

            return () => clearInterval(refreshinterval);
          }
    }, [authTokens,loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );

}