import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';

// project imports
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import { useGetCustomer } from 'api/customer';
import FormBlogUpdate from './FormBlogUpdate';
import FormSssUpdate from './FormSssUpdate';

// ==============================|| CUSTOMER ADD / EDIT ||============================== //

export default function SssUpdateModal({ open, modalToggler, setIsAdded, selectedUpdateItem }) {


  const closeModal = () => modalToggler(false);



  return (
    <>
      {open && (
        <Modal
          open={open}
          onClose={closeModal}
          aria-labelledby="modal-customer-add-label"
          aria-describedby="modal-customer-add-description"
          sx={{ '& .MuiPaper-root:focus': { outline: 'none' } }}
        >
          <MainCard
            sx={{ width: `calc(100% - 48px)`, minWidth: 340, maxWidth: 880, height: 'auto', maxHeight: 'calc(100vh - 48px)' }}
            modal
            content={false}
          >
            <SimpleBar sx={{ maxHeight: `calc(100vh - 48px)`, '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
              <FormSssUpdate selectedItem={selectedUpdateItem} setIsAdded={setIsAdded} closeModal={closeModal} />
            </SimpleBar>
          </MainCard>
        </Modal>
      )}
    </>
  );
}


