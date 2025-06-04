import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/App";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Search from "./components/Search";
import Profile from "./components/Profile";
import User from "./components/User";
import Comments from "./components/Comments";
import Likes from "./components/Likes";
import Post from "./components/Post";
import EditAccount from "./components/EditAccount";
import ErrorPage from "./components/ErrorPage";
import Inbox from "./components/Inbox";
import Followers from "./components/Followers";
import Following from "./components/Following";
import AdminUserPosts from "./components/AdminUserPosts";
import AdminUserComments from "./components/AdminUserComments";
import AdminAllPosts from "./components/AdminAllPosts";
import AdminAllUsers from "./components/AdminAllUsers";
import AdminAllComments from "./components/AdminAllComments";
import AdminDisplayPost from "./components/AdminDisplayPost";
import AdminDisplayComments from "./components/AdminDisplayComments";
import Account from "./components/Account";
import EditProfilePicture from "./components/EditProfilePicture";
import EditUsername from "./components/EditUsername";
import EditPassword from "./components/EditPassword";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Search />
        },
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
        },
        {
          path: "/:id/profile",
          element: <Profile />
        },
        {
          path: "/:postId/comments",
          element: <Comments />
        },
        {
          path: "/:postId/likes",
          element: <Likes />
        },
        {
          path: "/user",
          element: <User />
        },
        {
          path: "/user/account",
          element: <Account />
        },
        {
          path: "/user/settings/edit",
          element: <EditAccount />
        },
        {
          path: "/user/settings/edit/picture",
          element: <EditProfilePicture />
        },
        {
          path: "/user/settings/edit/username",
          element: <EditUsername />
        },
        {
          path: "/user/settings/edit/password",
          element: <EditPassword />
        },
        {
          path: "/post",
          element: <Post />
        },
        {
          path: "/post/edit/:postId",
          element: <Post />
        },
        {
          path: "/inbox",
          element: <Inbox />
        },
        {
          path: "/:id/followers",
          element: <Followers />
        },
        {
          path: "/:id/following",
          element: <Following />
        },
        ,
        {
          path: "/admin/:id",
          element: <AdminAllUsers />
        },
        {
          path: "/admin/:adminId/:user/posts",
          element: <AdminUserPosts />
        },
        {
          path: "/admin/:adminId/:user/comments",
          element: <AdminUserComments />
        },
        {
          path: "/admin/:adminId/posts",
          element: <AdminAllPosts />
        },
        {
          path: "/admin/:adminId/comments",
          element: <AdminAllComments />
        },
        {
          path: "/admin/:adminId/post/:postId",
          element: <AdminDisplayPost />
        },
        {
          path: "/admin/:adminId/post/:postId/comments",
          element: <AdminDisplayComments />
        }
      ],
      errorElement: <ErrorPage />
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
