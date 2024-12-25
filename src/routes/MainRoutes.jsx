import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import GeneralSettings from 'pages/settings/general-settings';
import UserList from 'pages/settings/user-settings/user-list';
import Default from 'pages/default';
import VillasList from 'pages/facilities/villas-list';
import ApartList from 'pages/facilities/aparts/apart-list';
import VillaAdd from 'pages/facilities/villa-add';
import VillaShow from 'pages/facilities/villa-show';
import VillaSummary from 'pages/facilities/tabs/villa-summary';
import VillaReservation from 'pages/facilities/tabs/villa-reservation';
import VillaPrice from 'pages/facilities/tabs/villa-price';
import VillaGallery from 'pages/facilities/tabs/villa-gallery';
import VillaFile from 'pages/facilities/tabs/villa-file';
import VillaContent from 'pages/facilities/tabs/villa-content';
import VillaAvailableDate from 'pages/facilities/tabs/villa-available-date';
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/Dashboard';
import VillaUpdate from 'pages/facilities/villa-update';
import ReservationsList from 'pages/reservations/reservation-list';
import ReservationAdd from 'pages/reservations/reservation-add';
import ReservationShow from 'pages/reservations/reservation-show';
import ReservationSummary from 'pages/reservations/tabs/reservation-summary';
import ReservationPriceDetail from 'pages/reservations/tabs/reservation-price-details';
import ReservationPayment from 'pages/reservations/tabs/reservation-payments';
import ReservationCustomer from 'pages/reservations/tabs/reservation-customers';
import ApartShow from 'pages/facilities/aparts/apart-show';
import ApartSummary from 'pages/facilities/aparts/tabs/apart-summary';
import ApartContent from 'pages/facilities/aparts/tabs/apart-content';
import ApartAdd from 'pages/facilities/aparts/apart-add';
import ApartUpdate from 'pages/facilities/aparts/apart-update';
import RoomShow from 'pages/facilities/aparts/rooms/room-show';
import RoomSummary from 'pages/facilities/aparts/rooms/tabs/room-summary';
import ApartGallery from 'pages/facilities/aparts/tabs/apart-gallery';
import ApartFile from 'pages/facilities/aparts/tabs/apart-file';
import RoomReservation from 'pages/facilities/aparts/rooms/tabs/room-reservation';
import RoomPrice from 'pages/facilities/aparts/rooms/tabs/room-price';
import RoomAvailableDate from 'pages/facilities/aparts/rooms/tabs/room-available-date';
import RoomGallery from 'pages/facilities/aparts/rooms/tabs/room-gallery';
import RoomFile from 'pages/facilities/aparts/rooms/tabs/room-file';
import CategoryPage from 'pages/category';
import RoomUpdate from 'pages/facilities/aparts/rooms/room-update';
import VillaAccounting from 'pages/facilities/tabs/villa-accounting';
import ApartAccounting from 'pages/facilities/aparts/tabs/apart-accounting';
import RoomAccounting from 'pages/facilities/aparts/rooms/tabs/room-accounting';
import PaymentTypesPage from 'pages/payment-types';
import BlogPage from 'pages/website-management/blog-page';
import StaticContentPage from 'pages/website-management/static-contents-page';
import SssPage from 'pages/website-management/sss-page';
import RoomContent from 'pages/facilities/aparts/rooms/tabs/room-content';
import VillaCommentSection from 'pages/facilities/tabs/villa-comments';
import ApartComments from 'pages/facilities/aparts/tabs/apart-comments';
import RegionPage from 'pages/website-management/region-page';
import ActivityPage from 'pages/website-management/activity-page';


const ErrorPage = Loadable(lazy(() => import('pages/error-pages/404')));

const MainRoutes = {
  path: '/',
  children: [
    {
      element: <AuthGuard><MainLayout /></AuthGuard>,
      children: [
        {
          path: '/default',
          url: '/default',
          index: true,
          element: <Default />
        },
        {
          path: '/facilities',
          children: [
            {
              path: 'villas-list',
              element: <VillasList />
            },
            {
              path: 'villas-add',
              element: <VillaAdd />
            },
            {
              path: 'villas-update/:id',
              element: <VillaUpdate />
            },
            {
              path: 'villas-show',
              element: <VillaShow />,
              children: [
                {
                  path: 'summary/:id',
                  element: <VillaSummary />
                },
                {
                  path: 'reservation/:id',
                  element: <VillaReservation />
                },
                {
                  path: 'price/:id',
                  //element: <VillaPrice />
                  element: <VillaPrice />
                },
                {
                  path: 'gallery/:id',
                  element: <VillaGallery />
                },
                {
                  path: 'comments/:id',
                  element: <VillaCommentSection />
                },
                {
                  path: 'file/:id',
                  element: <VillaFile />
                },
                {
                  path: 'content/:id',
                  element: <VillaContent />
                },
                {
                  path: 'available-date/:id',
                  element: <VillaAvailableDate />
                },
                {
                  path: 'accounting/:id',
                  element: <VillaAccounting />
                }
              ]
            },
            {
              path: 'aparts-list',
              element: <ApartList />
            },
            {
              path: 'apart-add',
              element: <ApartAdd />
            },
            {
              path: 'apart-update/:id',
              element: <ApartUpdate />
            },
            {
              path: 'aparts/apart-show',
              element: <ApartShow />,
              children: [
                {
                  path: 'summary/:id',
                  element: <ApartSummary />
                },
                {
                  path: 'content/:id',
                  element: <ApartContent />
                },
                {
                  path: 'gallery/:id',
                  element: <ApartGallery />
                },
                {
                  path: 'file/:id',
                  element: <ApartFile />
                },
                {
                  path: 'comments/:id',
                  element: <ApartComments />
                },
                {
                  path: 'accounting/:id',
                  element: <ApartAccounting />
                }
              ]
            },
            {
              path: 'room-update/:id',
              element: <RoomUpdate />
            },
            {
              path: 'aparts/room-show',
              element: <RoomShow />,
              children: [
                {
                  path: 'summary/:id',
                  element: <RoomSummary />
                },
                {
                  path: 'reservation/:id',
                  element: <RoomReservation />
                },
                {
                  path: 'price/:id',
                  element: <RoomPrice />
                },
                {
                  path: 'content/:id',
                  element: <RoomContent />
                },
                {
                  path: 'available-date/:id',
                  element: <RoomAvailableDate />
                },
                {
                  path: 'gallery/:id',
                  element: <RoomGallery />
                },
                {
                  path: 'file/:id',
                  element: <RoomFile />
                },
                {
                  path: 'accounting/:id',
                  element: <RoomAccounting />
                }
              ]
            }
          ]
        },
        {
          path: '/category',
          url: '/category',
          element: <CategoryPage />
        },
        {
          path: '/payment-types',
          url: '/payment-types',
          element: <PaymentTypesPage />
        },
        {
          path: '/reservations',
          children: [
            {
              path: 'list',
              element: <ReservationsList />
            },
            {
              path: 'add',
              element: <ReservationAdd />
            },
            {
              path: 'show',
              element: <ReservationShow />,
              children: [
                {
                  path: 'summary/:id',
                  element: <ReservationSummary />
                },
                {
                  path: 'price-details/:id',
                  element: <ReservationPriceDetail />
                },
                {
                  path: 'payments/:id',
                  //element: <VillaPrice />
                  element: <ReservationPayment />
                },
                {
                  path: 'customers/:id',
                  element: <ReservationCustomer />
                }
              ]
            }
          ]
        },
        {
          path: '/settings',
          children: [
            {
              path: 'general-settings',
              element: <GeneralSettings />
            },
            {
              children: [
                {
                  path: 'user-list',
                  element: <UserList />
                }
              ]
            }
          ]
        },
        {
          path: '/website-management',
          children: [
            {
              path: 'blogs',
              element: <BlogPage />
            },
            {
              path: 'regions',
              element: <RegionPage />
            },
            {
              path: 'activities',
              element: <ActivityPage />
            },
            {
              path: 'static-contents',
              element: <StaticContentPage />
            },
            {
              path: 'sss',
              element: <SssPage />
            }

          ]
        }
      ]
    },
    {
      path: '*',
      element: <ErrorPage />
    }
  ]
};

export default MainRoutes;
