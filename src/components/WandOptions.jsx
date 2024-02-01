import React, { useState, useEffect } from "react";
import axios from "axios";



const WandOptions = () => {
  const [wandOptions, setWandOptions] = useState(null);
  const [wandCores, setWandCores] = useState(null);
  const [wandWoods, setWandWoods] = useState(null);

  useEffect(() => {
    // Fetch wand options
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/wand-options/wand-options`)
      .then(response => setWandOptions(response.data))
      .catch(error => {
        console.error("Error fetching wand options:", error);
      });

    // Fetch wand cores
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/wand-cores`)
      .then(response => setWandCores(response.data))
      .catch(error => {
        console.error("Error fetching wand cores:", error);
        // Handle error (e.g., set an error state)
      });

    // Fetch wand woods
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/wand-woods`)
      .then(response => setWandWoods(response.data))
      .catch(error => {
        console.error("Error fetching wand woods:", error);
       
      });
  }, []);

  if (wandOptions === null || wandCores === null || wandWoods === null) {
    // Loading 
    return <p>Loading Wand Options...</p>;
  }

  return (
    <div>
      <h3>Wand Options</h3>
      <div>
        <h4>Wand Cores</h4>
        {wandCores.map(core => (
          <div key={core.id}>
            <p>{core.core}</p>
          </div>
        ))}
      </div>
      <div>
        <h4>Wand Woods</h4>
        {wandWoods.map(wood => (
          <div key={wood.id}>
            <p>{wood.wood}</p>
          </div>
        ))}
      </div>
      <div>
        <h4>Wand Options (Combined)</h4>
        {wandOptions.map(option => (
          <div key={option.id}>
            <p>{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WandOptions;
