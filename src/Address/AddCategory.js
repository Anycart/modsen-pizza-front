import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AddCategory() {
  let navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    description: ""
  });

  const { name, description } = category;

  const onInputChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/categories", category, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
        }
      });
      navigate("/"); // Перенаправляем пользователя на главную страницу после успешного создания категории
    } catch (error) {
      console.error("Error creating category:", error);
      // Здесь можно добавить логику для обработки ошибок, например, вывод сообщения пользователю
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Add Category</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name"
                name="name"
                value={name}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                placeholder="Enter category description"
                name="description"
                value={description}
                onChange={onInputChange}
                rows="3"
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <button type="submit" className="btn btn-outline-primary me-2">
                Submit
              </button>
              <Link className="btn btn-outline-danger" to="/">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
