import React, { useState } from "react";
import styled from 'styled-components';
import BlogModal from '../BlogModal/BlogModal';
import BlogForm from '../BlogForm/BlogForm';

const BlogListContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
`;

const BlogPost = styled.div`
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-10px);
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    }
`;

const Title = styled.h3`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 10px;
`;

const Content = styled.p`
    font-size: 1rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 15px;
`;

const Date = styled.small`
    font-size: 0.9rem;
    color: #888;
    display: block;
    margin-bottom: 10px;
`;

const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    margin: 10px 0;
`;

const Tag = styled.span`
    background-color: #e0e0e0;
    color: #333;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
`;

function BlogList({ blogs, deleteBlog, startEditing, updateBlog }) {
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const openBlogModal = (blog) => {
        setSelectedBlog(blog);
    };

    const closeBlogModal = () => {
        setSelectedBlog(null);
        setShowEditForm(false); // Close edit form when closing the modal
    };

    const handleEdit = () => {
        setShowEditForm(true); // Show the edit form overlay
    };

    const handleSaveEdit = (updatedBlog) => {
        updateBlog(updatedBlog.id, updatedBlog); // Call updateBlog to save changes
        setSelectedBlog(updatedBlog); // Update local selectedBlog to reflect changes
        setShowEditForm(false); // Close edit form after saving
    };    

    return (
        <BlogListContainer>
            {blogs.length === 0 && <p>No blog posts available</p>}
            {blogs.map((blog, index) => (
                <BlogPost key={index} onClick={() => openBlogModal(blog)}>
                    <Title>{blog.title}</Title>
                    <Date>{blog.date}</Date>
                    <Tags>
                        {blog.tags && blog.tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </Tags>
                    <Content>{blog.content.substring(0, 100)}...</Content>
                </BlogPost>
            ))}
            {selectedBlog && (
                <>
                    <BlogModal
                        blog={selectedBlog}
                        onClose={closeBlogModal}
                        onEdit={handleEdit}
                        onDelete={() => deleteBlog(selectedBlog.id)}
                    />
                    {showEditForm && (
                        <BlogForm
                            addBlog={handleSaveEdit}
                            editingBlog={selectedBlog}
                            clearEditingBlog={() => setShowEditForm(false)}
                            onClose={() => setShowEditForm(false)}
                        />
                    )}
                </>
            )}
        </BlogListContainer>
    );
}

export default BlogList;
