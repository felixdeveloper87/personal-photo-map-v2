import React from 'react';
import { useParams } from 'react-router-dom';
import CountryDetails from '../components/CountryDetails';
import { Box } from '@chakra-ui/react'; // Import Chakra UI component

function Countries() {
  const { countryId } = useParams();

  console.log('País selecionado:', countryId);

  return (
    <Box p={4} maxW="800px" mx="auto">
      <CountryDetails countryId={countryId} />
    </Box>
  );
}

export default Countries;
