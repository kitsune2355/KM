import { useEffect, useState } from "react";

const useIsAdmin = (): boolean => {
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;
    const userRole = userData.role;

    if (userRole === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return isAdmin;
};

export default useIsAdmin;
