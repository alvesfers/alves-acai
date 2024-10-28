import { createContext, useState, useContext } from 'react';

// Cria o contexto
const UserContext = createContext();

// Cria um Provider que irá encapsular os componentes que precisam do dado
export function UserProvider({ children }) {
  const [usuarioNome, setUsuarioNome] = useState('');

  return (
    <UserContext.Provider value={{ usuarioNome, setUsuarioNome }}>
      {children}
    </UserContext.Provider>
  );
}

// Função de uso para consumir o contexto
export function useUser() {
  return useContext(UserContext);
}
