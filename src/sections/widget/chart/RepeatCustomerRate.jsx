import { useState } from 'react';

// material-ui
import { Chip, Menu, Stack, Typography, ListItemButton } from '@mui/material';

// project-imports
import RepeatCustomerChart from './RepeatCustomerChart';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import MoreIcon from 'components/@extended/MoreIcon';

// ==============================|| CHART - REPEAT CUSTOMER RATE ||============================== //

export default function RepeatCustomerRate() {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainCard>
      <RepeatCustomerChart />
    </MainCard>
  );
}
