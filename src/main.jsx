import React from 'react'
import ReactDOM from 'react-dom/client'
import {v4 as uuidv4} from "uuid"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root, { action as rootAction, load as rootLoader } from './routes/root';
import Editor, { action as editorAction, load as editorLoader } from './routes/editor';
import { action as destroyAction } from './routes/destroy';
import { action as editAction } from './routes/edit';
import "./main.css"

const router = createBrowserRouter([
  {
    path:"/",
    element:<Root/>,
    loader:rootLoader,
    action:rootAction,
    children:[
      {
        path:"editor/:docId",
        element:<Editor/>,
        loader:editorLoader,
        action:editorAction,
      },
      {
        path:"editor/:docId/edit",
        element:<Editor key={uuidv4()} created={true}/>,
        loader:editorLoader,
        action:editAction,
      },
      {
        path:"editor/:docId/destroy",
        action:destroyAction,
      },
    ]
  }
],{
  basename:"/markdown"
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
