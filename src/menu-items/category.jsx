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


const category = {
  id: 'category-group-title',
  title: <FormattedMessage id="category-group-title" />,
  type: 'group',
  children: [
    {
      id: 'category-list-title',
      title: <FormattedMessage id="category-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/category'
    }
  ]
};

export default category;
