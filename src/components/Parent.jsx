import React, { useEffect, useState } from "react";
import axios from "axios";
import WandOptions from "./WandOptions";

const Parent = () => {
  const [wandOptions, setWandOptions] = useState([]);

  useEffect(() => {
    const fetchWandOptions = async () => {
      try {
        const response = await axios.get("/api/wand-options");
        console.log("Response data:", response.data);
        setWandOptions(response.data);
      } catch (error) {
        console.error("Error fetching wand options:", error);
      }
    };

    fetchWandOptions();
  }, []);

  return (
    <div>
      <WandOptions wandOptions={wandOptions} />
    </div>
  );
};

export default Parent;
