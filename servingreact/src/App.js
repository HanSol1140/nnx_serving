
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Headers from './components/Headers';
import RobotSettings from './components/RobotSettings';
import MovePointSettings from './components/MovePointSettings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Headers></Headers>
        <Routes>
          <Route path="/RobotSettings" element={<RobotSettings/>}/>
          <Route path="/MovePointSettings" element={<MovePointSettings/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
