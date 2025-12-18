import { Routes, Route } from 'react-router-dom';
import { publicRoutes, authRoutes } from './routes';




export default function AppRouter(){

  return (
    <Routes>
      {/* PUBLIC */}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} exact />
      ))}

      {/* USER */}
      {authRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} exact />
      ))}

			{/* ADMIN */}
			{/* {adminRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} exact />
      ))}  */}
    </Routes>
  );
};
