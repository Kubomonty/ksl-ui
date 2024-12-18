import 'vue-i18n'

declare module 'vue-i18n' {
    export interface DefineLocaleMessage {
        [key: string]: string | DefineLocaleMessage;
    }
    export interface VueMessageType extends DefineLocaleMessage {}
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $t: typeof import('vue-i18n')['t'];
        $d: typeof import('vue-i18n')['d'];
    }
}
