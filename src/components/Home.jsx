import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WandOptions from "./WandOptions";


const Home = ({ user, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wandOptions, setWandOptions] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWandOptions = async () => {
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/wand-options/wand-options`);
        console.log("Response data:", response.data);
        setWandOptions(response.data);
      } catch (error) {
        console.log("Error setting up the request:", error.message);
      }
    };

    fetchWandOptions();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("handleLogin called");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      setUser(true);
      navigate("/admin");
    } catch (error) {
      console.log("Login failed:", error);
    }
  };
  console.log(process.env.REACT_APP_BACKEND_URL);
  return (
    <div>
      <h1>Welcome to the Wizard Wand Shop Homepage</h1>
      <p>Admin, Please Log In!</p>

      {/* Login Form */}
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {/* Wand Options */}
      <h2>Wand Options</h2>
      {wandOptions.length > 0 ? (
       <WandOptions wandOptions={wandOptions} />
      
      ) : (
        <p>Loading Wand Options...</p>
      )}
    </div>
  );
};

export default Home;