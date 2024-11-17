import React, { useState } from "react";
import axios from "axios";

const OrderIngestion = (props) => {
  const [orderData, setOrderData] = useState({
    customerId: "",
    amount: "",
  });
  const { setProgress } = props;
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
    setError(""); // Clear error on input change
    setSuccessMessage(""); // Clear success message
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(20);
    if (!orderData.customerId.trim() || !orderData.amount.trim()) {
      setError("Customer ID and Order Amount are required.");
      return;
    }
    setProgress(40);
    if (isNaN(orderData.amount) || Number(orderData.amount) <= 0) {
      setError("Order Amount must be a valid positive number.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/order", orderData);
      setProgress(60);
      if (response.status === 200) {
        setSuccessMessage(
          "Order processed successfully! Order details have been sent to our processing system."
        );
        setOrderData({
          customerId: "",
          amount: "",
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(
          err.response.data ||
            "The provided Customer ID is invalid. Please check and try again."
        );
      } else {
        setError("Please Make sure the Customer Id is valid.");
      }
    }
    setProgress(100);
  };

  // Styles
  const styles = {
    container: {
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f4f4f4",
      margin: "0",
      overflow: "hidden",
    },
    box: {
      width: "500px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Arial', sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "5px",
      display: "block",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    alert: {
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "5px",
    },
    error: {
      backgroundColor: "#f8d7da",
      color: "#842029",
      borderColor: "#f5c2c7",
    },
    success: {
      backgroundColor: "#d1e7dd",
      color: "#0f5132",
      borderColor: "#badbcc",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.header}>Order Data Ingestion</h2>

        {error && (
          <div style={{ ...styles.alert, ...styles.error }}>{error}</div>
        )}
        {successMessage && (
          <div style={{ ...styles.alert, ...styles.success }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            Customer ID <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="customerId"
            value={orderData.customerId}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter Customer ID"
            required
          />

          <label style={styles.label}>
            Order Amount <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            name="amount"
            value={orderData.amount}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter Order Amount"
            required
          />

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = styles.button.backgroundColor)
            }
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderIngestion;
