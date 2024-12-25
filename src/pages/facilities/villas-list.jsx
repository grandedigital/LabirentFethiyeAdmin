/* eslint-disable prettier/prettier */
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Chip, Divider, Stack, Button, Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Tooltip, Typography, Box } from '@mui/material';

// third-party
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { DebouncedInput, HeaderSort, TablePagination } from 'components/third-party/react-table';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';
import VillaModalDelete from 'sections/facilities/VillaModalDelete';
import Breadcrumbs from 'components/@extended/Breadcrumbs';

// assets
import { Add, Edit, Eye, Trash } from 'iconsax-react';

// custom
import { VillaServices } from 'services';
import Loader from 'components/Loader';
import { useNavigate } from 'react-router-dom';
import VillaSelectModal from 'sections/facilities/VillaSelectModal';
import VillaDetailUpdateModal from 'sections/facilities/VillaDetailUpdateModal';

// ==============================|| REACT TABLE - LIST ||============================== //
const fallbackData = [];
function ReactTable({ data, columns, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter }) {

    const navigate = useNavigate();

    const table = useReactTable({
        data: data?.data || fallbackData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        pageCount: Math.ceil(parseInt(data?.totalCount) / parseInt(pagination.pageSize)) || 1,
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
        <>
            <MainCard content={false}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onFilterChange={(value) => setGlobalFilter(String(value))}
                        placeholder={`Villa adı`}
                    />
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Button variant="contained" startIcon={<Add />} onClick={() => { navigate("/facilities/villas-add"); }} size="large">
                            Villa Ekle
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
                                                navigate(`/facilities/villas-show/summary/${row.original.id}`)
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
        </>
    );
}
// ==============================|| CUSTOMER LIST ||============================== //

export default function VillasList() {
    const theme = useTheme();
    const navigate = useNavigate()

    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [customerDeleteId, setCustomerDeleteId] = useState('');
    const [isDeleted, setIsDeleted] = useState(false)
    const [villaModalDelete, setVillaModalDelete] = useState(false);

    const [villaSelectModal, setVillaSelectModal] = useState(false)
    const [selectedVillaDetail, setSelectedVillaDetail] = useState('')

    const [villaUpdateModal, setVillaUpdateModal] = useState(false)

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        VillaServices.Villas(pagination.pageIndex, pagination.pageSize, globalFilter, sorting[0]?.id === 'villaName' ? sorting[0]?.desc : null, sorting[0]?.id === 'onlineReservation' ? sorting[0]?.desc : null, sorting[0]?.id === 'person' ? sorting[0]?.desc : null).then((res) => { setData(res); setLoading(false); });

    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter]);

    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter])

    useEffect(() => {
        if (isDeleted) {
            setIsDeleted(false)
            setLoading(true)
            VillaServices.Villas(pagination.pageIndex, pagination.pageSize, globalFilter, sorting[0]?.id === 'villaName' ? sorting[0]?.desc : null, sorting[0]?.id === 'onlineReservation' ? sorting[0]?.desc : null, sorting[0]?.id === 'person' ? sorting[0]?.desc : null).then((res) => { setData(res); setLoading(false); });
        }
    }, [isDeleted])

    const handleClose = () => {
        setVillaModalDelete(!villaModalDelete);
    };

    const columns = useMemo(
        () => [
            {
                header: 'Villa Adı',
                accessorKey: 'villaName',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            alt="Avatar"
                            size="sm"
                            src={getImageUrl(`avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`, ImagePath.USERS)}
                        />
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{row.original.villaDetails[0].name}</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'Bölge',
                cell: ({ row }) => { return `${row?.original?.town?.district?.city?.name} / ${row?.original?.town?.name}` }
            },
            {
                header: 'Kapasite',
                accessorKey: 'person',
                cell: ({ row }) => { return row.original.person }
            },
            {
                header: 'Online Rez.',
                accessorKey: 'onlineReservation',
                cell: (cell) => {
                    if (cell.getValue()) return <Chip color="success" label="Aktif" size="small" variant="light" />;
                    else return <Chip color="error" label="Pasif" size="small" variant="light" />;
                    // switch (cell.getValue()) {
                    //     case 3:
                    //         return <Chip color="error" label="Rejected" size="small" variant="light" />;
                    //     case 1:
                    //         return <Chip color="success" label="Verified" size="small" variant="light" />;
                    //     case 2:
                    //     default:
                    //         return <Chip color="info" label="Pending" size="small" variant="light" />;
                    // }
                }
            },
            {
                header: 'Durum',
                cell: ({ row }) => {
                    if (row.original.generalStatusType === 1) return <Chip color="success" label="Aktif" size="small" variant="light" />;
                    else return <Chip color="error" label="Pasif" size="small" variant="light" />;
                }
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
                            <Tooltip title="View">
                                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                                    {collapseIcon}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <IconButton
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCustomerDeleteId(row.original.id)
                                        setSelectedVillaDetail(row.original);
                                        setVillaSelectModal(true)
                                        // setCustomerDeleteId(row)
                                        // navigate(`/facilities/villas-update/${row.original.id}`)
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Delete">
                                <IconButton
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClose();
                                        setCustomerDeleteId(Number(row.original.id));
                                    }}
                                >
                                    <Trash />
                                </IconButton>
                            </Tooltip> */}
                        </Stack>
                    );
                }
            }
        ], // eslint-disable-next-line
        [theme]
    );
    let breadcrumbLinks = [{ title: 'Villa Yönetimi' }, { title: 'Villa Listesi', to: `/facilities/villas-list` }];

    if (loading) return (<Loader open={loading} />)

    return (
        <>
            <Breadcrumbs custom links={breadcrumbLinks} />
            <ReactTable
                {...{
                    data,
                    columns,
                    pagination,
                    setPagination,
                    setSorting,
                    sorting,
                    globalFilter,
                    setGlobalFilter
                }}
            />
            <VillaModalDelete setIsDeleted={setIsDeleted} setLoading={setLoading} id={Number(customerDeleteId)} title={customerDeleteId} open={villaModalDelete} handleClose={handleClose} />
            <VillaSelectModal villaDetailModal={setVillaUpdateModal} navigate={navigate} title={selectedVillaDetail} open={villaSelectModal} handleClose={() => setVillaSelectModal(false)} id={customerDeleteId} />
            <VillaDetailUpdateModal selectedUpdateItem={selectedVillaDetail} setIsAdded={setIsDeleted} open={villaUpdateModal} modalToggler={setVillaUpdateModal} />
        </>
    );
}