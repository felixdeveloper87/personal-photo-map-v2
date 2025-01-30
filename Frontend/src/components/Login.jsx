import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, Input, Button, Heading, FormControl, FormLabel, FormErrorMessage, Text } from '@chakra-ui/react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Dados recebidos no login:', data);  
      login(data.token, data.fullname, data.email);  
      navigate('/');  // Redireciona para a página inicial após login bem-sucedido

    } catch (error) {
      setError(error.message);  // Exibe o erro para o usuário
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} boxShadow="md" borderWidth="1px" borderRadius="md">
      <Heading mb={6} textAlign="center">Login</Heading>
      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl id="email" isInvalid={error}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={4}
          />
        </FormControl>

        <FormControl id="password" isInvalid={error}>
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={4}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          width="100%"
          mt={4}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;
