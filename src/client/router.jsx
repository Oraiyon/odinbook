import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/App";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Feed from "./components/Feed";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        // "/"
        // No user feed here
        {
          path: "/signup",
          element: <Signup />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/feed",
          element: <Feed />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
