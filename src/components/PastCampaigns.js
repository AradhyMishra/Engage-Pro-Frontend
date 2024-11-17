import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../Styles/PastCampaigns.module.css"; // Import the CSS module

export const PastCampaigns = (props) => {
  const { setProgress } = props;
  const { state } = useLocation();
  const segmentId = state?.segmentId;
  const [customers, setCustomers] = useState([]);
  const [campaignsData, setCampaignsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCustomers, setExpandedCustomers] = useState(new Set());
  const [statistics, setStatistics] = useState({
    audienceSize: 0,
    messagesSent: 0,
    messagesFailed: 0,
    totalMessages: 0,
    successRate: 0,
    failureRate: 0,
  });

  useEffect(() => {
    const fetchSegmentData = async () => {
      setProgress(20);
      try {
        if (!segmentId) return;

        const customersResponse = await axios.get(
          `http://localhost:8080/api/getSegmentCustomers/${segmentId}`
        );
        const customerList = customersResponse.data.customers || [];
        setCustomers(customerList);
        setProgress(40);

        const audienceSize = customerList.length;
        const customerIds = customerList.map((customer) => customer._id);

        if (customerIds.length > 0) {
          const campaignsResponse = await axios.post(
            "http://localhost:8080/api/getCampaignsForCustomers",
            { customerIds }
          );

          const sortedCampaigns = campaignsResponse.data.campaigns.sort(
            (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
          );
          setCampaignsData(sortedCampaigns || []);

          const messagesSent = sortedCampaigns.filter((c) => c.status === "SENT").length;
          const messagesFailed = sortedCampaigns.filter((c) => c.status === "FAILED").length;
          const totalMessages = messagesSent + messagesFailed;
          const successRate = ((messagesSent / totalMessages) * 100).toFixed(2);
          const failureRate = ((messagesFailed / totalMessages) * 100).toFixed(2);

          setStatistics({
            audienceSize,
            messagesSent,
            messagesFailed,
            totalMessages,
            successRate,
            failureRate,
          });
        }
      } catch (error) {
        console.error("Error fetching segment or campaigns:", error);
      } finally {
        setLoading(false);
      }
      setProgress(100);
    };

    fetchSegmentData();
  }, [segmentId, setProgress]);

  const toggleExpanded = (customerId) => {
    setExpandedCustomers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(date).toLocaleString("en-US", options).replace(",", "");
  };

  if (!segmentId) {
    return <p>No segment selected. Please go back and select a segment.</p>;
  }

  const groupedCampaigns = customers.map((customer) => {
    const customerCampaigns = campaignsData.filter(
      (campaign) => campaign.customerId?._id === customer._id
    );
    return { customer, campaigns: customerCampaigns };
  });

  return (
    <div className={styles.container}>
      <div className={styles.titleArea}>
        <h2 className={styles.title}>Past Campaigns for Segment</h2>
      </div>

      {!loading && (
        <div className={styles.statistics}>
          <h5 className={styles.statsHeader}>Statistics</h5>
          <div className={styles.statsRow}>
            <div className={styles.statsItem}>
              <p><strong>Audience Size:</strong> {statistics.audienceSize}</p>
              <p><strong>Total Messages:</strong> {statistics.totalMessages}</p>
            </div>
            <div className={styles.statsItem}>
              <p><strong>Messages Sent:</strong> {statistics.messagesSent}</p>
              <p><strong>Messages Failed:</strong> {statistics.messagesFailed}</p>
            </div>
            <div className={styles.statsItem}>
              <p><strong>Success Rate:</strong> {statistics.successRate}%</p>
              <p><strong>Failure Rate:</strong> {statistics.failureRate}%</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading data...</p>
      ) : groupedCampaigns.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Messages Sent</th>
            </tr>
          </thead>
          <tbody>
            {groupedCampaigns.map(({ customer, campaigns }, index) => (
              <tr key={index}>
                <td>
                  <strong>{customer.name}</strong>
                  <br />
                  <small className={styles.customerEmail}>{customer.email}</small>
                </td>
                <td>
                  <ul className={styles.campaignList}>
                    {(expandedCustomers.has(customer._id)
                      ? campaigns
                      : campaigns.slice(0, 3)
                    ).map((campaign, i) => (
                      <li key={i} className={styles.campaignItem}>
                        <strong>Message:</strong> {campaign.message}
                        <br />
                        <strong>Status:</strong>{" "}
                        <span
                          className={
                            campaign.status === "SENT"
                              ? styles.statusSent
                              : styles.statusFailed
                          }
                        >
                          {campaign.status}
                        </span>
                        <br />
                        <strong>Sent At:</strong> {formatDate(campaign.sentAt)}
                      </li>
                    ))}
                  </ul>
                  {campaigns.length > 3 && (
                    <button
                      className={styles.viewToggleButton}
                      onClick={() => toggleExpanded(customer._id)}
                    >
                      {expandedCustomers.has(customer._id) ? "View Less" : "View All"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available for this segment.</p>
      )}
    </div>
  );
};
