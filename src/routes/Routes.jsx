
import { createBrowserRouter } from "react-router";
import Home from './../pages/Home';
import Root from "../layouts/Root";
import Login from "../pages/Login";
import Projects from "../components/Home/Projects";
import ProjectsDetails from './../pages/ProjectsDetails';
import AdminLayotes from "../layouts/AdminLayotes";
import AdminProtected from './AdminProtected';
import Dashboard from "../pages/admin/Dashboard";
import Profile from "../pages/admin/Profile";
import Cover from "../pages/admin/Cover";
import ProjectsAdmin from "../pages/admin/ProjectsAdmin";
import SkillsAdmin from "../pages/admin/SkillsAdmin";
import MessageAdmin from "../pages/admin/MessageAdmin";
import SettingsAdmin from './../pages/admin/SettingsAdmin';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children:[
        {
            path: "/",
            element: <Home/>
        },
        {
          path: "/about",
          element: <Home/>
        },
        {
          path: "/projects",
          element: <Home/>
        },
        {
          path: "/skills",
          element: <Home/>
        },
        {
          path: "/contact",
          element: <Home/>
        },
        {
          path: "/projects/:id",
          element: <ProjectsDetails/>
        },
        {
            path: "/admin/login",
            element: <Login/>
        }
    ]
  },
  {
    path: '/admin',
    element: <AdminProtected>
      <AdminLayotes/>
    </AdminProtected>,
    children: [
      {
        path: "dashboard",
        element: <Dashboard/>
      },
      {
        path: "profile",
        element: <Profile/>
      },
      {
        path: "cover",
        element: <Cover/>
      },
      {
        path: "projects",
        element: <ProjectsAdmin/>
      },
      {
        path: "skills",
        element: <SkillsAdmin/>
      },
      {
        path: "messages",
        element: <MessageAdmin/>
      },
      {
        path: "settings",
        element: <SettingsAdmin/>
      }
    ]
  }
]);

export default router