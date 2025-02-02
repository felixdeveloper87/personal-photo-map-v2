import React, { useState, useRef } from 'react';
import { Box, Button, Input, Heading, NumberInput, NumberInputField, Flex } from '@chakra-ui/react';

const ImageUploader = ({ countryId, onUpload, onUploadSuccess }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]); // Mantém os arquivos selecionados
  const fileInputRef = useRef(null); // Referência para o input de arquivos

  const handleFileSelection = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles); // Atualiza os arquivos selecionados
    } else {
      setFiles([]); // Se nenhum arquivo for selecionado, reseta o estado
    }
  };

  const handleImageUpload = async () => {
    if (files.length === 0) {
      alert('Nenhum arquivo selecionado.');
      return;
    }
  
    const formData = new FormData();
    formData.append("file", files[0]); // O S3 aceita apenas um arquivo por vez
  
    setIsUploading(true);
  
    try {
      // Upload da imagem para o S3
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/s3/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erro ao enviar imagem para o S3.');
      }
  
      const data = await response.json();
      const imageUrl = data.imageUrls[0]; // URL da imagem no S3
  
      // Agora salvamos essa URL no banco
      const saveResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          countryId,
          year,
          email: localStorage.getItem('email'), // Certifique-se de ter o email do usuário salvo
          fileName: files[0].name,
          filePath: imageUrl, // URL do S3
        }),
      });
  
      if (!saveResponse.ok) {
        throw new Error('Erro ao salvar URL da imagem no banco de dados.');
      }
  
      alert('Imagem enviada e salva com sucesso!');
  
      onUpload([{ url: imageUrl }], year);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
  
      setFiles([]); // Limpar o input
  
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
          onChange={(valueString) => setYear(valueString)}
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
          ref={fileInputRef} // Adiciona referência ao campo de input
        />
      </Flex>

      <Button
        isLoading={isUploading}
        loadingText="Uploading"
        colorScheme="teal"
        width="100%"
        onClick={handleImageUpload}
        disabled={files.length === 0} // Desabilita o botão se não houver arquivos selecionados
      >
        Upload
      </Button>
    </Box>
  );
};

export default ImageUploader;
