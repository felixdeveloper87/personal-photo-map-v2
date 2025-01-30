import React from 'react';
import { Box } from '@chakra-ui/react'; 
import Timeline from '../components/Timeline';

function TimelinePage() {
  return (
    <Box p={4} maxW="1600px" mx="auto">
      <Timeline />
    </Box>
  );
}

export default TimelinePage;
