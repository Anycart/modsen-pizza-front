import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../axiosInstance';
import { jwtDecode } from 'jwt-decode';

export default function ViewProduct() {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Используем useNavigate для перенаправления

    const { id } = useParams();

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteProduct = async () => {
        try {
            await api.delete(`/products/${id}`);
            // Perform any necessary cleanup or display a success message
            // ...

            // Navigate to the home page
            navigate('/'); // Редирект на главную страницу после удаления продукта
        } catch (error) {
            setError(error.message);
        }
    };

    const createOrder = async () => {
        try {
            const jwtToken = localStorage.getItem('jwt-token');
            const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;
            const response = await api.post(`/orders`, {
                userId: decodedToken.id, // Assuming userId is not required for non-authenticated users
                orderDate: new Date(),
                totalAmount: product.price,
                orderItems: [{
                    quantity: 1,
                    price: product.price,
                    productId: product.id
                }]
            });
            // Handle success, e.g., show confirmation message
            console.log('Order created:', response.data);
            navigate('/'); // Редирект на главную страницу после создания заказа
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Product Details</h2>
    
                    {error && <div className="alert alert-danger">{error}</div>}
    
                    <div className="card" height={400} width={400}>
                        <div>
                            <ul className="list-group list-group-flush">
                                <img height={500} src={product.image} alt="Product" />
                                <li className="list-group-item">
                                    <b>Name:</b> {product.name}
                                </li>
                                <li className="list-group-item">
                                    <b>Description:</b> {product.description}
                                </li>
                                <li className="list-group-item">
                                    <b>Price:</b> {product.price}
                                </li>
                            </ul>
                        </div>
                    </div>
    
                    <div className="d-flex justify-content-between mt-4">
                        <button className="btn btn-primary" onClick={createOrder}>
                            Buy
                        </button>
                        <Link className="btn btn-primary" to={`/editproduct/${id}`}>
                            Edit
                        </Link>
                        <button className="btn btn-danger" onClick={deleteProduct}>
                            Delete
                        </button>
                    </div>
    
                    <Link className="btn btn-primary my-2" to={'/'}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
