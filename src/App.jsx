import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, redirect, Navigate } from 'react-router-dom';
import Home from "./components/Home";
import WandOptions from './components/WandOptions';
import Admin from "./components/Admin";
import Parent from "./components/Parent";
import PrivateRoute from "./components/PrivateRoute";
// import PublicRoute from "./components/PublicRoute";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if(localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/wand-cores" element={<WandOptions />} />
        {/* <PublicRoute path="/wand-woods" component={WandWoods} /> */}
        {/* <PublicRoute path="/wands" component={WandList} /> */}
        <Route path="/home" element={<Home user={user} setUser={setUser} />} />
        <Route path="/parent" element={<Parent />} user={user} />
        <Route
          path="/admin"
          element={<PrivateRoute user={user}>
          <Admin /></PrivateRoute>} 
          />
          
      
        {/* <Redirect from="/" to="/home" /> */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

