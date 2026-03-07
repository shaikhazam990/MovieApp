import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { router } from "./app.routes";
import { getMe } from "./features/auth/authSlice";
import "./shared/styles/global.scss";

function App() {
  const dispatch = useDispatch();

  // App load hote hi check karo — user logged in hai ya nahi
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;