import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import api from '../axiosInstance'; // Используйте '../axiosInstance' если файл находится в корне проекта

export default function AddProduct() {
    let navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: "", // Используем categoryId для хранения выбранного ID категории
        image: ""
    });

    const [categories, setCategories] = useState([]); // Состояние для хранения списка категорий

    const { name, description, price, categoryId, image } = product;

    // Загрузка списка категорий с сервера
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await api.get("/categories");
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
    }, []);

    const onInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/products", product);
            console.log(response.data);
            navigate("/");
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add Product</h2>

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter product name"
                                name="name"
                                value={name}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter product description"
                                name="description"
                                value={description}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">
                                Price
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter product price"
                                name="price"
                                value={price}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">
                                Image URL
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter product image URL"
                                name="image"
                                value={image}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="categoryId" className="form-label">
                                Category
                            </label>
                            <select
                                className="form-select"
                                name="categoryId"
                                value={categoryId}
                                onChange={(e) => onInputChange(e)}
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
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
