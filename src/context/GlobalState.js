import React, {useState} from "react";
import axios from "axios";
import GlobalContext from "./GlobalContext";
const GlobalState = (props) =>{
  
    /* const [orderData, setOrderData] = useState({
        customerId: "",
        amount: "",
      }); */
    const [customerData, setCustomerData] = useState({
        name: "",
        age: "",
        email: "",
        visits: "",
        netSpend: "",
      });
      const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Frontend validation for required fields
        if (!customerData.name.trim() || !customerData.email.trim()) {
          setError("Name and Email are required.");
          return;
        }
    
        try {
          // Send POST request to the backend
          const response = await axios.post("http://localhost:8080/api/customer", customerData);
    
          if (response.status === 200) {
            setSuccessMessage(response.data.message || "Customer added successfully!");
            setCustomerData({
              name: "",
              age: "",
              email: "",
              visits: "",
              netSpend: "",
            });
          }
        } catch (err) {
          if (err.response && err.response.status === 400) {
            // Handle unique email validation error
            setError(err.response.data.message || "Error adding customer.");
          } else {
            setError("An unexpected error occurred. Please try again.");
          }
        }
      };
    

    
    return(
        <GlobalContext.Provider value = {{customerData,setCustomerData,handleSubmit,error,setError,successMessage,setSuccessMessage}}> {/* we are importing an object here */}
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalState;