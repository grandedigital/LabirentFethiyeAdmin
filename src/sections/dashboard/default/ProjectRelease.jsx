import { useNavigate } from 'react-router-dom';

// material-ui
import { Grid, List, ListItemButton, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';
import { useEffect, useState } from 'react';
import { ReservationServices } from 'services';

// =========================|| DATA WIDGET - ADD NEW TASK ||========================= //



const ProjectRelease = () => {
  let separator = '-';
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let dateNow = `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`;

  const navigate = useNavigate();

  //const { data, isLoading } = useDailyReservationAction(dateNow);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(() => []);

  useEffect(() => {
    ReservationServices.GetDailyReservationActions().then((res) => {
      setData(res.data);
      console.log('res => ', res.data);
    })
  }, [])
  return (
    <MainCard title="Bugün Giriş ve Çıkışlar">
      <Grid container spacing={1.5}>
        <Grid item xs={12}>
          <List>
            {loading && <CircularProgress />}
            {data &&
              data.map((row, index) => (
                <ListItemButton key={index} onClick={() => navigate('/reservations/show/summary/' + row.id)}>
                  <ListItemIcon>
                    <Dot color={row.attributes.checkOut === dateNow ? 'warning' : 'success'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      (row.attributes.checkOut === dateNow ? 'ÇIKIŞ - ' : 'GİRİŞ - ') + ' ' + row.attributes.villa.data.attributes.name
                    }
                  />
                </ListItemButton>
              ))}
          </List>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ProjectRelease;
