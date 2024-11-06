import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;

    &:hover {
        color: #555;
    }
`;

const Title = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 10px;
`;

const Date = styled.small`
    font-size: 0.9rem;
    color: #888;
    display: block;
    margin-bottom: 10px;
`;

const Content = styled.p`
    font-size: 1rem;
    color: #555;
    line-height: 1.5;
    margin-bottom: 15px;
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

const CodeLabel = styled.div`
    font-size: 1rem;
    color: #333;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 5px;
`;

const CodeSection = styled.pre`
    background-color: #f7f7f9;
    padding: 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-family: monospace;
    color: #333;
    overflow-x: auto;
    text-align: left;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
`;

const EditButton = styled.button`
    padding: 8px 12px;
    font-size: 1rem;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

const DeleteButton = styled.button`
    padding: 8px 12px;
    font-size: 1rem;
    color: white;
    background-color: #e63946;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #d62828;
    }
`;

const ConfirmOverlay = styled(Overlay)`
    background-color: rgba(0, 0, 0, 0.7); /* Slightly darker background for the confirmation modal */
`;

const ConfirmModal = styled(ModalContainer)`
    max-width: 400px;
    text-align: center;
`;

const ConfirmButton = styled.button`
    padding: 8px 12px;
    margin: 10px;
    font-size: 1rem;
    color: white;
    background-color: ${({ confirm }) => (confirm ? '#e63946' : '#ccc')};
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: ${({ confirm }) => (confirm ? '#d62828' : '#aaa')};
    }
`;

function BlogModal({ blog, onClose, onEdit, onDelete }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleDeleteClick = () => {
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        onDelete();
        setIsConfirmOpen(false);
        onClose();
    };

    const cancelDelete = () => {
        setIsConfirmOpen(false);
    };

    if (!blog) return null;

    return (
        <>
            <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
                <ModalContainer>
                    <CloseButton onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </CloseButton>
                    <Title>{blog.title}</Title>
                    <Date>{blog.date}</Date>
                    <Tags>
                        {blog.tags && blog.tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </Tags>
                    <Content>{blog.content}</Content>
                    {blog.codeSections && blog.codeSections.map((code, index) => (
                        <div key={index}>
                            <CodeLabel>Code:</CodeLabel>
                            <CodeSection>{code}</CodeSection>
                        </div>
                    ))}
                    <ButtonGroup>
                        <EditButton onClick={onEdit}>Edit</EditButton>
                        <DeleteButton onClick={handleDeleteClick}>Delete</DeleteButton>
                    </ButtonGroup>
                </ModalContainer>
            </Overlay>
            {isConfirmOpen && (
                <ConfirmOverlay onClick={(e) => e.target === e.currentTarget && cancelDelete()}>
                    <ConfirmModal>
                        <p>Are you sure you want to delete this blog post?</p>
                        <ConfirmButton confirm onClick={confirmDelete}>Yes, Delete</ConfirmButton>
                        <ConfirmButton onClick={cancelDelete}>Cancel</ConfirmButton>
                    </ConfirmModal>
                </ConfirmOverlay>
            )}
        </>
    );
}

export default BlogModal;
