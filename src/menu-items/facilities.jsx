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


const facilities = {
  id: 'facilities-group-title',
  title: <FormattedMessage id="facilities-group-title" />,
  type: 'group',
  children: [
    {
      id: 'facilities-villas-list-title',
      title: <FormattedMessage id="facilities-villas-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/facilities/villas-list'
    },
    {
      id: 'facilities-aparts-list-title',
      title: <FormattedMessage id="facilities-aparts-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/facilities/aparts-list'
    }
  ]
};

export default facilities;
