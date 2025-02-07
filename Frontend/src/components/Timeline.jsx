import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Spinner } from '@chakra-ui/react';
import { CountriesContext } from "../context/CountriesContext";


// Lazy loading do PhotoGallery
const LazyPhotoGallery = lazy(() => import('./PhotoGallery'));

const Timeline = ({ selectedYear }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refreshCountriesWithPhotos } = useContext(CountriesContext);

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
    fetchPhotos();
  }, [navigate, selectedYear]);

  const fetchPhotos = async () => {
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/images/allPictures`;
      if (selectedYear) {
        url += `?year=${selectedYear}`; // Se houver ano, adicionamos o filtro
      }

      console.log("Fetching URL:", url); // Log para depuração

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Enviando JWT
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar fotos: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fotos recebidas:", data); // Log para depuração

      if (Array.isArray(data)) {
        setImages(data.map(image => ({
          url: image.filePath,
          id: image.id,
          year: image.year,
        })));
      } else {
        setImages([]);
        setError('Nenhuma foto encontrada');
      }
    } catch (err) {
      setError(err.message);
      setImages([]);
    }
  };

  const deleteImages = async (ids) => {
    if (!ids || ids.length === 0) {
      alert('Nenhuma imagem selecionada para deletar.');
      return;
    }

    if (window.confirm(`Tem certeza que deseja deletar ${ids.length} imagem(ns)?`)) {
      try {
        const deletePromises = ids.map((id) =>
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/delete/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
          })
        );

        const responses = await Promise.all(deletePromises);
        const failedResponses = responses.filter((response) => !response.ok);

        if (failedResponses.length > 0) {
          alert(`Erro ao deletar ${failedResponses.length} imagem(ns).`);
        } else {
          alert(`${ids.length} imagem(ns) deletada(s) com sucesso.`);
          refreshCountriesWithPhotos();
          fetchPhotos(); // Atualiza a lista de imagens após deletar
        }
      } catch (error) {
        alert("Erro ao deletar as imagens.");
      }
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
        {selectedYear ? `Timeline de ${selectedYear}` : "Todas as Fotos"}
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
            <Suspense fallback={<Spinner color="blue.500" size="xl" />}>
              <LazyPhotoGallery
                images={groupedByYear[year]}
                onDeleteSelectedImages={deleteImages}
              />
            </Suspense>


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
