import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../components/styles/Items.css';
import 'bulma/css/bulma.min.css';
import { Helmet } from 'react-helmet';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const Items = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Test');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showErrorToast('You are not authorized to access this page. Please login as Admin.');
      navigate('/admin-login');
    } else {
      fetchItems();
    }
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('/api/items');
      setItems(res.data);
    } catch (err) {
      showErrorToast('Failed to fetch items.');
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post('/api/items/add', { name, price, type });
      setName('');
      setPrice('');
      setType('Test');
      showSuccessToast('Item added to the list successfully!');
      fetchItems();
    } catch (err) {
      showErrorToast('Failed to add item.');
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  
  const offset = currentPage * itemsPerPage;
  const currentItems = items.slice(offset, offset + itemsPerPage);

  return (
    <div className="items-container">
       <Helmet>
        <title>Manage Test & Services Page</title>
      </Helmet>
      <div className="items-wrapper box">
        <h1 className="title items-title">Tests and Services</h1>
        <div className="items-form">
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input items-input"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Price (BDT)</label>
            <div className="control">
              <input
                type="number"
                placeholder="Price (BDT)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input items-input"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Type</label>
            <div className="control">
              <div className="select items-select">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Test">Test</option>
                  <option value="Service">Service</option>
                </select>
              </div>
            </div>
          </div>
          <button onClick={handleAddItem} className="button is-primary items-button">
            Add Item
          </button>
        </div>
        <ul className="items-list">
          {currentItems.map((item) => (
            <li key={item._id} className="items-list-item">
              <div className="items-list-item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-price">{item.price} BDT</span>
                <span className="item-type">{item.type}</span>
              </div>
            </li>
          ))}
        </ul>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={Math.ceil(items.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default Items;