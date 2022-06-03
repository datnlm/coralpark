import { useTranslation } from 'react-i18next';
// material
import { enUS, deDE, frFR, viVN } from '@material-ui/core/locale';

// ----------------------------------------------------------------------

const LANGS = [
  {
    label: 'Vietnamese',
    value: 'vi-Vn',
    systemValue: viVN,
    icon: '/static/icons/ic_flag_vn.svg'
  },
  {
    label: 'English',
    value: 'en-US',
    systemValue: enUS,
    icon: '/static/icons/ic_flag_en.svg'
  }
];

export default function useLocales() {
  const { i18n, t: translate } = useTranslation();
  const langStorage = localStorage.getItem('i18nextLng');
  const currentLang = LANGS.find((_lang) => _lang.value === langStorage) || LANGS[1];

  const handleChangeLanguage = (newlang: string) => {
    i18n.changeLanguage(newlang);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS
  };
}
