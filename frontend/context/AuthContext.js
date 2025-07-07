import {useEffect, createContext, useState} from 'react';
import showAlert from '../utils/constants';

const AuthContext = createContext();
export default AuthContext;


export const AuthProvider =({children}) =>{
    const [token, setAuthTokens] = useState(()=>
        localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))
        : null
    );

    const [user, setUser] = useState(()=>
        localStorage.getItem("token")
       ? jwtDecode(localStorage.getItem('token'))
       : null
);
    const [loading,setLoading] =useState(true);
    const navigate = useNavigate();

    //Mutation pour la connexion

    const loginMutation = useMutation({
        mutationFn: async ({email, password}) =>{
            const response = await axios.post(`${APIURL}/admin/login`,{email, password});
            return response.data;
        },
        onSuccess: (data) => {
            setAuthTokens(data);
            const decodedToken = jwtDecode(data.access);
            setUser(decodedToken);
            localStorage.setItem('token', JSON.stringify(data));
            // Redirection vers le tableau de bord
            if (decodedToken.role === 'ADMIN') {
                navigate('/dashboard/admin?sucess=true&&redirect=true');
            }
            else {
                navigate('/login');
                return;
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
        mutationFn: async ({ nomComplet,email,role, password  }) => {
          const response = await axios.post(`${APIURL}/auth/register`, {
            nomComplet,
            email,
            role,
            password
          });
          return response.data;
        },
        onSuccess: () => {
           setAuthTokens(data);
            const decodedToken = jwtDecode(data.access);
            setUser(decodedToken);
            localStorage.setItem('token', JSON.stringify(data));
            // Redirection vers le tableau de bord
            if (decodedToken.role === 'ADMIN') {
                navigate('/dashboard/admin?sucess=true&&redirect=true');
            }
            else {
                navigate('/login');
                return;
            }
            // navigate('/dashboard');
            showAlert("Register Success🚀✅", "success");
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

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
        showAlert("You have been logged out 🫡", "success");
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


    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );

}