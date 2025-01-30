// Importing core React features and required libraries
import React, { useContext, useEffect, useState } from 'react'; // React and hooks for state and lifecycle management
import { AuthContext } from '../context/AuthContext'; // Context for global authentication state
import countries from 'i18n-iso-countries'; // ISO country code library for mapping codes to country names
import en from 'i18n-iso-countries/langs/en.json'; // English language data for country names
import { Box, Heading, Text } from '@chakra-ui/react'; // Chakra UI components for styling

// Configuring the ISO country library to use English as the default locale
countries.registerLocale(en);

const About = () => {
  // Extracting username from the authentication context
  const { username } = useContext(AuthContext);

  // State to store country codes for countries with uploaded photos
  const [countriesWithPhotos, setCountriesWithPhotos] = useState([]);

  // Fetching the list of countries where the user has uploaded photos
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieving JWT for authorization
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/countries-with-photos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json()) // Parsing API response
        .then((countriesWithPhotosData) => {
          setCountriesWithPhotos(countriesWithPhotosData); // Updating state with fetched data
        })
        .catch((error) => {
          console.error('Error fetching countries with photos:', error); // Logging errors
        });
    }
  }, []); // Dependency array ensures this runs only once when the component mounts

  // Mapping country codes to country names using the registered English locale
  const countryNamesList = countriesWithPhotos.map((code) => {
    const countryName = countries.getName(code.toUpperCase(), 'en'); // Convert codes to names
    return countryName || code; // Fallback to code if the name is unavailable
  });

  return (
    <Box p={6} maxW="800px" mx="auto"> {/* Centered container with responsive layout */}
      <Heading as="h1" size="xl" mb={4} textAlign="center"> {/* Main title */}
        About Me
      </Heading>
      <Text fontSize="lg" lineHeight="tall"> {/* Descriptive text */}
        Hi, my name is <Text as="span" fontWeight="bold">{username}</Text>. {/* Personalized greeting */}
        I have been to{' '}
        <Text as="span" fontWeight="bold">{countriesWithPhotos.length}</Text> countries such as:{' '}
        <Text as="span" fontStyle="italic">{countryNamesList.join(', ')}</Text>. {/* Dynamic country list */}
      </Text>
    </Box>
  );
};

export default About;
