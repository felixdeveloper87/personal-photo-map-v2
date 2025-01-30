import React, { useState, useEffect } from 'react';
import { Box, Input, Button, Heading, FormControl, FormLabel, FormErrorMessage, Text, Select } from '@chakra-ui/react';

const Register = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
  }, []);


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        // Organizar os países em ordem alfabética, mas garantir que "United Kingdom" esteja no topo
        const sortedCountries = [
          { code: 'GB', name: 'United Kingdom' },
          ...data
            .filter((country) => country.name.common !== 'United Kingdom')
            .map((country) => ({
              code: country.cca2,
              name: country.name.common,
            }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        ];

        setCountries(sortedCountries);
      } catch (err) {
        console.error('Erro ao buscar os países:', err);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      fullname,
      email,
      password,
      country,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess('Registro bem-sucedido!');
        setError('');
        setFullname('');
        setEmail('');
        setPassword('');
        setCountry('');
      } else {
        const result = await response.json();
        setError(result.message || 'Falha no registro.');
        setSuccess('');
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.');
      setSuccess('');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} boxShadow="md" borderWidth="1px" borderRadius="md">
      <Heading mb={6} textAlign="center">Register</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="fullname" isInvalid={error}>
          <FormLabel>Full name</FormLabel>
          <Input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="type in your full name"
            mb={4}
            required
          />
        </FormControl>

        <FormControl id="email" isInvalid={error}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="type in your email"
            mb={4}
            required
          />
        </FormControl>

        <FormControl id="password" isInvalid={error}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="type in your password"
            mb={4}
            required
          />
        </FormControl>

        <FormControl id="country" isInvalid={error}>
          <FormLabel>Country</FormLabel>
          <Select
            placeholder="Select your country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            mb={4}
            required
          >
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          width="100%"
          mt={4}
        >
          Register
        </Button>
      </form>

      {error && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )}

      {success && (
        <Text color="green.500" mt={4}>
          {success}
        </Text>
      )}
    </Box>
  );
};

export default Register;
