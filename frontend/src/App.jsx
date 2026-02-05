import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark text-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<div className="p-10 text-center">Home Page (Coming Soon)</div>} />
        </Routes>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#212121',
              color: '#fff',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;