import React, { useEffect, useState } from 'react';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import './account.css';

export default function UserPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt-token");
        const decodedToken = jwtDecode(token);
        localStorage.setItem("decoded-token", decodedToken);
        const userId = decodedToken.id; // Функция для извлечения id пользователя из токена
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = response.data;
        setUser(userData);
      } catch (error) {
        console.error("Ошибка получения данных пользователя:", error);
      }
    };

    fetchUser();
  }, []);

  const renderAddresses = () => {
    if (user && user.addresses && user.addresses.length > 0) {
      return (
        <div>
          <strong>Addresses:</strong>
          <ul>
            {user.addresses.map((address, index) => (
              <li key={index}>
                <strong>Address {index + 1}:</strong>
                <ul>
                  <li>
                    <strong>Street:</strong> {address.street}
                  </li>
                  <li>
                    <strong>House Number:</strong> {address.houseNumber}
                  </li>
                  <li>
                    <strong>Apartment Number:</strong> {address.apartmentNumber}
                  </li>
                  <li>
                    <strong>Post Code:</strong> {address.postCode}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <Link to={"/newAddress"} >Add Address</Link>
      );
    }
  };

  return (
    <div className="user-page">
      {user ? (
        <div className="user-details">
          <h2>User Details</h2>
          <div className="user-image">
            <img src={user.image} alt="User" />
          </div>
          <div className="user-info">
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Username:</strong> {user.username}
            </div>
          </div>
          <div className="user-addresses">{renderAddresses()}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}