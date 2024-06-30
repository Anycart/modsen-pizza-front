import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import api from '../axiosInstance';
import axios from 'axios'; // Импортируем axios для работы с авторизацией

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { categoryId } = useParams();
  const navigate = useNavigate(); // Используем useNavigate для навигации

  useEffect(() => {
    if (categoryId) {
      loadProductsByCategory(categoryId);
    } else {
      loadAllProducts();
    }
  }, [categoryId]);

  const loadAllProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const loadProductsByCategory = async (categoryId) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`);
      setProducts(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // Попытка обновления токена с помощью рефреш-токена
        const refreshToken = localStorage.getItem('refresh-token');
        const refreshResponse = await axios.post('http://localhost:8080/api/auth/refresh', {
          refreshToken: refreshToken
        });

        // Если обновление успешно, сохраняем новый JWT
        localStorage.setItem('jwt-token', refreshResponse.data.accessToken);

        // Повторяем запрос, который вызвал ошибку
        error.config.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        const retryResponse = await axios.request(error.config);

        // Обновляем состояние компонента с новыми данными
        setProducts(retryResponse.data);
        setError(null);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        setError('Error refreshing token');
        // Очищаем токены и перенаправляем пользователя на страницу входа
        localStorage.removeItem('jwt-token');
        localStorage.removeItem('refresh-token');
        navigate('/login'); // Используем navigate для перенаправления на страницу входа
      }
    } else {
      setError(error.response ? error.response.statusText : 'Error: Network Error');
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        <div className="row">
          {error && <div className="alert alert-danger">{error}</div>}
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card">
                <div className="card-body">
                  <img height={100} src={product.image} alt={product.name} />
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Price: {product.price} BYN</p>
                  <Link to={`/viewproduct/${product.id}`} className="btn btn-primary mr-2">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
