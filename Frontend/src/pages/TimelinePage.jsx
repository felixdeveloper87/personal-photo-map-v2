import React from 'react';
import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom'; 
import Timeline from '../components/Timeline';

function TimelinePage() {
  const { year } = useParams();
  console.log("📅 Ano capturado da URL:", year);
  return (
    <Box p={4} maxW="1600px" mx="auto">
      <Timeline selectedYear={year} />
    </Box>
  );
}

export default TimelinePage;
