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



const websiteConfig = {
  id: 'website-group-pages',
  title: <FormattedMessage id="website-group-pages" />,
  type: 'group',
  children: [

    {
      id: 'settings-blog-list',
      title: <FormattedMessage id="settings-blog-list" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/website-management/blogs'
    },
    {
      id: 'settings-region-list',
      title: <FormattedMessage id="settings-region-list" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/website-management/regions'
    },
    {
      id: 'settings-activities-list',
      title: <FormattedMessage id="settings-activities-list" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/website-management/activities'
    },
    {
      id: 'static-content-list',
      title: <FormattedMessage id="static-content-list" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/website-management/static-contents'
    },
    {
      id: 'sss-list',
      title: <FormattedMessage id="sss-list" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/website-management/sss'
    }
  ]
};

export default websiteConfig;
