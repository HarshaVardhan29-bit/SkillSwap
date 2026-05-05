// Utility function to get the correct image URL
const BACKEND_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL (starts with http), return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path (starts with /uploads), prepend backend URL
  if (imageUrl.startsWith('/uploads')) {
    return `${BACKEND_URL}${imageUrl}`;
  }
  
  // If it's just a filename, assume it's in uploads
  return `${BACKEND_URL}/uploads/${imageUrl}`;
};