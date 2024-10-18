// src/i18n.ts
import { createI18n } from 'vue-i18n'

// Define your translations
const messages = {
  en: {
    '501-do': '501 D.O.',
    'are-you-sure': 'Are you sure you want to continue?',
    back: 'Back',
    cancel: 'Cancel',
    captain: 'Captain',
    'captain-required': 'Captain is required',
    'captains-should-be-different': 'Captains should be different',
    'confirm-new-match': 'Both captains must agree with the rosters and the match',
    'confirm-new-match-guest-captain': 'Captain of the guest team has seen the rosters and agrees with the match',
    'confirm-new-match-home-captain': 'Captain of the home team has seen the rosters and agrees with the match',
    consent: 'Consent',
    'create-match': 'Create match',
    cricket: 'Cricket',
    'date-and-time-of-match': 'Date and time of the match',
    'game-no': 'Game #',
    'guest-team': 'Guest team',
    'guest-team-less-players': 'Guest team has less than 4 players',
    'guest-team-required': 'Guest team is required',
    home: 'Home',
    'home-team': 'Home team name',
    'home-team-less-players': 'Home team has less than 4 players',
    'home-team-required': 'Home team is required',
    'match-place': 'Place of the match',
    'match-place-required': 'Place of the match is required',
    'new-match': 'New match',
    ok: 'OK',
    'player-required': 'Player is required',
    'player-selected-multiple-times': 'Player selected multiple times',
    'return-and-edit': 'By clicking this button, you will return to the previous step and you can edit the data you entered.',
    select: 'Select',
    'team-name': 'Team name',
    warning: 'Warning',
  },
  sk: {
    '501-do': '501 D.O.',
    'are-you-sure': 'Ste si istý, že chcete pokračovať?',
    back: 'Späť',
    cancel: 'Zrušiť',
    captain: 'Kapitán',
    'captain-required': 'Vyberte kapitána',
    'captains-should-be-different': 'Kapitáni by mali byť rôzni',
    'confirm-new-match': 'Obaja kapitáni musia súhlasiť so zostavami a zápasom',
    'confirm-new-match-guest-captain': 'Kapitán hosťujúceho tímu si overil zostavy a súhlasí so zápasom',
    'confirm-new-match-home-captain': 'Kapitán domáceho tímu si overil zostavy a súhlasí so zápasom',
    consent: 'Súhlas',
    'create-match': 'Vytvoriť zápas',
    cricket: 'Cricket',
    'date-and-time-of-match': 'Dátum a čas zápasu',
    'game-no': 'Hra č.',
    'guest-team': 'Hosťujúci tím',
    'guest-team-less-players': 'Hosťujúci tím má menej ako 4 hráčov',
    'guest-team-required': 'Vyberte hosťujúci tím',
    home: 'Domov',
    'home-team': 'Domáci tím',
    'home-team-less-players': 'Domáci tím má menej ako 4 hráčov',
    'home-team-required': 'Vyberte domáci tím',
    'match-place': 'Miesto zápasu',
    'match-place-required': 'Vyberte miesto zápasu',
    'new-match': 'Nový zápas',
    'no-#': 'č.',
    ok: 'OK',
    'player-required': 'Vyberte hráča',
    'player-selected-multiple-times': 'Hráč je vybraný viackrát',
    'return-and-edit': 'Kliknutím na tento tlačidlo sa vrátite na predchádzajúci krok a môžete upraviť zadané údaje.',
    select: 'Vybrať',
    'team-name': 'Názov tímu',
    warning: 'Upozornenie',
  },
  // Add more languages here
}

const i18n = createI18n({
  locale: 'sk', // Set default locale
  fallbackLocale: 'sk', // Set fallback locale
  messages,
})

export default i18n
