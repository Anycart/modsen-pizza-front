import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axiosInstance';

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2 className="text-center mt-4 mb-4">Order Details</h2>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Information</h5>
              <p><b>Order ID:</b> {order.id}</p>
              <p><b>Order Date:</b> {new Date(order.orderDate).toLocaleDateString()}</p>
              <p><b>Total Amount:</b> {order.totalAmount.toFixed(2)} BYN</p>

              <h5 className="card-title mt-4">Order Items</h5>
              <div className="list-group">
                {order.orderItems.map(orderItem => (
                  <div key={orderItem.id} className="list-group-item">
                    <h6 className="mb-2"><b>Product:</b> {orderItem.productResponseDto ? orderItem.productResponseDto.name : 'Unknown Product'}</h6>
                    <p className="mb-1"><b>Quantity:</b> {orderItem.quantity}</p>
                    <p className="mb-1"><b>Price:</b> {orderItem.price.toFixed(2)} BYN</p>
                    {orderItem.productResponseDto && orderItem.productResponseDto.image &&
                      <img src={orderItem.productResponseDto.image} alt={orderItem.productResponseDto.name} className="img-fluid" style={{ maxWidth: '100px' }} />
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
