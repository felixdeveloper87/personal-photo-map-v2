import React, { useContext, useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import PhotoGallery from './PhotoGallery';
import { CountriesContext } from '../context/CountriesContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Text, Flex, Grid } from '@chakra-ui/react';
import { Wrap, WrapItem } from '@chakra-ui/react';

const PhotoManager = ({ countryId, onUploadSuccess }) => {
    const [images, setImages] = useState([]);
    const [years, setYears] = useState([]);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const { refreshCountriesWithPhotos } = useContext(CountriesContext);
    const [showAllSelected, setShowAllSelected] = useState(false);


    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        if (!token) {
            navigate('/login');
        } else {
            fetchYears();
        }

    }, [countryId, navigate]);

    useEffect(() => {
        if (isLoggedIn) {
            if (selectedYear || showAllSelected) {
                fetchImages();
            } else {
                // Clear images when no year is selected and "Show all" is not selected
                setImages([]);
            }
        }
    }, [countryId, selectedYear, showAllSelected, isLoggedIn]);

    const fetchYears = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/${countryId}/years`, {
            headers: getAuthHeaders(),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erro ao buscar anos: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setYears(data);
                } else {
                    setYears([]);
                    setError('Dados inválidos recebidos ao buscar anos.');
                }
            })
            .catch((error) => {
                setError(error.message);
                setYears([]);
            });
    };



    const fetchImages = () => {
        if (!selectedYear && !showAllSelected) {
            return; // Do not fetch images if no year is selected and "Show all" is not selected
        }

        let url = `${import.meta.env.VITE_BACKEND_URL}/api/images/${countryId}`;
        if (selectedYear && !showAllSelected) {
            url += `/${selectedYear}`;
        }

        fetch(url, {
            headers: getAuthHeaders(),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erro ao buscar imagens: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    const imageUrls = data.map((image) => {
                        const url = `${import.meta.env.VITE_BACKEND_URL}${image.filePath}`;
                        return { url, id: image.id, year: image.year };
                    });
                    console.log('Imagens processadas:', imageUrls);
                    setImages(imageUrls);
                } else {
                    setImages([]);
                }
            })
            .catch(() => {
                setImages([]);
            });
    };

    const handleUpload = (newImages, year) => {
        setImages((prevImages) => [...prevImages, ...newImages]);

        if (!years.includes(year)) {
            setYears((prevYears) => [...prevYears, year]);
        }

        if (onUploadSuccess) {
            onUploadSuccess();
        }
        refreshCountriesWithPhotos();
        fetchImages();
    };

    const deleteImages = (ids) => {
        if (ids.length === 0) {
            alert('Nenhuma imagem selecionada para deletar.');
            return;
        }

        if (
            window.confirm(
                `Tem certeza que deseja deletar ${ids.length} imagem(ns)?`
            )
        ) {
            const deletePromises = ids.map((id) =>
                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/delete/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                })
            );

            Promise.all(deletePromises)
                .then((responses) => {
                    const failedResponses = responses.filter((response) => !response.ok);
                    if (failedResponses.length > 0) {
                        alert(`Erro ao deletar ${failedResponses.length} imagem(ns).`);
                    } else {
                        alert(`${ids.length} imagem(ns) deletada(s) com sucesso.`);
                    }

                    // Refresh data
                    refreshData();
                })
                .catch(() => {
                    alert('Erro ao deletar as imagens.');
                });
        }
    };

    const deleteImagesByYear = (year) => {
        if (
            window.confirm(
                `Tem certeza que deseja deletar todas as imagens do ano ${year}?`
            )
        ) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}2/api/images/${countryId}/${year}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `Erro ao deletar imagens do ano ${year}: ${response.status}`
                        );
                    }
                    alert(`Imagens do ano ${year} deletadas com sucesso.`);

                    refreshData();
                    if (onUploadSuccess) {
                        onUploadSuccess();
                    }
                    if (selectedYear === year) {
                        setSelectedYear(null);
                    }
                })
                .catch(() => {
                    alert(`Erro ao deletar imagens do ano ${year}.`);
                });
        }
    };

    const deleteAllImagesByCountry = () => {
        if (
            window.confirm(
                `Tem certeza que deseja deletar todas as imagens de ${countryId.toUpperCase()}?`
            )
        ) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/delete-all-images/${countryId}`,
                {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `Erro ao deletar todas as imagens de ${countryId.toUpperCase()}: ${response.statusText}`
                        );
                    }
                    alert(
                        `Todas as imagens de ${countryId.toUpperCase()} foram deletadas com sucesso.`
                    );
                    refreshData();
                    if (onUploadSuccess) {
                        onUploadSuccess();
                    }
                    setShowAllSelected(false);
                })
                .catch((error) => {
                    alert(
                        `Erro ao deletar todas as imagens de ${countryId.toUpperCase()}: ${error.message}`
                    );
                });
        }
    };


    const toggleYearSelection = (year) => {
        if (selectedYear === year) {
            setSelectedYear(null);
        } else {
            setSelectedYear(year);
            setShowAllSelected(false);
        }
    };

    const toggleShowAll = () => {
        setShowAllSelected((prev) => !prev);
        setSelectedYear(null);
    };

    const refreshData = () => {
        fetchImages();
        fetchYears();
        refreshCountriesWithPhotos();
    };


    return (
        <Box>
            <Box mb={3}>
                <ImageUploader countryId={countryId} onUpload={handleUpload} />
            </Box>


            {years.length > 0 && (
                <Wrap spacing={4} justify="center" mb={4}>
                    {years.map((year) => (
                        <WrapItem key={year}>
                            <Button
                                colorScheme={selectedYear === year ? 'teal' : 'gray'}
                                onClick={() => toggleYearSelection(year)}
                            >
                                {year}
                            </Button>
                        </WrapItem>
                    ))}
                    {/* Show All aparece somente se há anos, logo há fotos */}
                    <WrapItem>
                        <Button
                            colorScheme={showAllSelected ? 'teal' : 'gray'}
                            onClick={toggleShowAll}
                        >
                            Show All
                        </Button>
                    </WrapItem>
                </Wrap>
            )}

            {images.length > 0 ? (
                <PhotoGallery images={images} onDeleteSelectedImages={deleteImages} />
            ) : (
                <Text mt={4} mb={4} textAlign="center">
                    No photos to display
                </Text>
            )}

            {selectedYear && (
                <Button
                    mt={4}
                    colorScheme="red"
                    onClick={() => deleteImagesByYear(selectedYear)}
                >
                    Delete Images of {selectedYear}
                </Button>
            )}

            {showAllSelected && (
                <Button mt={4} colorScheme="red" onClick={deleteAllImagesByCountry}>
                    Delete All Photos
                </Button>
            )}
        </Box>
    );
};

export default PhotoManager;
