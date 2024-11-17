import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Styles from "../Styles/PrevSegments.module.css";

export default function PrevSegments(props) {
    const [segments, setSegments] = useState([]);
    const navigate = useNavigate();
    const { setProgress } = props;
    const [messageTemplate, setMessageTemplate] = useState("");
    const [activeSegmentId, setActiveSegmentId] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {
        setProgress(20);
        const fetchSegments = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/fetchSegments");
                setSegments(response.data || []);
            } catch (error) {
                console.error("Error fetching segments:", error);
            }
        };
        setProgress(60);
        fetchSegments();
        setProgress(100);

        // eslint-disable-next-line
    }, []);

    const handleViewCampaigns = (segmentId) => {
        navigate("/past-campaigns", { state: { segmentId } });
    };

    const handleDeleteSegment = async (segmentId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/deleteSegment/${segmentId}`);
            if (response.status === 200) {
                setSegments(segments.filter((segment) => segment._id !== segmentId));
                setMessage("Segment deleted successfully!");
                setMessageType("success");
            }
        } catch (error) {
            console.error("Error deleting segment:", error);
            setMessage("Error deleting segment. Please try again.");
            setMessageType("error");
        }
    };

    const handleSendMessage = async (segmentId) => {
        if (!messageTemplate.trim()) {
            setMessageType("error");
            setMessage("Message cannot be empty");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/sendCampaign", {
                segmentId,
                messageTemplate,
            });

            setMessage(response.data.message || "Message sent successfully!");
            setMessageType("success");
        } catch (error) {
            console.error("Error sending messages:", error);
            setMessageType("error");
            setMessage("Error sending messages");
        } finally {
            setActiveSegmentId(null);
            setMessageTemplate("");
        }
    };

    return (
        <div className={Styles.container}>
            <h2>Previous Segments</h2>

            {message && (
                <div
                    className={`${Styles.alert} ${
                        messageType === "success" ? Styles["alert-success"] : Styles["alert-danger"]
                    }`}
                >
                    {message}
                </div>
            )}

            {segments.length > 0 ? (
                <table className={Styles.table}>
                    <thead>
                        <tr>
                            <th>Segment Name</th>
                            <th>Segment Size</th>
                            <th>Created At</th>
                            <th>Actions</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {segments.map((segment) => (
                            <tr key={segment._id}>
                                <td>{segment.name}</td>
                                <td>{segment.audienceSize}</td>
                                <td>{new Date(segment.createdAt).toLocaleString()}</td>
                                <td>
                                    <button
                                        className={`${Styles.btn} ${Styles["btn-secondary"]}`}
                                        onClick={() => handleViewCampaigns(segment._id)}
                                    >
                                        View Campaigns
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveSegmentId(
                                                activeSegmentId === segment._id ? null : segment._id
                                            )
                                        }
                                        className={`${Styles.btn} ${Styles["btn-info"]}`}
                                    >
                                        Send Campaign
                                    </button>
                                    {activeSegmentId === segment._id && (
                                        <div>
                                            <input
                                                type="text"
                                                className={Styles["form-control"]}
                                                placeholder="Hi [Name], here’s 10% off on your next order!"
                                                value={messageTemplate}
                                                onChange={(e) => setMessageTemplate(e.target.value)}
                                            />
                                            <button
                                                className={`${Styles.btn} ${Styles["btn-primary"]}`}
                                                onClick={() => handleSendMessage(segment._id)}
                                            >
                                                Send Message
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <i
                                        className="fas fa-trash"
                                        style={{ cursor: "pointer", color: "red" }}
                                        onClick={() => handleDeleteSegment(segment._id)}
                                        title="Delete Segment"
                                    ></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No segments found.</p>
            )}
        </div>
    );
}
