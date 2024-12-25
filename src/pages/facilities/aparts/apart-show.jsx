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
import { Profile, Calendar, DollarCircle, Image, Folder, ClipboardText, ArchiveTick, MoneySend, Message } from 'iconsax-react';
import { Button, Grid } from '@mui/material';
import { GetApart, GetApartName } from 'services/apartServices';
import ApartSelectModal from 'sections/facilities/aparts/ApartSelectModal';
import ApartDetailUpdateModal from 'sections/facilities/aparts/ApartDetailUpdateModal';

// ==============================|| PROFILE - ACCOUNT ||============================== //

export default function ApartShow() {
    const { pathname } = useLocation();
    const params = useParams();
    const navigate = useNavigate()

    let selectedTab = 0;
    let breadcrumbTitle = '';
    let breadcrumbHeading = '';

    if (pathname.indexOf('summary') != -1) {
        selectedTab = 0;
    } else if (pathname.indexOf('content') != -1) {
        selectedTab = 1;
    } else if (pathname.indexOf('gallery') != -1) {
        selectedTab = 2;
    }
    else if (pathname.indexOf('file') != -1) {
        selectedTab = 3;
    }
    else if (pathname.indexOf('accounting') != -1) {
        selectedTab = 4;
    }
    else if (pathname.indexOf('comments') != -1) {
        selectedTab = 5;
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

    const [villaSelectModal, setVillaSelectModal] = useState(false)
    const [villaUpdateModal, setVillaUpdateModal] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    let breadcrumbLinks = [
        { title: 'Apart Yönetimi', to: '/facilities/aparts-list' }
    ];
    if (selectedTab === 0) {
        breadcrumbLinks = [{ title: 'Apart Yönetimi', to: '/facilities/aparts-list' }, { title: villa?.hotelDetails[0]?.name, to: `/facilities/aparts/apart-show/summary/${params.id}` }, { title: 'Özet Bilgiler' }];
    }
    else if (selectedTab === 1) {
        breadcrumbLinks = [{ title: 'Apart Yönetimi', to: '/facilities/aparts-list' }, { title: villa?.hotelDetails[0]?.name, to: `/facilities/aparts/apart-show/content/${params.id}` }, { title: 'İçerik Yönetimi' }];
    }
    else if (selectedTab === 2) {
        breadcrumbLinks = [{ title: 'Apart Yönetimi', to: '/facilities/aparts-list' }, { title: villa?.hotelDetails[0]?.name, to: `/facilities/aparts/apart-show/gallery/${params.id}` }, { title: 'Galeri' }];
    }
    else if (selectedTab === 3) {
        breadcrumbLinks = [{ title: 'Apart Yönetimi', to: '/facilities/aparts-list' }, { title: villa?.hotelDetails[0]?.name, to: `/facilities/aparts/apart-show/file/${params.id}` }, { title: 'Dosyalar' }];
    }
    else if (selectedTab === 4) {
        breadcrumbLinks = [{ title: 'Apart Yönetimi', to: '/facilities/aparts-list' }, { title: villa?.hotelDetails[0]?.name, to: `/facilities/aparts/apart-show/accounting/${params.id}` }, { title: 'Gelir Gider' }];
    }
    else if (selectedTab === 5) {
        breadcrumbLinks = [{ title: 'Apart Yönetimi', to: '/facilities/aparts-list' }, { title: villa?.hotelDetails[0]?.name, to: `/facilities/aparts/apart-show/comments/${params.id}` }, { title: 'Yorumlar' }];
    }

    useEffect(() => {
        if (pathname === `/facilities/aparts/apart-show/summary/${params.id}`) {
            setValue(0);
        }
    }, [pathname]);



    useEffect(() => {
        if (params.id)
            GetApart(params.id).then((res) => {
                if (res?.statusCode === 200) {
                    if (res?.data !== null) {
                        setVilla(res.data);
                    } else {
                        navigate('/404')
                    }
                } else {
                    navigate('/404')
                }
            })
    }, [])

    useEffect(() => {
        if (isDeleted) {
            if (params.id) {
                GetApart(params.id).then((res) => {
                    setVilla(res.data);
                })
            }
            setIsDeleted(false)
        }
    }, [isDeleted])

    return (
        <>
            <ApartSelectModal villaDetailModal={setVillaUpdateModal} navigate={navigate} title={villa} open={villaSelectModal} handleClose={() => setVillaSelectModal(false)} id={params.id} />
            <ApartDetailUpdateModal selectedUpdateItem={villa} setIsAdded={setIsDeleted} open={villaUpdateModal} modalToggler={setVillaUpdateModal} />

            <Breadcrumbs custom links={breadcrumbLinks} />
            <Grid style={{ marginBottom: '10px' }} container justifyContent="flex-end" alignItems="normal">
                <Button onClick={() => setVillaSelectModal(true)} size='small' type="button" variant="contained">GÜNCELLE</Button>
            </Grid>
            <MainCard border={false}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                    <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
                        <Tab label="Özet Bilgiler" component={Link} to={`/facilities/aparts/apart-show/summary/${params.id}`} icon={<Profile />} iconPosition="start" />
                        <Tab
                            label="İçerik Yönetimi"
                            component={Link}
                            to={`/facilities/aparts/apart-show/content/${params.id}`}
                            icon={<ClipboardText />}
                            iconPosition="start"
                        />
                        <Tab label="Galeri" component={Link} to={`/facilities/aparts/apart-show/gallery/${params.id}`} icon={<Image />} iconPosition="start" />
                        <Tab label="Dosyalar" component={Link} to={`/facilities/aparts/apart-show/file/${params.id}`} icon={<Folder />} iconPosition="start" />
                        <Tab label="Gelir Gider" component={Link} to={`/facilities/aparts/apart-show/accounting/${params.id}`} icon={<MoneySend />} iconPosition="start" />
                        <Tab label="Yorumlar" component={Link} to={`/facilities/aparts/apart-show/comments/${params.id}`} icon={<Message />} iconPosition="start" />
                    </Tabs>
                </Box>
                <Box sx={{ mt: 2.5 }}>
                    <Outlet />
                </Box>
            </MainCard>
        </>
    );
}
