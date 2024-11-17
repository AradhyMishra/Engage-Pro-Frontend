import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../Styles/ViewCustomers.module.css"; // Import the CSS module

const ViewCustomers = (props) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { setProgress } = props;

  useEffect(() => {
    setProgress(20);
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/fetchCustomers");
        setCustomers(response.data.customers || []);
      } catch (error) {
        setError("Error fetching customer data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    setProgress(60);
    fetchCustomers();
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await axios.delete("http://localhost:8080/api/deleteCustomer", {
        data: { customerId },
      });

      setMessage(response.data.message || "Customer deleted successfully!");
      setMessageType("success");

      // Update the customers list after deletion
      setCustomers(customers.filter((customer) => customer._id !== customerId));
    } catch (error) {
      console.error("Error deleting customer:", error);
      setMessage("Error deleting customer");
      setMessageType("error");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Customer List</h2>

      {message && (
        <div
          className={`${styles.alert} ${
            messageType === "success" ? styles["alert-success"] : styles["alert-danger"]
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className={styles["loading-text"]}>
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className={`${styles.alert} ${styles["alert-danger"]}`} role="alert">
          {error}
        </div>
      ) : customers.length === 0 ? (
        <div className={`${styles.alert} ${styles["alert-info"]}`} role="alert">
          No customers found.
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Visits</th>
              <th>Total Spend</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.age || "N/A"}</td>
                <td>{customer.visits || 0}</td>
                <td>{customer.totalSpend || 0}</td>
                <td>{new Date(customer.joinDate).toLocaleDateString()}</td>
                <td>
                  <i
                    className="fas fa-trash"
                    onClick={() => handleDeleteCustomer(customer._id)}
                    title="Delete Customer"
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewCustomers;
