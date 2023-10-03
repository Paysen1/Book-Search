import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import ApolloClient from './apollo/client';
import Navbar from './components/Navbar';

function App() {
  return (
    <ApolloProvider client={ApolloClient}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
