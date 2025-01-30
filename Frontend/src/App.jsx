import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import Home from './pages/Home';
import Header from './components/Header';
import Login from './components/Login';
import Footer from './components/Footer';
import CountryDetails from './components/CountryDetails';
import Register from './components/Register';
import NotFound from './components/Notfound.jsx';
import About from './pages/About';
import TimelinePage from './pages/TimelinePage';
import { AuthProvider } from './context/AuthContext'; // Importa o AuthProvider
import { CountriesProvider } from './context/CountriesContext';

function App() {
  const [updateCounts, setUpdateCounts] = useState(false);

  const handleUploadCounts = () => {
    setUpdateCounts((prev) => prev + 1); // Atualiza estado
  };

  return (
    <AuthProvider>
      <CountriesProvider> {/* Envolvendo a aplicação com o CountriesProvider */}
        <Flex direction="column" minH="100vh">
          {/* Header */}
          <Box as="header">
            <Header/>
          </Box>

          {/* Main Content */}
          <Box as="main" flex="1" p={4}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/countries/:countryId"
                element={<CountryDetails onUploadSuccess={handleUploadCounts} />}
              />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="*" element={<NotFound />} /> {/* Página 404 */}
            </Routes>
          </Box>

          {/* Footer */}
          <Box as="footer">
            <Footer />
          </Box>
        </Flex>
      </CountriesProvider>
    </AuthProvider>
  );
}

export default App;
