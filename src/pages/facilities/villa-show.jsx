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
import { GetVilla, GetVillaName } from 'services/villaServices';
import { Button, Grid } from '@mui/material';
import VillaSelectModal from 'sections/facilities/VillaSelectModal';
import VillaDetailUpdateModal from 'sections/facilities/VillaDetailUpdateModal';

// ==============================|| PROFILE - ACCOUNT ||============================== //

export default function VillaShow() {
    const { pathname } = useLocation();
    const params = useParams();
    const navigate = useNavigate()

    let selectedTab = 0;
    let breadcrumbTitle = '';
    let breadcrumbHeading = '';

    if (pathname.indexOf('summary') != -1) {
        selectedTab = 0;
    } else if (pathname.indexOf('reservation') != -1) {
        selectedTab = 1;
    }
    else if (pathname.indexOf('available-date') != -1) {
        selectedTab = 2;
    }
    else if (pathname.indexOf('price') != -1) {
        selectedTab = 3;
    } else if (pathname.indexOf('content') != -1) {
        selectedTab = 4;
    } else if (pathname.indexOf('gallery') != -1) {
        selectedTab = 5;
    }
    else if (pathname.indexOf('file') != -1) {
        selectedTab = 6;
    }
    else if (pathname.indexOf('accounting') != -1) {
        selectedTab = 7;
    }
    else if (pathname.indexOf('comments') != -1) {
        selectedTab = 8;
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
        { title: 'Villa Yönetimi', to: '/facilities/villas-list' }
    ];
    if (selectedTab === 0) {
        breadcrumbLinks = [{ title: 'Villa Yönetimi', to: '/facilities/villas-list' }, { title: villa?.villaDetails[0]?.name, to: `/facilities/villas-show/summary/${params.id}` }, { title: 'Özet Bilgiler' }];
    }
    else if (selectedTab === 1) {
        breadcrumbLinks = [{ title: 'Villa Yönetimi', to: '/facilities/villas-list' }, { title: villa?.villaDetails[0]?.name, to: `/facilities/villas-show/reservation/${params.id}` }, { title: 'Rezervasyonlar' }];
    }
    else if (selectedTab === 2) {
        breadcrumbLinks = [{ title: 'Villa Yönetimi', to: '/facilities/villas-list' }, { title: villa?.villaDetails[0]?.name, to: `/facilities/villas-show/available-date/${params.id}` }, { title: 'Müsait Tarihler' }];
    }
    else if (selectedTab === 3) {
        breadcrumbLinks = [{ title: 'Villa Yönetimi', to: '/facilities/villas-list' }, { title: villa?.villaDetails[0]?.name, to: `/facilities/villas-show/price/${params.id}` }, { title: 'Fiyatlar' }];
    }
    else if (selectedTab === 4) {
        breadcrumbLinks = [{ title: 'Villa Yönetimi', to: '/facilities/villas-list' }, { title: villa?.villaDetails[0]?.name, to: `/facilities/villas-show/content/${params.id}` }, { title: 'İçerik Yönetimi' }];
    }
    else if (selectedTab === 5) {
        breadcrumbLinks = [{ title: 'Villa Yönetimi', to: '/facilities/villas-list' }, { title: villa?.villaDetails[0]?.name, to: `/facilities/villas-show/gallery/${params.id}` }, { title: 'Galeri' }];
    }
    else if (selectedTab === 6) {
        breadcrumbLinks = [{ title: 'Villa Yönetimi', to: '/facilities/villas-list' }, { title: villa?.villaDetails[0]?.name, to: `/facilities/villas-show/file/${params.id}` }, { title: 'Dosyalar' }];
    }
    else if (selectedTab === 7) {
        breadcrumbLinks = [{ title: 'Villa Yönetimi', to: '/facilities/villas-list' }, { title: villa?.villaDetails[0]?.name, to: `/facilities/villas-show/accounting/${params.id}` }, { title: 'Gelir Gider' }];
    }
    else if (selectedTab === 8) {
        breadcrumbLinks = [{ title: 'Villa Yönetimi', to: '/facilities/villas-list' }, { title: villa?.villaDetails[0]?.name, to: `/facilities/villas-show/comments/${params.id}` }, { title: 'Yorumlar' }];
    }

    useEffect(() => {
        if (pathname === `/facilities/villas-show/summary/${params.id}`) {
            setValue(0);
        }
    }, [pathname]);



    useEffect(() => {
        if (params.id) {
            GetVillaName(params.id).then((res) => {
                if (res?.statusCode === 200) {
                    if (res?.data !== null) {
                        setVilla(res.data)
                    } else {
                        navigate('/404')
                    }
                } else {
                    navigate('/404')
                }
            })
        }
    }, [])

    useEffect(() => {
        if (isDeleted) {
            if (params.id) {
                GetVillaName(params.id).then((res) => setVilla(res.data))
            }
            setIsDeleted(false)
        }
    }, [isDeleted])


    return (
        <>
            <VillaSelectModal villaDetailModal={setVillaUpdateModal} navigate={navigate} title={villa} open={villaSelectModal} handleClose={() => setVillaSelectModal(false)} id={params.id} />
            <VillaDetailUpdateModal selectedUpdateItem={villa} setIsAdded={setIsDeleted} open={villaUpdateModal} modalToggler={setVillaUpdateModal} />
            <Breadcrumbs custom links={breadcrumbLinks} />
            <Grid style={{ marginBottom: '10px' }} container justifyContent="flex-end" alignItems="normal">
                <Button onClick={() => setVillaSelectModal(true)} size='small' type="button" variant="contained">GÜNCELLE</Button>
            </Grid>
            <MainCard border={false}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                    <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
                        <Tab label="Özet Bilgiler" component={Link} to={`/facilities/villas-show/summary/${params.id}`} icon={<Profile />} iconPosition="start" />
                        <Tab
                            label="Rezervasyonlar"
                            component={Link}
                            to={`/facilities/villas-show/reservation/${params.id}`}
                            icon={<Calendar />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Müsait Tarihler"
                            component={Link}
                            to={`/facilities/villas-show/available-date/${params.id}`}
                            icon={<ArchiveTick />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Fiyatlar"
                            component={Link}
                            to={`/facilities/villas-show/price/${params.id}`}
                            icon={<DollarCircle />}
                            iconPosition="start"
                        />
                        <Tab
                            label="İçerik Yönetimi"
                            component={Link}
                            to={`/facilities/villas-show/content/${params.id}`}
                            icon={<ClipboardText />}
                            iconPosition="start"
                        />
                        <Tab label="Galeri" component={Link} to={`/facilities/villas-show/gallery/${params.id}`} icon={<Image />} iconPosition="start" />
                        <Tab label="Dosyalar" component={Link} to={`/facilities/villas-show/file/${params.id}`} icon={<Folder />} iconPosition="start" />
                        <Tab label="Gelir Gider" component={Link} to={`/facilities/villas-show/accounting/${params.id}`} icon={<MoneySend />} iconPosition="start" />
                        <Tab label="Yorumlar" component={Link} to={`/facilities/villas-show/comments/${params.id}`} icon={<Message />} iconPosition="start" />
                    </Tabs>
                </Box>
                <Box sx={{ mt: 2.5 }}>
                    <Outlet />
                </Box>
            </MainCard>
        </>
    );
}
