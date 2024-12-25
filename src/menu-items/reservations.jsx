// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { I24Support, MessageProgramming } from 'iconsax-react';

// type

// icons
// icons
const icons = {
  maintenance: MessageProgramming,
  contactus: I24Support
};


const reservations = {
  id: 'reservations-group-title',
  title: <FormattedMessage id="reservations-group-title" />,
  type: 'group',
  children: [
    {
      id: 'reservations-list-title',
      title: <FormattedMessage id="reservations-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/reservations/list'
    },
    // {
    //   id: 'reservations-add-title',
    //   title: <FormattedMessage id="reservations-add-title" />,
    //   type: 'item',
    //   icon: icons.maintenance,
    //   url: '/reservations/add'
    // }
  ]
};

export default reservations;
