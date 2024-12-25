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


const settings = {
  id: 'group-pages',
  title: <FormattedMessage id="settings-menu-title" />,
  type: 'group',
  children: [
    {
      id: 'settings-menu-general-title',
      title: <FormattedMessage id="settings-menu-general-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/settings/general-settings'
    },
    {
      id: 'setting-menu-user-title',
      title: <FormattedMessage id="setting-menu-user-title" />,
      type: 'collapse',
      icon: icons.contactus,
      children: [
        {
          id: 'settings-menu-user-list',
          title: <FormattedMessage id="settings-menu-user-list" />,
          type: 'item',
          url: '/settings/user-list'
        }
      ]
    }
  ]
};

export default settings;
