import React, { useEffect, useState } from 'react';
import { Modal, message, Button } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './Cities.css';

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [id, setId] = useState(null);
  const [data, setData] = useState({ name: "", slug: "", text: "", images: null });
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Added state for delete modal

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTczNzkzNTUtZDNjYi00NzY1LTgwMGEtNDZhOTU1NWJiOWQyIiwidG9rZW5fdHlwZSI6ImFjY2VzcyIsImlhdCI6MTcxODYxNTMzOCwiZXhwIjoxNzUwMTUxMzM4fQ.8VHqHugzBuuXAF2A01S6etFMf2Ou_YD1OiZn3Uc96oI';

  const urlImg = "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  const getCities = () => {
    setLoading(true);
    fetch('https://autoapi.dezinfeksiyatashkent.uz/api/cities')
      .then(res => res.json())
      .then(data => {
        setCities(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCities();
  }, []);

  const handleEdit = (item) => {
    setId(item.id);
    setData({ name: item.name, slug: item.slug, text: item.text, images: item.image_src });
    setOpenEditModal(true);
  };

  const handleDelete = (id) => {
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: "DELETE"
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          const newCities = cities.filter(city => city.id !== id);
          setCities(newCities);
          message.success("City deleted successfully.");
        } else {
          message.error("Failed to delete city.");
        }
      })
      .catch(error => {
        console.error('Error deleting city:', error);
        message.error("Failed to delete city.");
      });
  };

  const handleAdd = () => {
    setOpenAddModal(true);
    setData({ name: "", slug: "", text: "", images: null });
  };

  const addCity = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('text', data.text);
    formData.append('slug', data.slug);
    if (data.images instanceof File) {
      formData.append('images', data.images);
    }

    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cities`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          handleClose();
          getCities();
          message.success("City added successfully.");
        } else {
          message.error("Failed to add city.");
        }
      })
      .catch(error => {
        console.error('Error adding city:', error);
        message.error("Failed to add city.");
      });
  };

  const editCity = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('text', data.text);
    formData.append('slug', data.slug);
    if (data.images instanceof File) {
      formData.append('images', data.images);
    }

    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: "PUT",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          handleClose();
          getCities();
          message.success("City updated successfully.");
        } else {
          message.error("Failed to update city.");
        }
      })
      .catch(error => {
        console.error('Error updating city:', error);
        message.error("Failed to update city.");
      });
  };

  const handleClose = () => {
    setOpenEditModal(false);
    setOpenAddModal(false);
    setOpenDeleteModal(false); // Close delete modal when handle close is called
  };

  const confirmDelete = (id) => {
    setId(id);
    setOpenDeleteModal(true);
  };

  const deleteCity = () => {
    handleDelete(id);
    setOpenDeleteModal(false);
  };

  return (
    <div>
      <div className="cities-adds">
        <h1>Cities</h1>
        <Button type="primary" className="add-button" onClick={handleAdd} icon={<PlusOutlined />}></Button>
      </div>
      <table className="customers">
        <thead>
          <tr>
            <th>No</th>
            <th>Images</th>
            <th>Name</th>
            <th>Text</th>
            <th>Slug</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6">Loading...</td>
            </tr>
          ) : (
            cities.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td><img src={`${urlImg}${item.image_src}`} alt={item.name} /></td>
                <td>{item.name}</td>
                <td>{item.text}</td>
                <td>{item.slug}</td>
                <td>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(item)}>Edit</Button>
                  <Button type="link" icon={<DeleteOutlined />} onClick={() => confirmDelete(item.id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal
        title="Edit City"
        visible={openEditModal}
        onCancel={handleClose}
        footer={null}
      >
        <form onSubmit={editCity}>
          <label>Name:</label>
          <input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
          <label>Text:</label>
          <input type="text" value={data.text} onChange={e => setData({ ...data, text: e.target.value })} />
          <label>Slug:</label>
          <input type="text" value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })} />
          <label>Image:</label>
          <input type="file" onChange={e => setData({ ...data, images: e.target.files[0] })} accept="image/*" />
          <Button type="primary" htmlType="submit">Update</Button>
        </form>
      </Modal>

      <Modal
        title="Add City"
        visible={openAddModal}
        onCancel={handleClose}
        footer={null}
      >
        <form onSubmit={addCity}>
          <label>Name:</label>
          <input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
          <label>Text:</label>
          <input type="text" value={data.text} onChange={e => setData({ ...data, text: e.target.value })} />
          <label>Slug:</label>
          <input type="text" value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })} />
          <label>Image:</label>
          <input type="file" onChange={e => setData({ ...data, images: e.target.files[0] })} accept="image/*" />
          <Button type="primary" htmlType="submit">Add</Button>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Delete City"
        visible={openDeleteModal}
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Cancel
          </Button>,
          <Button key="delete" type="primary" danger onClick={deleteCity}>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this city?</p>
      </Modal>
    </div>
  );
};

export default Cities;
