// Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Image,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { AuthContext } from '../context/AuthContext';
import { CountriesContext } from '../context/CountriesContext';
import SearchForm from '../components/SearchForm';
import logo from '../assets/logo.jpg';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, fullname, email, logout } = useContext(AuthContext);
  const { countriesWithPhotos, loading, photoCount, countryCount } = useContext(CountriesContext);

  // useDisclosure do Chakra para gerenciar o modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = (searchParams) => {
    if (searchParams.country) {
      navigate(`/countries/${searchParams.country}?year=${searchParams.year}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box width="100%" maxWidth="1200px" mx="auto" p={4}>
      <Box as="header" bg="white" boxShadow="md" p={1} borderRadius="md" mb={0}>
        <Flex align="center">
          {/* Logo */}
          <Link to="/">
            <Flex align="center">
              <Image src={logo} alt="Home logo" h="60px" w="auto" objectFit="contain" />
              <Heading as="h1" size="lg" ml={3} fontFamily="'Playfair Display', serif" fontWeight="bold" color="teal.600">
                My Personal Photo Gallery
              </Heading>
            </Flex>
          </Link>

          {/* Se está logado, exibe contadores e search */}
          {isLoggedIn && (
            <Flex align="center" ml={5} gap={4}>
              <Text fontSize="md" bg="gray.100" p={2} borderRadius="md">
                Photos: {photoCount}
              </Text>
              <Text fontSize="md" bg="gray.100" p={2} borderRadius="md">
                Countries: {countryCount}
              </Text>

              {!loading ? (
                <>
                  <SearchForm countriesWithPhotos={countriesWithPhotos} onSearch={handleSearch} />
                  {/* Botão de timeline, se quiser */}
                  <Button colorScheme="teal" onClick={() => navigate('/timeline')}>
                    Timeline
                  </Button>
                </>
              ) : (
                <Text>Loading search...</Text>
              )}

              {/* Nome do usuário (click -> modal) */}
              <Text fontWeight="bold" mr={3} cursor="pointer" onClick={onOpen}>
                {/* Mensagem de boas-vindas */}
                Welcome, {fullname}!
              </Text>
              <Button colorScheme="teal" onClick={handleLogout}>
                Sign out
              </Button>
            </Flex>
          )}

          {/* Se não está logado, mostra botões de Sign In / Sign Up */}
          {!isLoggedIn && (
            <Flex ml="auto" gap={4}>
              <Button colorScheme="teal" onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button colorScheme="teal" variant="outline" onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </Flex>
          )}
        </Flex>
      </Box>

      {/* Modal de informações do usuário */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>My Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}><b>Fullname:</b> {fullname}</Text>
            <Text mb={2}><b>Email:</b> {email}</Text>
            <Text mb={2}><b>Photos:</b> {photoCount}</Text>
            <Text mb={2}><b>Countries:</b> {countryCount}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Header;
