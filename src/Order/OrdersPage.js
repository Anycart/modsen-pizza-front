import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../axiosInstance';
import { jwtDecode } from 'jwt-decode';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = getUserId(); // Получаем идентификатор текущего пользователя
      const response = await api.get(`/orders/user/${userId}`); // Запрашиваем заказы конкретного пользователя
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getUserId = () => {
    const jwtToken = localStorage.getItem('jwt-token');
    if (jwtToken) {
      const decodedToken = jwtDecode(jwtToken);
      return decodedToken.id; // Возвращаем идентификатор пользователя из декодированного токена
    }
    return null;
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2 className="text-center mt-4 mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Order Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/order/${order.id}`} className="btn btn-primary btn-sm">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
