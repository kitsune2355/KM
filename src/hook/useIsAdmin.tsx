import { useEffect, useState } from 'react';

type User = {
  role?: string;
  [key: string]: any;
};

const useIsAdmin = (): boolean => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user: User = JSON.parse(userData);
        if (user[0].role === 'admin') {
          setIsAdmin(true);
          return;
        }
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }

    setIsAdmin(false);
  }, []);

  return isAdmin;
};

export default useIsAdmin;
