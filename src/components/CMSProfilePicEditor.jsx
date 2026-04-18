import React, { useState, useRef } from 'react'
import { adminAPI } from '../services/api'
import '../styles/admin.css'

export default function CMSProfilePicEditor({ onUpdate }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ File size must be less than 5MB')
        return
      }

      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result)
      }
      reader.readAsDataURL(file)
      setMessage('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('❌ Please select a file first')
      return
    }

    setUploading(true)
    try {
      const response = await adminAPI.uploadProfilePic(selectedFile)
      setMessage('✅ Profile picture uploaded successfully!')
      setSelectedFile(null)
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onUpdate()
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Upload failed'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="cms-section">
      <h2>Update Profile Picture</h2>
      
      <div className="pic-editor">
        <div className="upload-area">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {preview ? (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          ) : (
            <button 
              type="button"
              className="btn-upload-trigger"
              onClick={() => fileInputRef.current?.click()}
            >
              📁 Click to select image
            </button>
          )}
        </div>

        {preview && (
          <div className="upload-actions">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary"
            >
              Change Image
            </button>
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary"
            >
              {uploading ? 'Uploading...' : '✅ Upload'}
            </button>
          </div>
        )}

        {message && (
          <div className="message">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
