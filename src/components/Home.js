import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Welcome to Engage Pro</h1>
        <p className="home-subtitle">Choose an action to get started:</p>
      </header>

      <div className="action-cards">
        <div
          className="action-card"
          onClick={() => navigate("/create-segment")}
        >
          <div className="card-icon">📊</div>
          <h3>Create Segment</h3>
          <p>Define audience segments with specific criteria.</p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/create-customers")}
        >
          <div className="card-icon">👤</div>
          <h3>Add Customer</h3>
          <p>Add customer data to your database.</p>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/orders")}
        >
          <div className="card-icon">🛒</div>
          <h3>Add Order</h3>
          <p>Submit an order and link it to a customer.</p>
        </div>
      </div>
    </div>
  );
};

/* Styling in the same file */

const styles = `
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

.home-header {
  background-color: #85c1e9; /* Lighter blue color */
  color: white;
  padding: 40px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.home-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.home-subtitle {
  font-size: 1.2rem;
  margin-top: 10px;
  color: #eaf2f8;
}

.action-cards {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.action-card {
  flex: 1;
  max-width: 300px;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #007bff;
}

.action-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #343a40;
}

.action-card p {
  font-size: 1rem;
  color: #6c757d;
}
`;

// Adding styles dynamically to the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
