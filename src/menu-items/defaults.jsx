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


const defaults = {
  id: 'default-group-title',
  title: <FormattedMessage id="default-group-title" />,
  type: 'group',
  children: [
    {
      id: 'default-page-title',
      title: <FormattedMessage id="default-page-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/default'
    }
  ]
};

export default defaults;
