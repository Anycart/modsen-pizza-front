import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

export default function Basket() {
  const [cartItems, setCartItems] = useState([]);
  const [userAddresses, setUserAddress] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    fetchUserAddress();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.get(`http://localhost:8080/api/bucket/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartItems(response.data.products);
    } catch (error) {
      console.log('Error fetching cart items:', error);
    }
  };

  const fetchUserAddress = async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserAddress(response.data.addresses);
    } catch (error) {
      console.log('Error fetching user address:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem("jwt-token");
      const response = await axios.delete(`http://localhost:8080/api/bucket?id=${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Item successfully removed from cart
        fetchCartItems(); // Refresh the cart items
      } else {
        console.log('Error removing item from cart');
      }
    } catch (error) {
      console.log('Error removing item from cart:', error);
    }
  };

  return (
    <div className="container">
      <h1>Basket</h1>
      {cartItems.length === 0 ? (
        <p>No items in the basket</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <img height={500}
                    src={item.image} />
                  <td>{item.tittle}</td>
                  <td>{item.price}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.id)}>-</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {userAddresses.length !== 0 ? (
            <Link className='btn btn-outline-danger mx-2' to="/createOrder">Create Order</Link>
          ) : (
            <p>Please add an address before creating an order</p>
          )}
        </>
      )}
    </div>
  );
}