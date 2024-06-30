import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import AddProduct from './products/AddProduct';
import EditProduct from './products/EditProduct';
import ViewProduct from './products/ViewProduct';
import Login from './authorization/login';
import UserPage from './account/userPage';
import Basket from './basket/Basket';
import Registration from './authorization/Registration';
import Order from './Order/Order';
import OrdersPage from './Order/OrdersPage';
import ViewOrder from './Order/ViewOrder';
import AddAddress from './Address/AddCategory';
import AddCategory from './Address/AddCategory';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/addproduct" element={<AddProduct />} />
          <Route exact path="/editproduct/:id" element={<EditProduct />} />
          <Route exact path="/viewproduct/:id" element={<ViewProduct />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profile" element={<UserPage />} />
          <Route exact path="/basket" element={<Basket />} />
          <Route exact path="/registration" element={<Registration />} />
          <Route exact path="/createOrder" element={<Order />} />
          <Route exact path="/orders" element={<OrdersPage />} />
          <Route exact path="/order/:id" element={<ViewOrder />} />
          <Route exact path="/addcategory" element={<AddCategory />} />
          <Route path="/categories/:categoryId" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
