import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const FarmerDashboard = React.lazy(() => import('./pages/FarmerDashboard'));
const BuyerDashboard = React.lazy(() => import('./pages/BuyerDashboard'));
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));


function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-agro-green border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Cross-check localStorage as a fallback during state transitions
  const storedUser = JSON.parse(localStorage.getItem('agro_user') || 'null');
  const currentUser = user || storedUser;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (role && currentUser.role?.toUpperCase() !== role.toUpperCase()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("AgroConnect Crash Caught:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-10 text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">WHOOPS! 🚜</h1>
            <p className="text-slate-500 font-bold mb-8">Something went wrong with the connection. Let's try to get you back to the fields.</p>
            <button 
                onClick={() => window.location.href = '/'}
                className="px-8 py-4 bg-agro-green text-white rounded-2xl font-black shadow-xl"
            >
                RELOAD DASHBOARD
            </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Home() {
  return <Landing />;
}


function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="w-12 h-12 border-4 border-agro-green border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } />

               <Route path="/dashboard/farmer" element={
                <ProtectedRoute role="FARMER">
                  <FarmerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/buyer" element={
                <ProtectedRoute role="BUYER">
                  <BuyerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Home />} />
            </Routes>
          </React.Suspense>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
