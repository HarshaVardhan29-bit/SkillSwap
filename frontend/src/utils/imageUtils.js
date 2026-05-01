// Utility function to get the correct image URL
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL (starts with http), return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path (starts with /uploads), prepend backend URL
  if (imageUrl.startsWith('/uploads')) {
    return `http://localhost:5000${imageUrl}`;
  }
  
  // If it's just a filename, assume it's in uploads
  return `http://localhost:5000/uploads/${imageUrl}`;
};