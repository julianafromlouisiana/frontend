//PrivateRoute.js file
import { useEffect } from "react";
import { Route, redirect, useNavigate } from "react-router-dom";
const axios = require("axios");



const PrivateRoute = ({ children, user }) => {
  console.log(user);
  console.log(Boolean(user));
  const nav = useNavigate();
    useEffect(() => {
    if(!user){
        console.log("User Is Not Logged In");
        nav("/home");
    }
   }, [user]);
    return (
                // <Route
                // {...rest}
                // element={(props) =>
                <>{children} </> 
                    // <Component {...props} /> 
    )
    // return (
//         <Route
//         {...rest}
//         render={(props) =>
//         isAuthenticated && isAdmin ? (
//             <Component {...props} />

//         ) : (
//             <Redirect to="/login" />
//         )
//         }
// />
//     );
};

export default PrivateRoute;