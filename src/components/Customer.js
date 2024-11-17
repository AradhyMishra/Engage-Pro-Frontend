import React, { useState } from "react";
import axios from "axios";
import styles from "../Styles/Customer.module.css"; // Import the CSS module

const Customer = (props) => {
  const { setProgress } = props;

  const [customerData, setCustomerData] = useState({
    name: "",
    age: "",
    email: "",
    visits: "",
    netSpend: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
    setError(""); // Clear error on input change
    setSuccessMessage(""); // Clear success message
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(20);

    if (!customerData.name.trim() || !customerData.email.trim()) {
      setError("Name and Email are required.");
      return;
    }
    setProgress(40);

    try {
      const response = await axios.post("http://localhost:8080/api/customer", customerData);

      if (response.status === 200) {
        setSuccessMessage("Customer added successfully!");
        setCustomerData({
          name: "",
          age: "",
          email: "",
          visits: "",
          netSpend: "",
        });
        setProgress(70);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message || "Error adding customer.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setProgress(70);
    }
    setProgress(100);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Customer Data Ingestion</h2>

      {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}
      {successMessage && (
        <div className={`${styles.alert} ${styles.success}`}>{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <label className={styles.label}>
          Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={customerData.name}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter name"
          required
        />

        <label className={styles.label}>Age</label>
        <input
          type="number"
          name="age"
          value={customerData.age}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter age"
        />

        <label className={styles.label}>
          Email <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={customerData.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter email"
          required
        />

        <label className={styles.label}>Visits</label>
        <input
          type="number"
          name="visits"
          value={customerData.visits}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter number of visits"
        />

        <label className={styles.label}>Net Spend</label>
        <input
          type="number"
          name="netSpend"
          value={customerData.netSpend}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter net spend"
        />

        <button type="submit" className={styles.button}>
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default Customer;
