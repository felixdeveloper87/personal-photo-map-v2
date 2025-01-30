import { useState, useEffect } from 'react';
import 'react-widgets/styles.css';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { DropdownList } from 'react-widgets';

export default function SearchForm({ countriesWithPhotos, onSearch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    if (selectedCountry) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/${selectedCountry}/years`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setAvailableYears(data))
        .catch((error) => console.error('Erro ao buscar anos:', error));
    }
  }, [selectedCountry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCountry) {
      alert('Please select a country!');
      return;
    }
    onSearch({ country: selectedCountry, year: selectedYear });
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal">
        Search Photos
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search Photos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="search-form" onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Country:</label>
                <DropdownList
                  data={countriesWithPhotos.map((c) => ({ value: c.id, label: c.name }))}
                  value={selectedCountry}
                  onChange={(value) => setSelectedCountry(value.value)} // Ajustado para capturar o valor correto
                  textField="label"
                  placeholder="Select a country"
                />
              </div>
              {availableYears.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <label>Year:</label>
                  <DropdownList
                    data={availableYears.map((year) => ({ value: year, label: year }))}
                    value={selectedYear}
                    onChange={(value) => setSelectedYear(value.value)} // Garantido que o valor correto seja capturado
                    placeholder="Select a year"
                  />
                </div>
              )}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" form="search-form" colorScheme="teal">
              Search
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}