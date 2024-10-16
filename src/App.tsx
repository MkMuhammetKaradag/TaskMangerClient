import { ApolloProvider } from '@apollo/client';
import client from './graphql/apolloClient';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router';
import ReduxProvider from './redux/ReduxProvider';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ReduxProvider>
        <BrowserRouter>
          <Router></Router>
        </BrowserRouter>
      </ReduxProvider>
    </ApolloProvider>
  );
};

export default App;
