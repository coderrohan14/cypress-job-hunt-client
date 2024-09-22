import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // Make sure to create this CSS file

function App() {
  const server_url =
    "https://c9b9-2601-647-cb00-4100-7d23-164b-6c3f-f4ae.ngrok-free.app";
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [jobName, setJobName] = useState("");
  const [jobUrl, setJobUrl] = useState("");

  const resetForm = () => {
    setJobName("");
    setJobUrl("");
    setSelectedUsers([]);
    setSelectAll(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${server_url}/users`, {
          headers: {
            "ngrok-skip-browser-warning": "true", // Adding the custom header to bypass the ngrok warning
          },
        });
        setUsers(response.data);
      } catch (error) {
        toast.error(error.request.data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };
    fetchUsers();
  }, []);

  const handleCheckboxIndividual = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCheckboxChange = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.userId));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${server_url}/addJob`,
        {
          jobName,
          jobUrl,
          userIds: selectedUsers,
          common: selectAll,
        },
        {
          headers: {
            "ngrok-skip-browser-warning": "true", // Include the header to bypass the ngrok warning
          },
        }
      );
      toast.success(`Job submitted successfully!`, {
        position: "top-right",
        autoClose: 5000,
      });
      resetForm();
    } catch (error) {
      resetForm();
      let errorMessage = "Failed to submit job. Unknown error occurred.";
      if (error.response && error.response.data && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="App">
      <h1>Cypress Job Hunt</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label>Company Name:</label>
          <input
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>URL:</label>
          <input
            type="text"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
          />
        </div>
        <div className="user-selection">
          <div className="checkbox-all">
            <label className="select-all">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleCheckboxChange}
              />
              Select All Users (Toggle)
            </label>
          </div>
          <div className="checkbox-list">
            {users.map((user) => (
              <label key={user.userId} className="user-checkbox">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.userId)}
                  onChange={() => handleCheckboxIndividual(user.userId)}
                  disabled={selectAll}
                />
                {user.name}
              </label>
            ))}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default App;
