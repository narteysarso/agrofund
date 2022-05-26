import './App.less';
import MainLayout from './Components/Layout';
import { AgroFundProvider } from './Context/AgrofundContract';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <AgroFundProvider>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </AgroFundProvider>
  );
}

export default App;
