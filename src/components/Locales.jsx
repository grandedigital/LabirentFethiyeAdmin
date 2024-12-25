import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// third-party
import { IntlProvider } from 'react-intl';

// project-imports
import useConfig from 'hooks/useConfig';

// load locales files
const loadLocaleData = (locale) => {
  switch (locale) {
    case 'en':
      return import('utils/locales/en.json');
    case 'tr':
      return import('utils/locales/tr.json');
    default:
      return import('utils/locales/tr.json');
  }
};

// ==============================|| LOCALIZATION ||============================== //

export default function Locales({ children }) {
  const { i18n } = useConfig();

  const [messages, setMessages] = useState();

  useEffect(() => {
    loadLocaleData(i18n).then((d) => {
      setMessages(d.default);
    });
  }, [i18n]);

  return (
    <>
      {messages && (
        <IntlProvider locale={i18n} defaultLocale="tr" messages={messages}>
          {children}
        </IntlProvider>
      )}
    </>
  );
}

Locales.propTypes = { children: PropTypes.node };
