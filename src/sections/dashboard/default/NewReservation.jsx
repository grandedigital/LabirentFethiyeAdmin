import { useNavigate } from 'react-router-dom';

// material-ui
import { Grid, List, ListItemButton, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';

// =========================|| DATA WIDGET - ADD NEW TASK ||========================= //
import { ReservationServices } from 'services';
import { useEffect, useState } from 'react';

const NewReservation = () => {
  let separator = '-';
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let dateNow = `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date < 10 ? `0${date}` : `${date}`}`;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(() => []);

  useEffect(() => {
    ReservationServices.GetNewReservations().then((res) => {
      setData(res.data);
      console.log('res => ', res.data);
    })
  }, [])

console.log(data);

  //
  return (
    <MainCard title="Onay Bekleyen Rezervasyonlar">
      <Grid container spacing={1.5}>
        <Grid item xs={12}>
          <List>
            {loading && <CircularProgress />}
            {data &&
              data?.map((row, index) => (
                <ListItemButton key={index} onClick={() => navigate('/reservations/show/summary/' + row.id)}>
                  <ListItemIcon>
                    <Dot color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      (row.attributes.villa.data !== null ? row.attributes.villa.data.attributes.name : row.attributes.room.data.attributes.name)
                       +
                      ' - ' +
                      row.attributes.reservation_infos.data[0].attributes.name +
                      ' ' +
                      row.attributes.reservation_infos.data[0].attributes.surname +
                      ' - ' + row.attributes.reservationNumber
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

export default NewReservation;