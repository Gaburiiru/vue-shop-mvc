import Vue from 'vue';
import VueI18n from 'vue-i18n';
import spanish from '../languages/spanish.json'

Vue.use( VueI18n );

const messages = {
    //'en-US': Object.assign( {}, english, en_dimdforms ),
    'es-ES': Object.assign( {}, spanish )
};

const locale = 'es-ES';

const i18n = new VueI18n( {
    locale: locale, // set locale
    fallbackLocale: 'es-ES',//'en-US', // set fallback locale
    messages, // set locale messages
} );

export default i18n;