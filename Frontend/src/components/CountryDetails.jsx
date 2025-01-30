import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { Box, Flex, Heading, Text, Link } from '@chakra-ui/react';
import PhotoManager from '../components/PhotoManager';

countries.registerLocale(en);

const CountryDetails = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const [countryInfo, setCountryInfo] = useState({
    officialLanguage: '',
    currency: '',
    capital: '',
    population: '',
  });

  // Constrói URL do Google Flights, ex: Londres -> capital do país
  const googleFlightsUrl = `https://www.google.com/travel/flights?q=Flights+from+London+to+${countryInfo.capital}`;

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/alpha/${countryId}`)
      .then((response) => response.json())
      .then((data) => {
        const countryData = data[0];
        const officialLanguage = Object.values(countryData.languages || {})[0];
        const currency = Object.keys(countryData.currencies || {})[0];
        const capital = countryData.capital ? countryData.capital[0] : 'N/A';
        const population = countryData.population || 0;

        setCountryInfo({ officialLanguage, currency, capital, population });
      })
      .catch(() => {
        navigate('/not-found');
      });
  }, [countryId, navigate]);

  return (
    <Box p={5}>
      <Heading as="h1" mb={4} textAlign="center">
        Photos in {countries.getName(countryId.toUpperCase(), 'en') || countryId.toUpperCase()}
      </Heading>

      <Flex
        direction={['column', 'row']}
        align="center"
        justify="center"
        mb={8}
      >
        {/* Bandeira */}
        <Box flex="0 0 auto" mb={[4, 0]} mr={[0, 8]}>
          <Flag code={countryId.toUpperCase()} style={{ width: '300px', height: 'auto' }} />
        </Box>

        {/* Informações do país */}
        <Box textAlign={['center', 'left']}>
          <Text>
            <b>Capital:</b> {countryInfo.capital}
          </Text>
          <Text>
            <b>Official Language:</b> {countryInfo.officialLanguage}
          </Text>
          <Text>
            <b>Currency:</b> {countryInfo.currency}
          </Text>
          <Text>
            <b>Population:</b> {countryInfo.population.toLocaleString('en-US')}
          </Text>
          
          {/* Link para Google Flights */}
          {countryInfo.capital && countryInfo.capital !== 'N/A' && (
            <Text mt={2}>
              <b>Flights from London:</b>{' '}
              <Link
                href={googleFlightsUrl}
                isExternal
                color="blue.500"
                textDecoration="underline"
              >
                Check availability
              </Link>
            </Text>
          )}
        </Box>
      </Flex>

      {/* PhotoManager */}
      <PhotoManager countryId={countryId} />
    </Box>
  );
};

export default CountryDetails;
