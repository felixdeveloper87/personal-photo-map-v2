import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoGallery from './PhotoGallery';
import { Box, Text } from '@chakra-ui/react';

const Timeline = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Helper para pegar o token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllPhotos();
  }, [navigate]);

  const fetchAllPhotos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/allPictures`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar todas as fotos do usuário: ${response.statusText}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        const imageUrls = data.map((image) => ({
          url: `${import.meta.env.VITE_BACKEND_URL}${image.filePath}`,
          id: image.id,
          year: image.year
          // ... qualquer outra propriedade que você precise
        }));
        setImages(imageUrls);
      } else {
        setImages([]);
        setError('Nenhuma foto encontrada');
      }
    } catch (err) {
      setError(err.message);
      setImages([]);
    }
  };

  // Exemplo de agrupamento por ano
  const sortedImages = [...images].sort((a, b) => b.year - a.year);
  const groupedByYear = sortedImages.reduce((acc, image) => {
    if (!acc[image.year]) {
      acc[image.year] = [];
    }
    acc[image.year].push(image);
    return acc;
  }, {});

  return (
    <Box>
      <Text fontSize="2xl" textAlign="center" mb={4}>
        My Timeline
      </Text>

      {error && (
        <Text color="red.500" textAlign="center" mb={4}>
          {error}
        </Text>
      )}

      {Object.keys(groupedByYear).length > 0 ? (
        Object.keys(groupedByYear).map((year) => (
          <Box key={year} mb={8}>
            <Text fontSize="xl" mb={2}>{year}</Text>
            <PhotoGallery images={groupedByYear[year]} />
          </Box>
        ))
      ) : (
        <Text mt={4} mb={4} textAlign="center">
          Nenhuma foto para exibir
        </Text>
      )}
    </Box>
  );
};

export default Timeline;
