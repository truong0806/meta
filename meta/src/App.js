"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function WalletConnection() {
  const [walletAddress, setWalletAddress] = useState();
  const [error, setError] = useState();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    age: "",
    level: "",
    address: "",
  });
  const [editPlayer, setEditPlayer] = useState(null);
  const [errors, setErrors] = useState({});
  const savePlayersToLocalStorage = (playersData) => {
    localStorage.setItem("players", JSON.stringify(playersData));
  };
  const getPlayersFromLocalStorage = () => {
    const storedPlayers = localStorage.getItem("players");
    return storedPlayers ? JSON.parse(storedPlayers) : [];
  };
  const updatePlayer = (playerId, updatedData) => {
    const updatedPlayers = players.map((player) =>
      player.id === playerId ? { ...player, ...updatedData } : player
    );
    setPlayers(updatedPlayers);
    savePlayersToLocalStorage(updatedPlayers);
    closeEditModal();
  };
  const openEditModal = (player) => {
    setEditPlayer(player);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setEditPlayer(null);
    setShowEditModal(false);
  };

  const deletePlayer = (playerId) => {
    const updatedPlayers = players.filter((player) => player.id !== playerId);
    setPlayers(updatedPlayers);
    savePlayersToLocalStorage(updatedPlayers);
  };

  useEffect(() => {
    checkWalletConnection();
    const initialPlayers = getPlayersFromLocalStorage();
    setPlayers(initialPlayers);
    setLoading(false);

    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);
  const validateInputs = () => {
    const newErrors = {};
    if (!newPlayer.name) newErrors.name = "Name is required.";
    if (!newPlayer.age || isNaN(newPlayer.age) || newPlayer.age <= 0) {
      newErrors.age = "Valid age is required.";
    }
    if (!newPlayer.level || isNaN(newPlayer.level) || newPlayer.level <= 0) {
      newErrors.level = "Valid level is required.";
    }
    if (!newPlayer.address) newErrors.address = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err) {
        console.error("Failed to check wallet connection:", err);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setError(null);
      } catch (err) {
        setError("Failed to connect wallet. Please try again.");
        console.error("Failed to connect wallet:", err);
      }
    } else {
      setError(
        "MetaMask is not installed. Please install it to connect your wallet."
      );
    }
  };

  const openAddPlayerModal = () => {
    setShowModal(true);
  };

  const closeAddPlayerModal = () => {
    setShowModal(false);
    setNewPlayer({ name: "", age: "", level: "", address: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer((prev) => ({ ...prev, [name]: value }));
  };

  const addPlayer = () => {
    if (validateInputs()) {
      const newId = players.length ? players[players.length - 1].id + 1 : 1;
      const updatedPlayers = [...players, { ...newPlayer, id: newId }];
      setPlayers(updatedPlayers);
      savePlayersToLocalStorage(updatedPlayers);
      closeAddPlayerModal();
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Connect Wallet</h2>
        <p className="text-gray-600 mb-6 text-center">Connect your wallet</p>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {walletAddress ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <i className="fas fa-wallet"></i>
              <span className="font-medium">Wallet:</span>
            </div>
            <code className="block bg-gray-100 p-2 rounded-md text-sm break-all">
              {walletAddress}
            </code>
            <button
              onClick={openAddPlayerModal}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              Add Player
            </button>
            {walletAddress && (
              <div className="mt-4">
                {loading ? (
                  <p className="text-center">Loading players...</p>
                ) : (
                  <table className="w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-2">ID</th>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Age</th>
                        <th className="border border-gray-300 p-2">Level</th>
                        <th className="border border-gray-300 p-2">Address</th>
                        <th className="border border-gray-300 p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.length > 0 ? (
                        players.map((player) => (
                          <tr key={player.id}>
                            <td className="border border-gray-300 p-2">
                              {player.id}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {player.name}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {player.age}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {player.level}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {player.address}
                            </td>
                            <td className="border flex items-center justify-center gap-2 border-gray-300 p-2">
                              <button
                                onClick={() => openEditModal(player)}
                                className="text-blue-500 hover:text-blue-700 mr-2"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => deletePlayer(player.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="border border-gray-300 p-4 text-center text-gray-500"
                          >
                            No players available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            <i className="fas fa-link mr-2"></i>
            Kết nối MetaMask
          </button>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Add New Player</h3>
              <input
                name="name"
                placeholder="Name"
                value={newPlayer.name}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}

              <input
                name="age"
                placeholder="Age"
                value={newPlayer.age}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age}</p>
              )}

              <input
                name="level"
                placeholder="Level"
                value={newPlayer.level}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              {errors.level && (
                <p className="text-red-500 text-sm">{errors.level}</p>
              )}

              <input
                name="address"
                placeholder="Address"
                value={newPlayer.address}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeAddPlayerModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={addPlayer}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Add Player
                </button>
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Edit Player</h3>
              <input
                name="name"
                placeholder="Name"
                value={editPlayer.name}
                onChange={(e) =>
                  setEditPlayer((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                name="age"
                placeholder="Age"
                value={editPlayer.age}
                onChange={(e) =>
                  setEditPlayer((prev) => ({ ...prev, age: e.target.value }))
                }
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                name="level"
                placeholder="Level"
                value={editPlayer.level}
                onChange={(e) =>
                  setEditPlayer((prev) => ({ ...prev, level: e.target.value }))
                }
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />
              <input
                name="address"
                placeholder="Address"
                value={editPlayer.address}
                onChange={(e) =>
                  setEditPlayer((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className="w-full p-2 mb-2 border border-gray-300 rounded"
              />

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeEditModal}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updatePlayer(editPlayer.id, editPlayer)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

