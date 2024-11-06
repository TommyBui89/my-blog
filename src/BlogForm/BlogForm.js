import React, { useEffect, useState } from "react";
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
    position: relative;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
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
    padding: 10px;
    font-size: 1.2rem;
    text-align: center;
`;

const TitleInput = styled.input`
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
`;

const TagInput = styled.input`
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 10px 0;
`;

const Tag = styled.span`
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    color: #333;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9rem;
    font-weight: 500;
`;

const RemoveButton = styled(FontAwesomeIcon)`
    margin-left: 8px;
    color: black;
    cursor: pointer;

    &:hover {
        color: #333;
    }
`;

const Content = styled.textarea`
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
    width: 100%;
    box-sizing: border-box;
    min-height: 200px;
`;

const CodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px 0;
`;

const CodeInput = styled.textarea`
    padding: 10px;
    font-size: 1rem;
    font-family: monospace;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
    width: 100%;
    box-sizing: border-box;
    min-height: 100px;
    background-color: #f7f7f9;
`;

const FormButton = styled.button`
    padding: 10px;
    font-size: 1rem;
    color: white;
    background-color: #4CAF50;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;

    &:hover {
        background-color: #45a049;
    }
`;

const ToggleCodeButton = styled.button`
    padding: 10px;
    font-size: 1rem;
    color: white;
    background-color: ${({ isRemoving }) => (isRemoving ? '#e63946' : '#007bff')};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;

    &:hover {
        background-color: ${({ isRemoving }) => (isRemoving ? '#d62828' : '#0056b3')};
    }
`;

function BlogForm({ addBlog, editingBlog, clearEditingBlog, onClose }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [codeSections, setCodeSections] = useState([]);

    useEffect(() => {
        if (editingBlog) {
            setTitle(editingBlog.title);
            setContent(editingBlog.content);
            setTags(editingBlog.tags || []);
            setCodeSections(editingBlog.codeSections || []);
        } else {
            setTitle('');
            setContent('');
            setTags([]);
            setCodeSections([]);
        }
    }, [editingBlog]);

    const handleTagInput = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            e.target.value = '';
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const addCodeSection = () => {
        setCodeSections([...codeSections, ""]);
    };

    const removeCodeSection = () => {
        setCodeSections(codeSections.slice(0, -1));
    };

    const handleCodeChange = (index, value) => {
        const updatedCodeSections = [...codeSections];
        updatedCodeSections[index] = value;
        setCodeSections(updatedCodeSections);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const blogData = {
            ...editingBlog,
            title,
            content,
            tags,
            codeSections,
            date: editingBlog ? editingBlog.date : new Date().toLocaleDateString(),
        };
        addBlog(blogData);
        clearForm();
    };

    const clearForm = () => {
        setTitle('');
        setContent('');
        setTags([]);
        setCodeSections([]);
        clearEditingBlog();
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <Overlay onClick={handleOverlayClick}>
            <ModalContainer>
                <CloseButton onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </CloseButton>
                <Title>{editingBlog ? "Edit Blog Post" : "Create a New Blog Post"}</Title>
                <form onSubmit={handleSubmit}>
                    <TitleInput
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                    />
                    <TagInput
                        type="text"
                        onKeyDown={handleTagInput}
                        placeholder="Enter tags and press Enter"
                    />
                    <TagContainer>
                        {tags.map(tag => (
                            <Tag key={tag}>
                                {tag}
                                <RemoveButton icon={faTimes} onClick={() => handleRemoveTag(tag)} />
                            </Tag>
                        ))}
                    </TagContainer>
                    <Content
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        required
                    />
                    <CodeContainer>
                        {codeSections.map((code, index) => (
                            <CodeInput
                                key={index}
                                value={code}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                placeholder="Enter code here"
                            />
                        ))}
                    </CodeContainer>
                    <ToggleCodeButton
                        type="button"
                        onClick={codeSections.length ? removeCodeSection : addCodeSection}
                        isRemoving={!!codeSections.length}
                    >
                        {codeSections.length ? "Remove Code Section" : "Add Code Section"}
                    </ToggleCodeButton>
                    <FormButton type="submit">{editingBlog ? "Save Changes" : "Add Blog Post"}</FormButton>
                </form>
            </ModalContainer>
        </Overlay>
    );
}

export default BlogForm;
