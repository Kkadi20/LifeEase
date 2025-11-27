import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Events from './pages/Events';
import Journal from './pages/Journal';
import Mood from './pages/Mood';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {isAuthenticated && <Sidebar />}
            <div className={isAuthenticated ? 'ml-0 lg:ml-64' : ''}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/tasks" element={
                        <ProtectedRoute><Tasks /></ProtectedRoute>
                    } />
                    <Route path="/events" element={
                        <ProtectedRoute><Events /></ProtectedRoute>
                    } />
                    <Route path="/journal" element={
                        <ProtectedRoute><Journal /></ProtectedRoute>
                    } />
                    <Route path="/mood" element={
                        <ProtectedRoute><Mood /></ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <AppContent />
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
