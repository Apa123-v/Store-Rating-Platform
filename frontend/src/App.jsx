import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageStores from './pages/admin/ManageStores'
import StoreList from './pages/user/StoreList'
import UserUpdatePassword from './pages/user/UpdatePassword'
import OwnerDashboard from './pages/storeowner/OwnerDashboard'
import OwnerUpdatePassword from './pages/storeowner/UpdatePassword'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={
          <ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/stores" element={
          <ProtectedRoute role="admin"><ManageStores /></ProtectedRoute>} />

        <Route path="/stores" element={
          <ProtectedRoute role="user"><StoreList /></ProtectedRoute>} />
        <Route path="/update-password" element={
          <ProtectedRoute role="user"><UserUpdatePassword /></ProtectedRoute>} />

        <Route path="/owner/dashboard" element={
          <ProtectedRoute role="store_owner"><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/update-password" element={
          <ProtectedRoute role="store_owner"><OwnerUpdatePassword /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App