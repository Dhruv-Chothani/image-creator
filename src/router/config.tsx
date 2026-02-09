import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const LanguageSelection = lazy(() => import('../pages/language/page'));
const Home = lazy(() => import('../pages/home/page'));
const Category = lazy(() => import('../pages/category/page'));
const EnhancedCategoryForm = lazy(() => import('../components/EnhancedCategoryForm'));
const EnhancedGallery = lazy(() => import('../components/EnhancedGallery'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Wrapper component to extract category from URL params
const CategoryFormWrapper = () => {
  const { useParams } = require('react-router-dom');
  const { type } = useParams();
  return <EnhancedCategoryForm category={type || 'birthday'} />;
};

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LanguageSelection />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/category',
    element: <Category />
  },
  {
    path: '/category/:type',
    element: <CategoryFormWrapper />
  },
  {
    path: '/gallery',
    element: <EnhancedGallery />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
