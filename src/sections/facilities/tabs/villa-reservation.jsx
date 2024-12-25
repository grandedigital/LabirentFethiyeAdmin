/* eslint-disable prettier/prettier */
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, Divider, Stack, Button, Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Typography, Box, FormControlLabel, Switch, } from '@mui/material';

// third-party
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import { DebouncedInput, HeaderSort, TablePagination } from 'components/third-party/react-table';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add } from 'iconsax-react';

// custom
import { ReservationServices } from 'services';
import Loader from 'components/Loader';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import ReservationModal from 'sections/reservations/ReservationModal';
import { stringToDate } from 'utils/custom/dateHelpers';

const fallbackData = [];
function ReactTable({ data, columns, modalToggler, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter, showAllReservation, setShowAllReservation, showAgencyReservation, setShowAgencyReservation }) {

    const navigate = useNavigate();


    const table = useReactTable({
        data: data?.data || fallbackData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        pageCount: data?.pageInfo?.totalPage,
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
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3,overflowX: 'auto' }}>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    disabled={showAllReservation}
                    onFilterChange={(value) => setGlobalFilter(String(value))}
                    placeholder={`Müşteri adı`}
                />

                <Stack direction="row" alignItems="center" spacing={2}>
                    <FormControlLabel style={{ position: 'relative', top: '5px' }} control={<Switch sx={{ mt: 0 }} />} label={<p style={{ position: 'relative', top: '-4px' }}>Acenta Rezervasyonları</p>} labelPlacement="start" checked={showAgencyReservation} onChange={() => setShowAgencyReservation(!showAgencyReservation)} />
                    <FormControlLabel style={{ position: 'relative', top: '5px' }} control={<Switch sx={{ mt: 0 }} />} label={<p style={{ position: 'relative', top: '-4px' }}>Tüm rezervasyonlar</p>} labelPlacement="start" checked={showAllReservation} onChange={() => setShowAllReservation(!showAllReservation)} />
                    <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
                        Rezervasyon Ekle
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
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        onClick={() => {
                                            navigate(`/reservations/show/summary/${row.original.id}`)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
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

export default function VillaReservationSection() {
    const theme = useTheme();
    const params = useParams();

    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [reservationModal, setReservationModal] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false)
    const [showAllReservation, setShowAllReservation] = useState(false)
    const [isAdded, setIsAdded] = useState(false)

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    const [showAgencyReservation, setShowAgencyReservation] = useState(true)

    useEffect(() => {
        setLoading(true)
        ReservationServices.GetReservations(params.id, pagination.pageIndex, pagination.pageSize, showAllReservation, showAgencyReservation, globalFilter, sorting[0]?.id === 'customerName' ? sorting[0]?.desc : null, sorting[0]?.id === 'reservationStatusType' ? sorting[0]?.desc : null, sorting[0]?.id === 'checkIn' ? sorting[0]?.desc : null, sorting[0]?.id === 'checkOut' ? sorting[0]?.desc : null, sorting[0]?.id === 'price' ? sorting[0]?.desc : null).then((res) => { setData(res); setLoading(false); });
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, showAllReservation,showAgencyReservation]);


    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter, showAllReservation])

    useEffect(() => {
        if (isDeleted || isAdded) {
            setIsDeleted(false)
            setIsAdded(false)
            setLoading(true)
            //ReservationServices.Villas(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter).then((res) => { setData(res); setLoading(false); });
            // ReservationServices.GetReservations(params.id, pagination.pageIndex, pagination.pageSize).then((res) => { setData(res); setLoading(false); });
            ReservationServices.GetReservations(params.id, pagination.pageIndex, pagination.pageSize, showAllReservation, showAgencyReservation, globalFilter, sorting[0]?.id === 'customerName' ? sorting[0]?.desc : null, sorting[0]?.id === 'reservationStatusType' ? sorting[0]?.desc : null, sorting[0]?.id === 'checkIn' ? sorting[0]?.desc : null, sorting[0]?.id === 'checkOut' ? sorting[0]?.desc : null, sorting[0]?.id === 'price' ? sorting[0]?.desc : null).then((res) => { setData(res); setLoading(false); });
        }
    }, [isDeleted, isAdded])

    const columns = useMemo(
        () => [
            {
                header: '#',
                cell: ({ row }) => { return row.index + 1 }
            },
            {
                header: 'Misafir',
                accessorKey: 'customerName',
                cell: ({ row }) => {
                    return (
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar
                                alt="Avatar"
                                size="sm"
                                src={getImageUrl(`avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`, ImagePath.USERS)}
                            />
                            <Stack spacing={0}>
                                <Typography variant="subtitle1">{`${row?.original?.reservationInfos[0]?.name ? row?.original?.reservationInfos[0]?.name : 'Ev Sahibi'} ${row?.original?.reservationInfos[0]?.surname ? row?.original?.reservationInfos[0]?.surname : ''}`}</Typography>
                            </Stack>
                        </Stack>
                    )
                }
            },
            {
                header: 'Rez. Durumu',
                accessorKey: 'reservationStatusType',
                cell: (cell) => {
                    switch (cell.getValue()) {
                        case 1:
                            return <Chip color="success" label="Rezerve" size="small" variant="light" />;
                        case 2:
                            return <Chip color="info" label="Opsiyonlanmış" size="small" variant="light" />;
                        case 3:
                            return <Chip color="error" label="İptal Edilmiş" size="small" variant="light" />;
                        case 4:
                            return <Chip color="primary" label="Konaklama Bitmiş" size="small" variant="light" />;
                        default:
                            return <Chip color="info" label="Pending" size="small" variant="light" />;
                    }
                }
            },

            {
                header: 'Giriş Tarihi',
                accessorKey: 'checkIn',
                cell: ({ row }) => { return stringToDate(row.original.checkIn) }
            },
            {
                header: 'Çıkış Tarihi',
                accessorKey: 'checkOut',
                cell: ({ row }) => { return stringToDate(row.original.checkOut) }
            },
            {
                header: 'Tutar',
                accessorKey: 'price',
                cell: ({ row }) => { return (row?.original.total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + `${row?.original?.priceType === 1 ? ' TL' : row?.original?.priceType === 2 ? ' USD' : row?.original?.priceType === 3 ? ' EUR' : row?.original?.priceType === 4 ? ' GBP' : ''}`) }
            }
        ], // eslint-disable-next-line
        [theme]
    );

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
                    setShowAllReservation,
                    setShowAgencyReservation,
                    showAgencyReservation
                }}
            />

            <ReservationModal setIsAdded={setIsAdded} open={reservationModal} modalToggler={setReservationModal} villaId={params.id} />
        </>
    );
}