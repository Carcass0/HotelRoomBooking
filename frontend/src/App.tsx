import './App.css';
import RoomsList from './pages/RoomsList/RoomsList';
import DatabaseManagment from './pages/DatabaseManagment/DatabaseManagment'
import Auth from './pages/Auth/Auth';
import { Routes, Route } from "react-router-dom";
import Payment from './pages/Payment/Payment';
import RoomsManagement from './pages/RoomsManagement/RoomsManagement';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<RoomsList />} />
        <Route path="/pay/" element={<Payment />} />
        <Route path="/roomsManagement" element={<RoomsManagement />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/databaseManagement" element={<DatabaseManagment />} />
      </Routes>
    </div>
  );
}

export default App;
