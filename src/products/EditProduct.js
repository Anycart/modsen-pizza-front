import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../axiosInstance";

export default function EditProduct() {
    let navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        image: ""
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadProduct();
        fetchCategories();
    }, []);

    const { name, description, price, categoryId, image } = product;

    const onInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${id}`, product);
            navigate("/");
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const loadProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error loading product:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Edit Product</h2>

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
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="categoryId" className="form-label">
                                Category
                            </label>
                            <select
                                className="form-control"
                                name="categoryId"
                                value={categoryId}
                                onChange={(e) => onInputChange(e)}
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
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
