import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    '2-displays': '2 displays',
    '501-do': '501 D.O.',
    'account-administration': 'Account administration',
    'account-email': 'Account email',
    'account-email-invalid': 'Account email is invalid',
    'account-email-required': 'Account email is required',
    'add-admin': 'Add admin',
    'add-player': 'Add player',
    'add-team': 'Add team',
    'admin-section': 'Admin section',
    'are-you-sure': 'Are you sure you want to continue?',
    back: 'Back',
    'back-to-previous-step': 'By clicking this button, you will return to the previous step and you can edit the data you entered.',
    cancel: 'Cancel',
    'cancel-match': 'Cancel match',
    'cancel-match-fail': 'Cancel match failed',
    'cancel-match-info': 'By clicking OK, you will cancel the match. This match will not count as part of the season.',
    'cancel-match-success': 'Cancel match succeeded',
    'cancel-team': 'Cancel team',
    'cancel-team-fail': 'Cancel team failed',
    'cancel-team-info': 'By clicking OK, you will cancel the team. This team will not be able to participate in the league anymore.',
    'cancel-team-success': 'Cancel team succeeded',
    'cancel-this-account': 'Cancel this account',
    canceled: 'Canceled',
    'canceling-match': 'Canceling match ...',
    'canceling-team': 'Canceling team ...',
    captain: 'Captain',
    'captain-required': 'Captain is required',
    'captains-should-be-different': 'Captains should be different',
    'change-password': 'Change password',
    changes: 'Changes',
    'confirm-new-match': 'Both captains must agree with the rosters and the match',
    'confirm-new-match-guest-captain': 'Captain of the guest team has seen the rosters and agrees with the match',
    'confirm-new-match-home-captain': 'Captain of the home team has seen the rosters and agrees with the match',
    consent: 'Consent',
    'contact-email': 'Contact email',
    'create-admin': 'Create admin',
    'create-match': 'Create match',
    'create-team': 'Create team',
    'creating-admin': 'Creating admin ...',
    'creating-admin-fail': 'Creating admin failed',
    'creating-team': 'Creating team ...',
    'creating-team-fail': 'Creating team failed',
    cricket: 'Cricket',
    'date-and-time-of-match': 'Date and time of the match',
    'edit-player': 'Edit player',
    'edited-players': 'Edited players',
    'el-darts': '- el. darts',
    email: 'Email',
    'email-invalid': 'Email is invalid',
    'email-is-username': 'Email will be used as username',
    'email-required': 'Email is required',
    'end-match': 'End match',
    'end-match-info': 'By clicking OK, you will end the match. Legs, score and roster changes will be saved and the match will be marked as finished.',
    'end-match-fail': 'End match failed',
    'end-match-success': 'End match succeeded',
    'ending-match': 'Ending match ...',
    'enter-results': 'Enter results',
    'filter-by-status': 'Filter by status',
    finished: 'Finished',
    'forgotten-password': 'Forgot password?',
    'game-no': 'Game #{no}',
    'guest-team': 'Guest team',
    'guest-team-less-players': 'Guest team has less than 4 players',
    'guest-team-required': 'Guest team is required',
    home: 'Home',
    'home-team': 'Home team name',
    'home-team-less-players': 'Home team has less than 4 players',
    'home-team-required': 'Home team is required',
    'in-progress': 'In progress',
    'initiate-reset-password': 'Forgotten password? You can reset it here.',
    'initiate-reset-password-info': 'By clicking OK, you will initiate the password reset process. Email will be sent to the email address with the link where you can set the new password. It may take a few minutes for the email to arrive and it might fall into the spam folder.',
    'k-s-l': 'Košická samostatná liga',
    legend: 'Legend',
    'legend-b': 'B - Points sum for the season',
    'legend-h': 'H - number of won and lost games, difference is in brackets',
    'legend-l': 'L - number of won and lost legs, difference is in brackets',
    'legend-v-p': 'V:P - Number of wins and losses, difference indicated in brackets',
    'legend-v-p-pp': 'V:P PP - Number of wins and losses in overtime, difference indicated in brackets',
    'legend-z': 'Z - Number of matches played',
    legs: 'Legs',
    'location-and-date': 'Location and date',
    'logging-in': 'Logging in ...',
    login: 'Login',
    'login-fail': 'Login failed',
    'login-success': 'Login succeeded',
    logout: 'Logout',
    'manage-team': 'Manage team',
    'match-list': 'Match list',
    'match-place': 'Place of the match',
    'match-place-required': 'Place of the match is required',
    'match-state': 'Match state',
    matches: 'Matches',
    'my-team': 'My team',
    new: 'New',
    'new-admin-creation': 'New admin creation',
    'new-admin-creation-info': 'By clicking OK, you will create a new admin. Email will be sent to the admin email with the link where the admin can set the password. It may take a few minutes for the email to arrive and it might fall into the spam folder.',
    'new-match': 'New match',
    'new-password': 'New password',
    'new-password-check': 'New password check',
    'new-players': 'New players',
    'new-team-creation': 'New team creation',
    'new-team-creation-info': 'By clicking OK, you will create a new team. Email will be sent to the team email with the link where the team can set the password. It may take a few minutes for the email to arrive and it might fall into the spam folder.',
    'no-matches-found': 'No matches found',
    ok: 'OK',
    'old-password': 'Old password',
    ot: 'OT',
    overtime: 'Overtime',
    'overtime-state': 'Overtime state',
    password: 'Password',
    'password-check': 'Password check',
    'password-required': 'Password is required',
    'passwords-must-match': 'Passwords must match',
    'player-no': 'Player #{no}',
    'player-required': 'Player is required',
    'player-selected-multiple-times': 'Player selected multiple times',
    'remove-player': 'Remove player',
    'removed-players': 'Removed players',
    'reset-changes': 'Reset changes',
    'reset-changes-info': 'By clicking OK, you will revert all changes.',
    'reset-password-fail': 'Password reset failed',
    'reset-password-info': 'You are about to reset your password.',
    'reset-password-success': 'Password reset succeeded',
    'resetting-password': 'Resetting password ...',
    'results-overview': 'Results overview',
    'return-and-edit': 'By clicking this button, you will return to the previous step and you can edit the data you entered.',
    'save-changes': 'Save changes',
    'save-changes-info': 'By clicking OK, you will save the changes.',
    'save-changes-fail': 'Save changes failed',
    'save-changes-success': 'Save changes succeeded',
    'saving-changes': 'Saving changes ...',
    score: 'Score',
    select: 'Select',
    'set-new-password': 'Set new password',
    'setting-new-password': 'Setting new password ...',
    'setting-new-password-fail': 'Setting new password failed',
    'setting-new-password-success': 'Setting new password succeeded',
    status: 'Status',
    submit: 'Submit',
    substitution: 'Substitution',
    'team-administration': 'Team administration',
    'team-doubles': 'Team doubles',
    'team-email': 'Team email',
    'team-email-invalid': 'Team email is invalid',
    'team-email-required': 'Team email is required',
    'team-list': 'Team list',
    'team-member-no': 'Team member #',
    'team-name': 'Team name',
    'team-name-required': 'Team name is required',
    username: 'Username',
    'username-not-unique': 'Username is not unique',
    'username-required': 'Username is required',
    warning: 'Warning',
    'you-need-to-login': 'You need to login to perform this action',
  },
  sk: {
    '2-displays': '2 displeje',
    '501-do': '501 D.O.',
    'account-administration': 'Správa účtu',
    'account-email': 'Email účtu',
    'account-email-invalid': 'Email účtu je neplatný',
    'account-email-required': 'Email účtu je povinný',
    'add-admin': 'Pridať admina',
    'add-player': 'Pridať hráča',
    'add-team': 'Pridať tím',
    'admin-section': 'Administrátoská sekcia',
    'are-you-sure': 'Ste si istý, že chcete pokračovať?',
    back: 'Späť',
    'back-to-previous-step': 'Kliknutím na tento tlačidlo sa vrátite na predchádzajúci krok a môžete upraviť zadané údaje.',
    cancel: 'Zrušiť',
    'cancel-match': 'Zrušiť zápas',
    'cancel-match-fail': 'Zrušenie zápasu zlyhalo',
    'cancel-match-info': 'Kliknutím na OK zrušíte zápas. Tento zápas sa nebude počítať ako súčasť sezóny.',
    'cancel-match-success': 'Zrušenie zápasu bolo úspešné',
    'cancel-team': 'Zrušiť tím',
    'cancel-team-fail': 'Zrušenie tímu zlyhalo',
    'cancel-team-info': 'Kliknutím na OK zrušíte tím. Tento tím sa viac nebude môcť zúčastňovať zápasov.',
    'cancel-team-success': 'Zrušenie tímu bolo úspešné',
    'cancel-this-account': 'Zrušiť tento účet',
    canceled: 'Zrušený',
    'canceling-match': 'Rušenie zápasu ...',
    'canceling-team': 'Rušenie tímu ...',
    captain: 'Kapitán',
    'captain-required': 'Vyberte kapitána',
    'captains-should-be-different': 'Kapitáni by mali byť rôzni',
    'change-password': 'Zmeniť heslo',
    changes: 'Zmeny',
    'confirm-new-match': 'Obaja kapitáni musia súhlasiť so zostavami a zápasom',
    'confirm-new-match-guest-captain': 'Kapitán hosťujúceho tímu si overil zostavy a súhlasí so zápasom',
    'confirm-new-match-home-captain': 'Kapitán domáceho tímu si overil zostavy a súhlasí so zápasom',
    consent: 'Súhlas',
    'contact-email': 'Kontaktný email',
    'create-admin': 'Vytvoriť admina',
    'create-match': 'Vytvoriť zápas',
    'create-team': 'Vytvoriť tím',
    'creating-admin': 'Vytváranie admina ...',
    'creating-admin-fail': 'Vytvorenie admina zlyhalo',
    'creating-team': 'Vytváranie tímu ...',
    'creating-team-fail': 'Vytvorenie tímu zlyhalo',
    cricket: 'Cricket',
    'date-and-time-of-match': 'Dátum a čas zápasu',
    'edit-player': 'Upraviť hráča',
    'edited-players': 'Upravení hráči',
    'el-darts': 'v el. šípkach',
    email: 'Email',
    'email-invalid': 'Email je neplatný',
    'email-is-username': 'Email bude použitý ako používateľské meno',
    'email-required': 'Zadajte email',
    'end-match': 'Ukončiť zápas',
    'end-match-info': 'Kliknutím na OK ukončíte zápas. Legy, skóre a zmeny zostáv budú uložené a zápas bude označený ako ukončený.',
    'end-match-fail': 'Ukončenie zápasu zlyhalo',
    'end-match-success': 'Ukončenie zápasu bolo úspešné',
    'ending-match': 'Ukončovanie zápasu ...',
    'enter-results': 'Zadať výsledky',
    'filter-by-status': 'Filtrovať podľa stavu',
    finished: 'Ukončený',
    'forgotten-password': 'Zabudli ste heslo?',
    'game-no': 'Hra č. {no}',
    'guest-team': 'Hosťujúci tím',
    'guest-team-less-players': 'Hosťujúci tím má menej ako 4 hráčov',
    'guest-team-required': 'Vyberte hosťujúci tím',
    home: 'Domov',
    'home-team': 'Domáci tím',
    'home-team-less-players': 'Domáci tím má menej ako 4 hráčov',
    'home-team-required': 'Vyberte domáci tím',
    'in-progress': 'Prebieha',
    'initiate-reset-password': 'Zabudli ste heslo? Tu ho môžete resetovať.',
    'initiate-reset-password-info': 'Kliknutím na OK spustíte proces resetovania hesla. Na uvedenú emailovú adresu bude odoslaný email s odkazom, kde si môžete nastaviť nové heslo. Môže trvať niekoľko minút, kým email dorazí a môže sa dostať do zložky spam.',
    'k-s-l': 'Košická samostatná liga',
    legend: 'Legenda',
    'legend-b': 'B - Súčet bodov za sezónu',
    'legend-h': 'H - počet vyhratých a prehratých hier, rozdiel je v zátvorkách',
    'legend-l': 'L - počet vyhratých a prehratých legov, rozdiel je v zátvorkách',
    'legend-v-p': 'V:P - Počet výhier a prehier, rozdiel je v zátvorkách',
    'legend-v-p-pp': 'V:P PP - Počet výhier a prehier v predĺžení, rozdiel je v zátvorkách',
    'legend-z': 'Z - Počet odohraných zápasov',
    legs: 'Legy',
    'location-and-date': 'Miesto a čas',
    'logging-in': 'Prihlasovanie ...',
    login: 'Prihlásiť sa',
    'login-fail': 'Prihlásenie zlyhalo',
    'login-success': 'Prihlásenie prebehlo úspešne',
    logout: 'Odhlásiť sa',
    'manage-team': 'Spravovať tím',
    'match-list': 'Zoznam zápasov',
    'match-place': 'Miesto zápasu',
    'match-place-required': 'Vyberte miesto zápasu',
    'match-state': 'Stav zápasu',
    matches: 'Zápasy',
    'my-team': 'Môj tím',
    new: 'Nový',
    'new-admin-creation': 'Vytvorenie nového admina',
    'new-admin-creation-info': 'Kliknutím na OK vytvoríte nového admina. Na email admina bude odoslaný email s odkazom, kde si admin môže nastaviť heslo. Môže trvať niekoľko minút, kým email dorazí a môže sa dostať do zložky spam.',
    'new-match': 'Nový zápas',
    'new-password': 'Nové heslo',
    'new-password-check': 'Kontrola nového hesla',
    'new-players': 'Noví hráči',
    'new-team-creation': 'Vytvorenie nového tímu',
    'new-team-creation-info': 'Kliknutím na OK vytvoríte nový tím. Na email tímu bude odoslaný email s odkazom, kde si tím môže nastaviť heslo. Môže trvať niekoľko minút, kým email dorazí a môže sa dostať do zložky spam.',
    'no-matches-found': 'Nenašli sa žiadne zápasy',
    ok: 'OK',
    'old-password': 'Staré heslo',
    ot: 'PP',
    overtime: 'Predĺženie',
    'overtime-state': 'Stav predĺženia',
    password: 'Heslo',
    'password-check': 'Kontrola hesla',
    'password-required': 'Zadajte heslo',
    'passwords-must-match': 'Heslá musia byť rovnaké',
    'player-no': 'Hráč č. {no}',
    'player-required': 'Vyberte hráča',
    'player-selected-multiple-times': 'Hráč je vybraný viackrát',
    'remove-player': 'Odobrať hráča',
    'removed-players': 'Odstránení hráči',
    'reset-changes': 'Zrušiť zmeny',
    'reset-changes-info': 'Kliknutím na OK zrušíte všetky zmeny.',
    'reset-password-fail': 'Reset hesla zlyhal',
    'reset-password-info': 'Chystáte sa zmeniť svoje heslo.',
    'reset-password-success': 'Reset hesla bol úspešný',
    'resetting-password': 'Resetovanie hesla ...',
    'results-overview': 'Prehľad výsledkov',
    'return-and-edit': 'Kliknutím na tento tlačidlo sa vrátite na predchádzajúci krok a môžete upraviť zadané údaje.',
    'save-changes': 'Uložiť zmeny',
    'save-changes-info': 'Kliknutím na OK uložíte zmeny.',
    'save-changes-fail': 'Uloženie zmien zlyhalo',
    'save-changes-success': 'Uloženie zmien bolo úspešné',
    'saving-changes': 'Ukladanie zmien ...',
    score: 'Skóre',
    select: 'Vybrať',
    'set-new-password': 'Nastaviť nové heslo',
    'setting-new-password': 'Nové heslo sa nastavuje ...',
    'setting-new-password-fail': 'Nastavenie nového hesla zlyhalo',
    'setting-new-password-success': 'Nastavenie nového hesla bolo úspešné',
    status: 'Stav',
    submit: 'Odoslať',
    substitution: 'Striedanie',
    'team-administration': 'Správa tímu',
    'team-doubles': 'Dvojhra tímov',
    'team-email': 'Email tímu',
    'team-email-invalid': 'Email tímu je neplatný',
    'team-email-required': 'Zadajte email tímu',
    'team-list': 'Zoznam tímov',
    'team-member-no': 'Člen tímu č.',
    'team-name': 'Názov tímu',
    'team-name-required': 'Zadajte názov tímu',
    username: 'Používateľské meno',
    'username-not-unique': 'Používateľské meno musí byť unikátne',
    'username-required': 'Zadajte používateľské meno',
    warning: 'Upozornenie',
    'you-need-to-login': 'Pre vykonanie tejto akcie sa musíte prihlásiť',
  },
}

const i18n = createI18n({
  locale: 'sk',
  fallbackLocale: 'sk',
  messages,
})

export default i18n
