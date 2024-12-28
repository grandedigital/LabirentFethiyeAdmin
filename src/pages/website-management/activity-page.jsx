/* eslint-disable prettier/prettier */
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, Divider, Stack, Button, Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Typography, Box, FormControlLabel, Switch, Tooltip, IconButton, } from '@mui/material';

// third-party
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import { DebouncedInput, HeaderSort, TablePagination } from 'components/third-party/react-table';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add, Edit, Eye, Image, Trash } from 'iconsax-react';

// custom
import { ReservationServices } from 'services';
import Loader from 'components/Loader';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ReservationModal from 'sections/reservations/ReservationModal';
import ReservationModalDelete from 'sections/reservations/ReservationModalDelete';
import { Categories, CategoriesList } from 'services/categoryServices';
import CategoryAddModal from 'sections/category/CategoryAddModal';
import CategoryUpdateModal from 'sections/category/CategoryUpdateModal';
import { GetWebPages } from 'services/websiteServices';
import BlogAddModal from 'sections/website-management/BlogAddModal';
import BlogModalDelete from 'sections/website-management/BlogModalDelete';
import BlogUpdateModal from 'sections/website-management/BlogUpdateModal';
import WebsitePhotoModal from 'sections/website-management/WebsitePhotoModal';
import RegionAddModal from 'sections/website-management/RegionAddModal';
import RegionUpdateModal from 'sections/website-management/RegionUpdateModal';
import WebsiteSeoUpdateModal from 'sections/website-management/WebsiteSeoUpdateModal';
import WebsiteActionSelectModal from 'sections/website-management/WebsiteActionSelectModal';
import ActivityAddModal from 'sections/website-management/ActivityAddModal';
import ActivityUpdateModal from 'sections/website-management/ActivityUpdateModal';

const fallbackData = [];
function ReactTable({ data, columns, modalToggler, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter, showAllReservation, setShowAllReservation }) {

    const navigate = useNavigate();


    const table = useReactTable({
        data: data?.data || fallbackData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        pageCount: data?.pageInfo?.totalPage || 1,
        autoResetPageIndex: false,
        state: {
            sorting,
            globalFilter,
            pagination
        },
        debugTable: true
    });

    let headers = [];
    columns.map(
        (columns) =>
            // @ts-ignore
            columns.accessorKey &&
            headers.push({
                label: typeof columns.header === 'string' ? columns.header : '#',
                // @ts-ignore
                key: columns.accessorKey
            })
    );

    return (
        <MainCard content={false}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    disabled={showAllReservation}
                    onFilterChange={(value) => setGlobalFilter(String(value))}
                    placeholder={`Başlık`}
                />

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
                        Aktivite Ekle
                    </Button>
                </Stack>
            </Stack>
            <ScrollX>
                <Stack>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        <TableCell
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box>SIRA</Box>
                                            </Stack>
                                        </TableCell>
                                        {headerGroup.headers.map((header) => {
                                            if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                                                Object.assign(header.column.columnDef.meta, {
                                                    className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                                                });
                                            }

                                            return (
                                                <TableCell
                                                    key={header.id}
                                                    {...header.column.columnDef.meta}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    {...(header.column.getCanSort() &&
                                                        header.column.columnDef.meta === undefined && {
                                                        className: 'cursor-pointer prevent-select'
                                                    })}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                                                            {header.column.getCanSort() && <HeaderSort column={header.column} />}
                                                        </Stack>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {table.getRowModel().rows.map((row, i) => (
                                    <TableRow
                                        key={row.id}
                                        onClick={() => {
                                            // console.log("Kayıt Id => ", row.original.id);
                                            // navigate(`/reservations/show/summary/${row.original.id}`)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            {(pagination.pageIndex * pagination.pageSize) + (i + 1)}
                                        </TableCell>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                            <TablePagination
                                {...{
                                    setPageSize: table.setPageSize,
                                    setPageIndex: table.setPageIndex,
                                    getState: table.getState,
                                    getPageCount: table.getPageCount,
                                    initialPageSize: pagination.pageSize
                                }}
                            />
                        </Box>
                    </>
                </Stack>
            </ScrollX>
        </MainCard>
    );
}

export default function ActivityPage() {

    const theme = useTheme();
    const params = useParams();

    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [reservationModal, setReservationModal] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false)
    const [showAllReservation, setShowAllReservation] = useState(false)
    const [reservationDeleteId, setReservationDeleteId] = useState('');
    const [reservationModalDelete, setReservationModalDelete] = useState(false);
    const [selectedReservationDeleteItem, setSelectedReservationDeleteItem] = useState([])

    const [selectedItem, setSelectedItem] = useState([])
    const [categoryUpdateModal, setCategoryUpdateModal] = useState(false)
    const [websiteSelectActionModal, setWebsiteSelectActionModal] = useState(false)
    const [websiteSeoModal, setWebsiteSeoModal] = useState(false)

    const [websiteId, setWebsiteId] = useState('')

    const [photoModal, setPhotoModal] = useState(false)

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        GetWebPages('aktiviteler', pagination.pageIndex, pagination.pageSize).then((res) => { setData(res); setLoading(false); });
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, showAllReservation]);


    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter, showAllReservation])

    useEffect(() => {
        if (isDeleted) {
            setIsDeleted(false)
            setLoading(true)
            //ReservationServices.Villas(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter).then((res) => { setData(res); setLoading(false); });
            GetWebPages('aktiviteler', pagination.pageIndex, pagination.pageSize).then((res) => { setData(res); setLoading(false); });
        }
    }, [isDeleted])

    const columns = useMemo(
        () => [
            {
                header: 'Başlık',
                accessorKey: 'villaName',
                cell: ({ row }) => { return row?.original?.webPageDetails[0]?.title }
            },
            {
                header: 'İşlemler',
                meta: {
                    className: 'cell-center'
                },
                disableSortBy: true,
                cell: ({ row }) => {
                    const collapseIcon =
                        row.getCanExpand() && row.getIsExpanded() ? (
                            <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
                        ) : (
                            <Eye />
                        );
                    return (
                        <Stack direction="row" spacing={0}>
                            <Tooltip title="Photo">
                                <IconButton
                                    color="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedItem(row.original)
                                        setWebsiteId(row?.original?.id)
                                        setPhotoModal(true)
                                    }}
                                >
                                    <Image />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <IconButton
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedItem(row.original)
                                        // setCategoryUpdateModal(true)
                                        setWebsiteSelectActionModal(true)
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClose();
                                        setReservationDeleteId(Number(row.original.id));
                                        setSelectedReservationDeleteItem(row.original);
                                    }}
                                >
                                    <Trash />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    );
                }
            }
        ], // eslint-disable-next-line
        [theme]
    );


    const handleClose = () => {
        setReservationModalDelete(!reservationModalDelete);
    };

    if (loading) return (<Loader open={loading} />)

    return (
        <>
            <ReactTable
                {...{
                    data,
                    columns,
                    modalToggler: () => {
                        setReservationModal(true);
                    },
                    pagination,
                    setPagination,
                    setSorting,
                    sorting,
                    globalFilter,
                    setGlobalFilter,
                    showAllReservation,
                    setShowAllReservation
                }}
            />
            <WebsiteSeoUpdateModal selectedUpdateItem={selectedItem} setIsAdded={setIsDeleted} modalToggler={setWebsiteSeoModal} open={websiteSeoModal} />
            <WebsiteActionSelectModal websiteDetailModal={setCategoryUpdateModal} websiteSeoModal={setWebsiteSeoModal} title={selectedItem} open={websiteSelectActionModal} handleClose={() => setWebsiteSelectActionModal(false)} />
            <ActivityAddModal setIsAdded={setIsDeleted} open={reservationModal} modalToggler={setReservationModal} />
            <ActivityUpdateModal selectedUpdateItem={selectedItem} setIsAdded={setIsDeleted} open={categoryUpdateModal} modalToggler={setCategoryUpdateModal} />
            <BlogModalDelete selectedItem={selectedReservationDeleteItem} setIsDeleted={setIsDeleted} setLoading={setLoading} id={Number(reservationDeleteId)} title={reservationDeleteId} open={reservationModalDelete} handleClose={handleClose} />
            <WebsitePhotoModal open={photoModal} modalToggler={setPhotoModal} websiteId={websiteId} setIsEdit={setIsDeleted} setLoading={setLoading} />
        </>
    );
}