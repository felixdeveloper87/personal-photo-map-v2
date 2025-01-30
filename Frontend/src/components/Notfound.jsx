import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react'; // Importando componentes do Chakra UI
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h1"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="24px" mt={3} mb={2}>
        Page not found
      </Text>
      <Text color={'gray.500'} mb={6}>
        Sorry, the page you are trying to access does not exist.
      </Text>
      <Link to="/">
        <Button
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid"
        >
          back to home page
        </Button>
      </Link>
    </Box>
  );
};

export default NotFound;
