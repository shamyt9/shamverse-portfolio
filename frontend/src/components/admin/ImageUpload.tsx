import React, { useState, useRef } from 'react';
import {
    Upload,
    X,
    AlertCircle,
    CheckCircle,
    Loader,
} from 'lucide-react';
import api from '../../services/api';
import './ImageUpload.css';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    required?: boolean;
    acceptedFormats?: string[];
    maxSizeMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label = 'Upload Image',
    required = false,
    acceptedFormats = ['jpg', 'png', 'jpeg', 'webp'],
    maxSizeMB = 5,
}) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        setError('');

        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return false;
        }

        // Check file format
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
            setError(
                `Only ${acceptedFormats.join(', ').toUpperCase()} formats are allowed`,
            );
            return false;
        }

        return true;
    };

    const uploadFile = async (file: File) => {
        if (!validateFile(file)) return;

        setUploading(true);
        setProgress(0);
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );
                        setProgress(percentCompleted);
                    }
                },
            });

            onChange(response.data.url);
            setSuccess('Image uploaded successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    'Failed to upload image',
            );
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            uploadFile(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            uploadFile(files[0]);
        }
    };

    const handleRemoveImage = () => {
        onChange('');
        setError('');
        setSuccess('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="image-upload-container">
            {label && <label className="upload-label">{label}</label>}

            {error && (
                <div className="upload-error">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {success && (
                <div className="upload-success">
                    <CheckCircle size={18} />
                    {success}
                </div>
            )}

            {value ? (
                <div className="image-preview-section">
                    <div className="preview-image-wrapper">
                        <img
                            src={value}
                            alt="Preview"
                            className="preview-image"
                        />
                        <div className="preview-overlay">
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={handleRemoveImage}
                                title="Remove image"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="preview-info">
                        <p className="preview-url">{value}</p>
                        <button
                            type="button"
                            className="change-btn"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={16} /> Change Image
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`upload-zone ${isDragging ? 'dragging' : ''} ${
                        uploading ? 'uploading' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={acceptedFormats
                            .map((fmt) => `.${fmt}`)
                            .join(',')}
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="file-input"
                    />

                    {uploading ? (
                        <div className="upload-progress">
                            <Loader className="spinner" size={32} />
                            <p className="progress-text">Uploading...</p>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="progress-percent">{progress}%</p>
                        </div>
                    ) : (
                        <div className="upload-content">
                            <Upload size={40} className="upload-icon" />
                            <p className="upload-title">
                                Click to upload or drag and drop
                            </p>
                            <p className="upload-subtitle">
                                {acceptedFormats
                                    .map((fmt) => fmt.toUpperCase())
                                    .join(', ')}{' '}
                                • Max {maxSizeMB}MB
                            </p>
                        </div>
                    )}
                </div>
            )}

            {required && !value && (
                <span className="required-indicator">*</span>
            )}
        </div>
    );
};

export default ImageUpload;
