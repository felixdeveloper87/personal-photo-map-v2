import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Image,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiZoomIn, FiZoomOut, FiX } from 'react-icons/fi';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const PhotoGallery = ({ images, onDeleteSelectedImages, onCreateEvent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    onOpen();
  };

  const closeModal = () => {
    onClose();
  };

  const showNextImage = (e) => {
    if (e) e.stopPropagation();
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
  };

  const showPrevImage = (e) => {
    if (e) e.stopPropagation();
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
  };

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
          showNextImage();
        } else if (event.key === 'ArrowLeft') {
          showPrevImage();
        } else if (event.key === 'Escape') {
          closeModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, currentImageIndex, images.length]);

  const toggleImageSelection = (imageId) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(imageId)
        ? prevSelected.filter((id) => id !== imageId)
        : [...prevSelected, imageId]
    );
  };

  const handleDeleteSelected = () => {
    onDeleteSelectedImages(selectedImages);
    setSelectedImages([]); // Clear selection after deletion
  };

  const handleCreateEvent = () => {
    if (onCreateEvent) onCreateEvent(selectedImages);
  };

  if (!images || images.length === 0) {
    return <Text fontSize="lg">You haven't been here yet.</Text>;
  }

  return (
    <Box>
      {selectedImages.length > 0 && (
        <Flex mb={4} gap={4}>
          <Button colorScheme="red" onClick={handleDeleteSelected}>
            Delete {selectedImages.length} image(s)
          </Button>
          <Button colorScheme="blue" onClick={handleCreateEvent}>
            Create a new event
          </Button>
        </Flex>
      )}

      <Flex wrap="wrap" justifyContent="center">
        {images.map((image, index) => (
          <Box
            key={index}
            position="relative"
            m={2}
            border={
              selectedImages.includes(image.id) ? '4px solid red' : '2px solid gray'
            }
            borderRadius="md"
            cursor="pointer"
          >
            <Box
              position="absolute"
              top="2px"
              left="2px"
              bg={selectedImages.includes(image.id) ? 'red.500' : 'white'}
              borderRadius="full"
              boxSize="1rem"
              onClick={() => toggleImageSelection(image.id)}
            ></Box>
            <Image
              src={image.url}
              alt={`Imagem do país ${index + 1}`}
              boxSize="200px"
              objectFit="cover"
              onClick={() => handleImageClick(index)}
            />
          </Box>
        ))}
      </Flex>

      <Modal isOpen={isOpen} onClose={closeModal} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody p={4}>
            <IconButton
              icon={<FiX />}
              aria-label="Fechar"
              position="absolute"
              top="10px"
              right="10px"
              onClick={closeModal}
              colorScheme="red"
              zIndex="10"
            />

            <TransformWrapper
              defaultScale={1}
              wheel={{ step: 0.2 }}
              doubleClick={{ disabled: true }}
              pinch={{ step: 5 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <VStack spacing={4}>
                  <Flex justifyContent="center" mb={4}>
                    <IconButton
                      onClick={zoomOut}
                      icon={<FiZoomOut />}
                      aria-label="Zoom out"
                      mx={2}
                      colorScheme="blue"
                    />
                    <IconButton
                      onClick={zoomIn}
                      icon={<FiZoomIn />}
                      aria-label="Zoom in"
                      mx={2}
                      colorScheme="blue"
                    />
                    <Button onClick={resetTransform} mx={2} colorScheme="blue">
                      Reset
                    </Button>
                  </Flex>

                  <TransformComponent>
                    <Image
                      src={images[currentImageIndex].url}
                      alt={`Imagem do país ${currentImageIndex + 1}`}
                      boxSize="full"
                      objectFit="contain"
                    />
                  </TransformComponent>
                </VStack>
              )}
            </TransformWrapper>

            {images.length > 1 && (
              <Flex justifyContent="space-between" mt={4}>
                <Button onClick={showPrevImage}>&#10094;</Button>
                <Button onClick={showNextImage}>&#10095;</Button>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PhotoGallery;
