import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();

  const [login, setLogin] = useState({
    username: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState(""); // Состояние для хранения сообщения об ошибке

  const { username, password } = login;

  const onInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", login);
      const token = response.data["accessToken"];
      const refreshToken = response.data["refreshToken"]; // Получаем токен из ответа сервера
  
      if (token) {
        // Сохраняем токен в локальном хранилище
        localStorage.setItem("jwt-token", token);
        localStorage.setItem("refreshToken", refreshToken);
        // Перенаправляем пользователя на главную страницу
        navigate("/");
      } else {
        // Если токен не получен, выводим сообщение об ошибке
        setErrorMessage("Ошибка входа: Неверные логин или пароль");
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      setErrorMessage("Ошибка входа: " + error.message); // Показываем сообщение об ошибке пользователю
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form style={{ width: "300px", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }} onSubmit={onSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
        {errorMessage && (
          <p style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", textAlign: "center" }}>
            {errorMessage}
          </p>
        )}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="username">Username:</label>
          <input
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={onInputChange}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password:</label>
          <input
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={onInputChange}
          />
        </div>
        <button
          style={{ width: "100%", padding: "10px", borderRadius: "3px", border: "none", backgroundColor: "#4CAF50", color: "white" }}
          type="submit"
        >
          Submit
        </button>
        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Don't have an account? <Link to="/registration">Register</Link>
        </p>
      </form>
    </div>
  );
}
