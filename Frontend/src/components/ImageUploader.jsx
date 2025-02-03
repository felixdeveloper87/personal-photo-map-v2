import React, { useState, useRef } from 'react';
import { Box, Button, Input, Heading, NumberInput, NumberInputField, Flex } from '@chakra-ui/react';

const ImageUploader = ({ countryId, onUpload, onUploadSuccess }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]); // Armazena os arquivos selecionados
  const fileInputRef = useRef(null);

  const handleFileSelection = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      setFiles(Array.from(selectedFiles));
    } else {
      setFiles([]);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleImageUpload = async () => {
    if (files.length === 0) {
      alert('Nenhum arquivo selecionado.');
      return;
    }
  
    const formData = new FormData();
    // Adiciona todos os arquivos com o mesmo nome do parâmetro "images"
    files.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("countryId", countryId);
    formData.append("year", year);
  
    setIsUploading(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/upload`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          // NÃO defina o Content-Type manualmente; o browser fará isso automaticamente (incluindo o boundary).
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erro ao enviar imagem(s) para o servidor.');
      }
  
      const data = await response.json();
      // Supondo que o backend retorne { message, imageUrls }
      const uploadedImageUrls = data.imageUrls;
      alert('Imagem(s) enviada(s) com sucesso!');
  
      if (onUpload) {
        onUpload(uploadedImageUrls, year);
      }
      if (onUploadSuccess) {
        onUploadSuccess();
      }
  
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert(`Erro ao fazer upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box p={5} bg="gray.100" borderRadius="md" boxShadow="md" maxWidth="600px" mx="auto">
      <Heading as="h2" mb={4} textAlign="center">Upload Images</Heading>
      
      <Flex justify="space-between" align="center" mb={4}>
        <NumberInput
          value={year}
          onChange={(valueString) => setYear(Number(valueString))}
          min={1900}
          max={new Date().getFullYear()}
          width="150px"
        >
          <NumberInputField placeholder="Year" />
        </NumberInput>
        <Input
          type="file"
          onChange={handleFileSelection}
          multiple
          accept=".jpg,.jpeg"
          width="auto"
          ref={fileInputRef}
        />
      </Flex>

      <Button
        isLoading={isUploading}
        loadingText="Uploading"
        colorScheme="teal"
        width="100%"
        onClick={handleImageUpload}
        disabled={files.length === 0}
      >
        Upload
      </Button>
    </Box>
  );
};

export default ImageUploader;