import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../axiosInstance';

import 'bootstrap/dist/css/bootstrap.min.css'; // Импортируем стили Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Импортируем скрипты Bootstrap

export default function Navbar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [fullName, setFullName] = useState('');
  const jwtToken = localStorage.getItem('jwt-token');
  const decodedToken = jwtToken ? jwtDecode(jwtToken) : null;

  const handleLogout = () => {
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('refreshToken'); // Удаляем refreshToken при выходе
    navigate('/'); // Перенаправляем пользователя на главную страницу после выхода
  };

  useEffect(() => {
    if (decodedToken) {
      setFullName(decodedToken.fullName); // Устанавливаем fullName из декодированного токена
    } else {
      console.log('No decoded token found');
    }
  }, [decodedToken]); // Зависимость только от decodedToken

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cachedCategories = localStorage.getItem('cachedCategories');
        if (cachedCategories) {
          setCategories(JSON.parse(cachedCategories));
        } else {
          const response = await api.get("/categories");
          const fetchedCategories = response.data;
          setCategories(fetchedCategories);
          localStorage.setItem('cachedCategories', JSON.stringify(fetchedCategories));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories(); // Вызываем fetchCategories при монтировании компонента
  }, []); // Зависимость пустая, чтобы вызвать эффект только один раз при монтировании

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Pizza & Members
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav">
            {decodedToken !== null && decodedToken.roles === 'ADMIN' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/addproduct">
                    Add Product
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/addcategory">
                    Add Category
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="navbarDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </button>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                {categories.map(category => (
                  <li key={category.id}>
                    <Link className="dropdown-item" to={`/categories/${category.id}`}>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                Orders
              </Link>
            </li>
            {localStorage.getItem('jwt-token') ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">{fullName}</span>
                </li>
                <li className="nav-item">
                  <button type="button" onClick={handleLogout} className="nav-link">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registration">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
