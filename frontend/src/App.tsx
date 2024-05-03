import './App.css';
import RoomsList from './pages/RoomsList/RoomsList';
import DatabaseManaging from './pages/DatabaseManaging/DatabaseManaging'
import Auth from './pages/Auth/Auth';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<RoomsList />} />
      </Routes>
    </div>
  );
}

export default App;
