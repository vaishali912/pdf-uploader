import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Pdf from './components/Pdf';
import Success from './components/Success';
import './components/style.css' ;
function App() {
  return (
    <>
    
    <Router>
      <Routes>
          <Route path='/' element= {<Main></Main>}></Route>
          <Route path='/Register' element={<Register/>}></Route>
          <Route path= '/post/pdf/:id' element={<Pdf></Pdf>}></Route>
          <Route path = '/success' element={<Success></Success>}></Route>
      </Routes>
      
    </Router>
    </>
  );
}

export default App;
