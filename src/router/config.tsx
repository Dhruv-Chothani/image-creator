import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const LanguageSelection = lazy(() => import('../pages/language/page'));
const Home = lazy(() => import('../pages/home/page'));
const Category = lazy(() => import('../pages/category/page'));
const AIGeneratorPage = lazy(() => import('../pages/ai-generator/page'));
const OccasionPage = lazy(() => import('../pages/occasion/page'));
const FestivalOccasionsPage = lazy(() => import('../pages/festival-occasions/page'));
const SimplePersonalizePage = lazy(() => import('../pages/simple-personalize/page'));
const PersonalizePage = lazy(() => import('../pages/personalize/page'));
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
    path: '/ai-generator',
    element: <AIGeneratorPage />
  },
  {
    path: '/category',
    element: <Category />
  },
  {
    path: '/festival-occasions',
    element: <FestivalOccasionsPage />
  },
  {
    path: '/simple-personalize',
    element: <SimplePersonalizePage />
  },
  {
    path: '/occasion',
    element: <OccasionPage />
  },
  {
    path: '/personalize',
    element: <PersonalizePage />
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
