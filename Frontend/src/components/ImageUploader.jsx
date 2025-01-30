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

  const handleImageUpload = () => {
    if (files.length === 0) {
      alert('Nenhum arquivo selecionado.');
      return;
    }

    const formData = new FormData();
    const invalidFiles = [];
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type !== 'image/jpeg') {
        invalidFiles.push(file.name);
        continue;
      }

      validFiles.push(file);
      formData.append('images', file);
    }

    if (validFiles.length === 0) {
      alert('Nenhum arquivo válido selecionado. Por favor, selecione imagens JPG.');
      return;
    }

    if (invalidFiles.length > 0) {
      alert(`Os seguintes arquivos não são imagens JPG e foram ignorados: ${invalidFiles.join(', ')}`);
    }

    formData.append('countryId', countryId);
    formData.append('year', year);

    setIsUploading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    })
      .then(async (response) => {
        const contentType = response.headers.get('content-type');
        let data = null;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(`Resposta inesperada do servidor: ${text}`);
        }

        if (!response.ok) {
          let errorMessage = data.error || 'Erro desconhecido.';
          if (data.invalidFiles && data.invalidFiles.length > 0) {
            errorMessage += `\nArquivos inválidos: ${data.invalidFiles.join(', ')}`;
          }
          throw new Error(errorMessage);
        }

        let message = data.message || 'Imagens carregadas com sucesso.';
        if (data.invalidFiles && data.invalidFiles.length > 0) {
          message += `\nOs seguintes arquivos foram ignorados por não serem imagens JPG: ${data.invalidFiles.join(', ')}`;
        }
        alert(message);

        const newImages = data.imageUrls.map((url) => ({ url }));
        onUpload(newImages, year);

        if (onUploadSuccess) {
          onUploadSuccess();
        }

        // Limpar o campo de arquivos
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Limpa o campo de input
        }
        setFiles([]); // Limpa o estado dos arquivos selecionados
      })
      .catch((error) => {
        console.error('Erro ao carregar as imagens:', error);
        alert(`Erro ao carregar as imagens: ${error.message}`);
      })
      .finally(() => {
        setIsUploading(false); // Define o estado de upload como falso após a conclusão
      });
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
