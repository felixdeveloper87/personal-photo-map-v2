import { useState, useContext } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CountriesContext } from '../context/CountriesContext';

export default function SearchForm({ onSearch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { countriesWithPhotos, availableYears } = useContext(CountriesContext);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const navigate = useNavigate();

  console.log("🔍 Anos disponíveis no contexto:", availableYears); // Para debugging

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedCountry) {
      onSearch({ country: selectedCountry });
    } else if (selectedYear) {
      navigate(`/timeline/${selectedYear}`);
    } else {
      alert('Please select a country or a year!');
      return;
    }

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
              {/* Dropdown para selecionar país */}
              <div style={{ marginBottom: '1rem' }}>
                <label>Country:</label>
                <Select
                  placeholder="Select a country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  {countriesWithPhotos.length > 0 ? (
                    countriesWithPhotos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No countries available</option>
                  )}
                </Select>
              </div>

              {/* Dropdown para selecionar ano */}
              <div style={{ marginBottom: '1rem' }}>
                <label>Year:</label>
                <Select
                  placeholder="Select a year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {(availableYears || []).length > 0 ? (
                    availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))
                  ) : (
                    <option disabled>No years available</option>
                  )}
                </Select>
              </div>
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
