import React from 'react';
import { Box, Flex, Text, Link, HStack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.900" color="white" py={4} width="100%">
      <Flex direction="column" align="center">
        <HStack spacing={8} mb={4}>
          <Link href="/about" _hover={{ color: "teal.300" }}>
            About
          </Link>
          <Link href="/contact" _hover={{ color: "teal.300" }}>
            Contact
          </Link>
        </HStack>
        <Text fontSize="sm" color="gray.500">
          &copy; {new Date().getFullYear()} My Personal Photo Gallery. All Rights Reserved.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
