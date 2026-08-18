import './App.css';
import { mockAuth } from './data/mockAuth';
import type { AuthContext } from './types/auth';

type AppProps = { auth?: AuthContext };

const App = ({ auth }: AppProps) => {
  const isStandalone = auth === undefined;
  const currentAuth = auth ?? mockAuth;

  return (
  <div data-auth-mode={isStandalone ? 'standalone' : 'shell'}>
      <h1>Microfrontend de Reportes</h1>

      <p>
        Este componente pertenece al módulo remoto Reportes.
      </p>

      <p>Usuario actual: {currentAuth.user.name}</p>

    </div>
  );
};

export default App;
