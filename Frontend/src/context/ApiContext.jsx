import { createContext } from 'react';
import api from '../config/api';

export const ApiContext = createContext(api);

// Provedor (opcional, se quiser injetar configurações)
export const ApiProvider = ({ children }) => {
  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};