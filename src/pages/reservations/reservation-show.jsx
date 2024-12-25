/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { useLocation, Link, Outlet, useParams, useNavigate } from 'react-router-dom';


// material-ui
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// project-imports
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from 'config';

// assets
import { Profile, Calendar, DollarCircle, Image, Folder, ClipboardText, ArchiveTick } from 'iconsax-react';
import { GetVilla, GetVillaName } from 'services/villaServices';
import { GetReservation } from 'services/reservationServices';
import { Button, Grid } from '@mui/material';
import ReservationUpdateModal from 'sections/reservations/ReservationUpdateModal';

// ==============================|| PROFILE - ACCOUNT ||============================== //

export default function ReservationShow() {
    const { pathname } = useLocation();
    const params = useParams();
    const navigate = useNavigate()
    const [reservationUpdateModal, setReservationUpdateModal] = useState(false)

    let selectedTab = 0;
    let breadcrumbTitle = '';
    let breadcrumbHeading = '';

    if (pathname.indexOf('summary') != -1) {
        selectedTab = 0;
    } else if (pathname.indexOf('price-details') != -1) {
        selectedTab = 1;
    }
    else if (pathname.indexOf('payments') != -1) {
        selectedTab = 2;
    }
    else if (pathname.indexOf('customers') != -1) {
        selectedTab = 3;
    }
    // switch (pathname) {
    //     case '/apps/profiles/account/personal':
    //         breadcrumbTitle = 'Personal';
    //         breadcrumbHeading = 'Personal';
    //         selectedTab = 1;
    //         break;
    //     case '/apps/profiles/account/my-account':
    //         breadcrumbTitle = 'My Account';
    //         breadcrumbHeading = 'My Account';
    //         selectedTab = 2;
    //         break;
    //     case '/apps/profiles/account/password':
    //         breadcrumbTitle = 'Change Password';
    //         breadcrumbHeading = 'Change Password';
    //         selectedTab = 3;
    //         break;
    //     case '/apps/profiles/account/role':
    //         breadcrumbTitle = 'Role';
    //         breadcrumbHeading = 'Accountant';
    //         selectedTab = 4;
    //         break;
    //     case '/apps/profiles/account/settings':
    //         breadcrumbTitle = 'Settings';
    //         breadcrumbHeading = 'Account Settings';
    //         selectedTab = 5;
    //         break;
    //     case '/apps/profiles/account/basic':
    //     default:
    //         breadcrumbTitle = 'Basic';
    //         breadcrumbHeading = 'Basic Account';
    //         selectedTab = 0;
    // }

    const [value, setValue] = useState(selectedTab);
    const [villa, setVilla] = useState();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let breadcrumbLinks = [
        { title: 'Rezervasyon Yönetimi', to: '/reservations/list' }
    ];
    if (selectedTab === 0) {
        breadcrumbLinks = [{ title: 'Rezervasyon Yönetimi', to: '/reservations/list' }, { title: 'Rezervasyon Bilgiler' }];
    }
    else if (selectedTab === 1) {
        breadcrumbLinks = [{ title: 'Rezervasyon Yönetimi', to: '/reservations/list' }, { title: 'Fiyat Detayları' }];
    }
    else if (selectedTab === 2) {
        breadcrumbLinks = [{ title: 'Rezervasyon Yönetimi', to: '/reservations/list' }, { title: 'Ödemeler' }];
    }
    else if (selectedTab === 3) {
        breadcrumbLinks = [{ title: 'Rezervasyon Yönetimi', to: '/reservations/list' }, { title: 'Misafirler' }];
    }

    useEffect(() => {
        if (pathname === `/reservations/show/summary/${params.id}`) {
            setValue(0);
        }
    }, [pathname]);

    useEffect(() => {
        if (params.id) {
            GetReservation(params.id).then((res) => {
                if (res?.statusCode !== 200) {
                    navigate('/404')
                } else if (res?.data === null) {
                    navigate('/404')
                }
            })
        }

    }, [])




    return (
        <>
            <ReservationUpdateModal open={reservationUpdateModal} modalToggler={setReservationUpdateModal} />
            <Breadcrumbs custom links={breadcrumbLinks} />
            <Grid style={{ marginBottom: '10px' }} container justifyContent="flex-end" alignItems="normal">
                <Button onClick={() => setReservationUpdateModal(true)} size='small' type="button" variant="contained">GÜNCELLE</Button>
            </Grid>
            <MainCard border={false}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                    <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
                        <Tab label="Rezervasyon Bilgileri" component={Link} to={`/reservations/show/summary/${params.id}`} icon={<Profile />} iconPosition="start" />
                        <Tab
                            label="Fiyat Detayları"
                            component={Link}
                            to={`/reservations/show/price-details/${params.id}`}
                            icon={<Calendar />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Ödemeler"
                            component={Link}
                            to={`/reservations/show/payments/${params.id}`}
                            icon={<ArchiveTick />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Misafirler"
                            component={Link}
                            to={`/reservations/show/customers/${params.id}`}
                            icon={<DollarCircle />}
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>
                <Box sx={{ mt: 2.5 }}>
                    <Outlet />
                </Box>
            </MainCard>
        </>
    );
}
