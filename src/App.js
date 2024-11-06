import React, { useState, useEffect } from 'react';
import './App.css';

import BlogForm from './BlogForm/BlogForm';
import BlogList from './BlogList/BlogList';
import BlogModal from './BlogModal/BlogModal';
import styled from 'styled-components';

const Banner = styled.div`
  background-color: #4CAF50;
  color: white;
  padding: 100px 0px;
  text-align: center;
  margin-bottom: 50px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  font-weight: bold;
`;

const AddButton = styled.button`
  margin-top: 20px;
  padding: 12px 20px;
  font-size: 1rem;
  color: #4CAF50;
  background-color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f1f1f1;
  }
`;

function App() {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5001/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const addBlog = async (newBlog) => {
    if (editingBlog) {
      await updateBlog(editingBlog.id, newBlog);
    } else {
      try {
        const response = await fetch('http://localhost:5001/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBlog),
        });
        const savedBlog = await response.json();
        setBlogs([...blogs, savedBlog]);
      } catch (error) {
        console.error("Error adding blog:", error);
      }
    }
    setEditingBlog(null);
    setIsFormModalOpen(false);
  };

  const deleteBlog = async (id) => {
    try {
      await fetch(`http://localhost:5001/blogs/${id}`, {
        method: 'DELETE',
      });
      setBlogs(blogs.filter(blog => blog.id !== id));
      setSelectedBlog(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const updateBlog = async (id, updatedBlog) => {
    try {
      const response = await fetch(`http://localhost:5001/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBlog),
      });

      if (!response.ok) throw new Error('Failed to update the blog');
      const savedBlog = await response.json();
      setBlogs(prevBlogs => prevBlogs.map(blog => (blog.id === id ? savedBlog : blog)));
      setSelectedBlog(savedBlog);
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const startEditing = (blog) => {
    setEditingBlog(blog);
    setIsFormModalOpen(true);
  };

  const openCreateBlogModal = () => {
    setEditingBlog(null);
    setIsFormModalOpen(true);
  };

  const closeModal = () => {
    setIsFormModalOpen(false);
    setEditingBlog(null);
    setSelectedBlog(null);
  };

  const showBlogModal = (blog) => {
    setSelectedBlog(blog);
  };

  return (
    <div className="App">
      <Banner>
        <Title>My Blog</Title>
        <AddButton onClick={openCreateBlogModal}>Create New Blog</AddButton>
      </Banner>
      {isFormModalOpen && (
        <BlogForm
          addBlog={addBlog}
          editingBlog={editingBlog}
          clearEditingBlog={() => setEditingBlog(null)}
          onClose={closeModal}
        />
      )}
      {selectedBlog && (
        <BlogModal
          blog={selectedBlog}
          onClose={() => setSelectedBlog(null)}
          onEdit={() => startEditing(selectedBlog)}
          onDelete={() => deleteBlog(selectedBlog.id)}
        />
      )}
      <BlogList
        blogs={blogs}
        deleteBlog={deleteBlog}
        startEditing={startEditing}
        updateBlog={updateBlog}
        showBlogModal={showBlogModal}
      />
    </div>
  );
}

export default App;

