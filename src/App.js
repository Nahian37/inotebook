import './App.css';
import Navbar from './components/Navbar';
import About from './components/About';
import Home from './components/Home';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NoteState from './contexts/notes/NoteSate';

function App() {
  return (
    <>
    <NoteState>
      <BrowserRouter>
        <Navbar title="iNoteBook" />
        <div className="container my-3">
          <Routes>
            <Route exact path="/about" element={<About/>}/>
            <Route exact path="/" element={<Home/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </NoteState>
    </>
  );
}

export default App;
