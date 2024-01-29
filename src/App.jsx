import React, { useEffect, useRef, useState } from "react";

import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  const inputRef = useRef(null);
  // 'https://dummyjson.com/users/search?q=John'

  useEffect(() => {
    const fetchUsers = () => {
      if (searchTerm.trim() === "") {
        setSuggestion([]);
        return;
      }
      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setSuggestion(data?.users))
        .catch((err) => console.log(err));
    };
    fetchUsers();
  }, [searchTerm]);

  const handleSelectedUser = (user) => {
    setSelectedUser([...selectedUser, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    inputRef.current.focus();
    setSearchTerm("");
    setSuggestion([]);
  };
  const handleRemoveUser = (user) => {
    const updateuser = selectedUser.filter(
      (selectedUser) => selectedUser.id !== user.id
    );
    setSelectedUser(updateuser);
    const updatedEmail = new Set(selectedUserSet);
    updatedEmail.delete(user.email);
    setSelectedUserSet(updatedEmail);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUser.length > 0
    ) {
      const updateUser = [...selectedUser];
      const lastUser = updateUser[updateUser.length - 1];
      console.log(lastUser);
      handleRemoveUser(lastUser);
      setSuggestion([]);
    }
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* pills suggestion */}
        {selectedUser.map((user) => {
          return (
            <Pill
              key={user?.email}
              image={user.image}
              text={`${user?.firstName} ${user.lastName}`}
              onClick={() => handleRemoveUser(user)}
            />
          );
        })}
        {/* input filed with search suggestion */}
        <input
          type="text"
          name="input"
          value={searchTerm}
          ref={inputRef}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="search for an user"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* search suggestion */}
      </div>
      {/* user suggestion list render */}

      <ul className="suggestion-list">
        {suggestion?.map((user, index) => {
          // if user in the suggestions is already selected then don't display again in the list.
          //selectedUserSet.has(id) jo hmne store ki thi in click pr in selectedUserSet
          return !selectedUserSet.has(user.email) ? (
            <li key={user?.email} onClick={() => handleSelectedUser(user)}>
              <img
                src={user?.image}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <span>
                {user.firstName} {user.lastName}
              </span>
            </li>
          ) : (
            <></>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
