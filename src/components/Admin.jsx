import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import WandOptions from "./WandOptions";




const Admin = () => {
  const [selectedWand, setSelectedWand] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submittedCustomers, setSubmittedCustomers] = useState([]);
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({
    house: "",
    wizardId: "",
    name: "",
  });
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [core, setCore] = useState(""); 
  const [wood, setWood] = useState(""); 
  const [houseToUpdate, setHouseToUpdate] = useState(""); 
  const [houses, setHouses] = useState([]);

  console.log(submittedCustomers);

  useEffect(() => {
    const  fetchHouses = async () => {
      try{
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/houses`);
        setHouses(response.data);
      } catch (error) {
        console.log("Error fetching houses:", error);
      }
    };
    fetchHouses();
  }, []);
 
  const HOUSES = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw', 'Other Institution'];
  useEffect(() => {
    const fetchDataAndCreateWands = async () => {
      try {
        // await createInitialWands();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/wizards`);
        const wizardsWithDetails = await Promise.all(
          response.data.map(async (wizard) => {
            console.log(wizard);
            const details = await fetchWizardDetails(wizard.id);
            return { ...wizard, details };
          })
        );
  
        setSubmittedCustomers(wizardsWithDetails);
      } catch (error) {
        console.log("Error fetching data or creating initial wands:", error);
      }
    };
    fetchDataAndCreateWands();
  }, []);
  

  useEffect(() => {
    const fetchSubmittedCustomers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/wizards`);
        setSubmittedCustomers(response.data);
      } catch (error) {
        console.log("Error fetching submitted customers:", error);
      }
    };
    fetchSubmittedCustomers();
  }, [searchCriteria]);

  useEffect(() => {
    const filtered = submittedCustomers.filter((customer) => {
      const matchHouse = !searchCriteria.house || customer.house === searchCriteria.house;
      const matchWizardId = !searchCriteria.wizardId || customer.id == searchCriteria.wizardId;
      const matchName = !searchCriteria.name ||
        customer.name.toLowerCase().includes(searchCriteria.name.toLowerCase());

      return matchHouse && matchWizardId && matchName;
    });
    console.log("FILTERED", filtered);
    setFilteredCustomers(filtered);
    
  }, [searchCriteria, submittedCustomers]);

  const fetchWizardDetails = async (wizardId) => {
    try{
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/wizards/${wizardId}`)
      return response.data;
    } catch (error) {
      console.log("Error fetching wizard details", error);
      return null;
    }
  };

  const handleReviewAndSubmit = async () => {
    const newCustomer = {
      name: `${firstName} ${lastName}`,
      house: selectedHouse,
      core: selectedWand.split("/")[1].split("-")[1],
    wood: selectedWand.split("/")[0].split("-")[1],
    };
  
    try {
     
      const createWizardResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/wand-options/create-wizard`, newCustomer, { 
        headers: { 
          "Content-Type": "application/json"
        }
      })
      
      if (createWizardResponse) {
        const createdWizardId = createWizardResponse.id;
  
        // await assignWandToWizard(createWizardResponse.id, {
        //   core: selectedWand.split("/")[1].split("-")[1], // Get core from selectedWand
        //   wood: selectedWand.split("/")[0].split("-")[1], // Get wood from selectedWand
        //   house: selectedHouse,
        // });
        console.log("Wizard Details", createWizardResponse);
        const wizardDetails = await fetchWizardDetails(createWizardResponse.data.id);
  
        //Update the local state to include the new customer along with existing customers
        setSubmittedCustomers((prevCustomers) => [
          ...prevCustomers,
          { newCustomer: createWizardResponse, wand: wizardDetails },
        ]);
  
        // Clear all fields after submission success
        setSelectedWand("");
        setSelectedHouse("");
        setUsername("");
        setPassword("");
        setFirstName("");
        setLastName("");
      }
    } catch (error) {
      console.log("Error assigning wand to wizard", error);
    }
  };
  
  // /wizards/:id/wand
  const handleRemoveWand = async (wizardId) => {
    try {
      // Send a request to the backend to remove the wand
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/wand-options/wizards/${wizardId}/wand`);
      console.log(`Wizard with ID ${wizardId} removed successfully.`);
      //Update Local State to remove a wand
      const updatedSubmittedCustomers = submittedCustomers.filter(
        (customer) => customer.id !== wizardId
      );
      setSubmittedCustomers(updatedSubmittedCustomers);
    } catch (error) {
      console.error("Error removing wand", error);
    }
  };
  const handleUpdateWand = async (wizardId) => {
    try {
      const updatedWandData = {
        core: core,
        wood: wood,
        house: houseToUpdate,
      };
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/wizards/${wizardId}/wand`,
        updatedWandData
      );
      console.log("Updated wand:", response.data);
    } catch (error) {
      console.error("Error updating wand:", error);
    }
  };
  
  const handleSearch = async () => {
    console.log(searchCriteria);
    
    
    try{
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/wizards/${searchCriteria.wizardId}`
        // {
        //   params: searchCriteria,
        // }
      );
      console.log(response.data);
      setFilteredCustomers([response.data]);
    } catch (error) {
      console.log("Error searching wizards", error);
    }
  };
  
    console.log(filteredCustomers);

  return (
    <div>
      <h1>Admin Wizard Wand Shop Dashboard</h1>
      <p>Welcome to the admin dashboard. You have access to special admin features.</p>
      Please Call Juliana at 504.236.1709 for Further Assistance!
      {/* New Customer Form */}
      <h2>Add New Wizard Customer</h2>
      <form>
        <div>
          <label htmlFor="selectWand">Select a Wand:</label>
          <select
            id="selectWand"
            value={selectedWand}
            onChange={(e) => setSelectedWand(e.target.value)}
          >
            <option value="">Select a Wand</option>
            <option value="Oak-Wood/Dragon-Heartstring">Oak Wood, Dragon Heartstring</option>
            <option value="Mahogany-Wood/Phoenix-Feather">Mahogany Wood, Phoenix Feather</option>
            <option value="Ebony-Wood/Unicorn-Hair">Ebony Wood, Unicorn Hair</option>
            <option value="Willow-Wood/Veela-Hair">Willow Wood, Veela Hair</option>
            <option value="Cypress-Wood/Thestral-Tail-Hair">Cypress Wood, Thestral Tail Hair</option>
            <option value="Maple-Wood/Kelpie-Mane">Maple Wood, Kelpie Mane</option>
            <option value="Birch-Wood/Thunderbird-Tail-Feather">Birch Wood, Thunderbird Tail Feather</option>
            <option value="Yew-Wood/Rougarou-Hair">Yew Wood, Rougarou Hair</option>
            <option value="Applewood-Wood/Wampus-Cat-Hair">Applewood Wood, Wampus Cat Hair</option>
            <option value="Cherry-Wood/Veela-Hair">Cherry Wood, Veela Hair</option>
          </select>
        </div>
        <div>
          {/*... house options ...*/}
        
          <label htmlFor="selectedHouse">Select a House:</label>
          <select
            id="selectedHouse"
            value={selectedHouse}
            onChange={(e) => setSelectedHouse(e.target.value)}
          >
            <option value="">Select a House</option>
            {HOUSES.map((house) => (
              <option key={house} value={house}>
                {house}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleReviewAndSubmit}>
          Review and Submit
        </button>
      </form>
          <h2>Newly Created Wizard</h2>
    {submittedCustomers.length > 0 && (
      <div>
        <p>Wizard ID: {submittedCustomers[submittedCustomers.length - 1].id}</p>
        <p>Name: {submittedCustomers[submittedCustomers.length - 1].name}</p>
        <p>House: {submittedCustomers[submittedCustomers.length - 1].house}</p>
        {submittedCustomers[submittedCustomers.length - 1].wand && (
          <div>
            <p>Wand Core: {submittedCustomers[submittedCustomers.length - 1].wand.core}</p>
            <p>Wand Wood: {submittedCustomers[submittedCustomers.length - 1].wand.wood}</p>
            <p>Wand House: {submittedCustomers[submittedCustomers.length - 1].wand.house}</p>
          </div>
        )}
      </div>
    )}
              
        
  <h2>All Wizards</h2>
  <div>
    {submittedCustomers.map((customer) => {
      const { id, name, house, wand } = customer;

      return (
        <div key={id}>
          <p>Wizard ID: {id}</p>
          <p>Name: {name}</p>
          <p>House: {house}</p>
          {wand && (
            <div>
              <p>Wand Core: {wand.core}</p>
              <p>Wand Wood: {wand.wood}</p>
              <p>Wand House: {wand.house}</p>
            </div>
          )}

              <button onClick={() => handleRemoveWand(id)}>
                Remove 
              </button>
            </div>
          );
        })}
      </div>
        <h2>All Houses</h2>
            <div>
                {houses.map((house) => (
                    <div key={house.id}>
                        <p>House ID: {house.id}</p>
                        <p>House Name: {house.name}</p>
                    </div>
                ))}
            </div>
          {/* Search Bar */}
      <h2>Search Existing Wizards</h2>
      <div>
        <label htmlFor="searchHouse">House:</label>
        <input
          type="text"
          id="searchHouse"
          value={searchCriteria.house}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, house: e.target.value })}
        />
        
      </div>
      <div>
        <label htmlFor="searchWizardId">Wizard ID:</label>
        <input
          type="text"
          id="searchWizardId"
          value={searchCriteria.wizardId}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, wizardId: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="searchName">Name:</label>
        <input
          type="text"
          id="searchName"
          value={searchCriteria.name}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, name: e.target.value })}
        />
          <button type="button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {/* Display Filtered Wizards */}
      <h2>Filtered Wizards</h2>
      <div>
        {filteredCustomers.map((customer) => (
          <div key={customer.id}>
            <p>Wizard ID: {customer.id}</p>
            <p>Name: {customer.name}</p>
            <p>House: {customer.house}</p>
            <p>Wand Core: {customer.wand?.core}</p>
            <p>Wand Wood: {customer.wand?.wood}</p>
            <p>Wand House: {customer.wand?.house}</p>
            <button onClick={() => handleRemoveWand(customer.id)}>
              Remove 
            </button>
              {/* Add Update Wand */}
            <button onClick={() => handleUpdateWand(customer.id)}>
               Update 
           </button>
    </div>
  ))}
</div>
          </div>
  );
};


export default Admin;

