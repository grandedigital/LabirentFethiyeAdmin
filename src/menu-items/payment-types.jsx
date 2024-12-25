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


const paymentTypes = {
  id: 'payment-types-group-title',
  title: <FormattedMessage id="payment-types-group-title" />,
  type: 'group',
  children: [
    {
      id: 'payment-types-list-title',
      title: <FormattedMessage id="payment-types-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/payment-types'
    }
  ]
};

export default paymentTypes;
