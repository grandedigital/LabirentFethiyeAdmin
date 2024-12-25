// react
import { useState, useEffect } from 'react';

// material-ui
import Typography from '@mui/material/Typography';

// project-imports
import MainCard from 'components/MainCard';
import { VillaServices } from 'services';

export default function RoleList() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   VillaServices.Villas().then((res) => { console.log(res.data); setData(res.data); setIsLoading(false) });
  // }, []);

  
  
  if (isLoading) return <h1>Loading</h1>;
  else
    return (
      <MainCard title="Role List">
        <h1>Role List</h1>
        {/* {data.map((item, index) => (
          <Typography variant="body1" key={index}>
            {item.attributes.name}
          </Typography>
        )
        )} */}
      </MainCard>
    );
}
