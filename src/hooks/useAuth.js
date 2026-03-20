import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { isAuthenticated, login, logout } = useAuthStore();

  const handleLogin = (email, password) => {
    // Giả lập logic đăng nhập
    if (email === 'admin@gmail.com') {
      const userData = {
        email: email,
        name: 'Admin',
        role: 'admin',
      };
      login(userData);
      return true; // Đăng nhập thành công
    }
    
    return false; // Đăng nhập thất bại
  };

  return {
    isAuthenticated,
    handleLogin,
    logout,
  };
};

export default useAuth;
