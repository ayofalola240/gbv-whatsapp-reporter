/**
 * @file Manages all application text and translations.
 */

// Define the structure for a single translatable string.
type TranslationSet = Record<string, string>;

// Define the structure for the entire translation object.
// This ensures every translation key is available for every language.
type Translations = Record<string, TranslationSet>;

// The language type, can be expanded with more languages.
export type Language = 'English' | 'Yoruba' | 'Igbo' | 'Hausa';

/**
 * All application translations.
 * Each key maps to an object containing translations for that key in various languages.
 */
export const translations: Translations = {
  // --- Welcome & Language ---
  // in ./config/translation.ts

  prompt_welcome: {
    English:
      "Welcome to the FCTA GBV Reporting Center. Please select your language.\n\nTip: You can type 'Restart' at any time to begin again.",
    Yoruba: "Ẹ ku abọ si Ile-iṣẹ Iroyin GBV ti FCTA. Jọwọ yan èdè rẹ.\n\nÌmọ̀ràn: O le tẹ 'Restart' nígbàkúgbà láti bẹ̀rẹ̀ lẹ́ẹ̀kansí.",
    Igbo: "Nnọọ na FCTA GBV Reporting Center. Biko họrọ asụsụ gị.\n\nNdụmọdụ: Ị nwere ike pịnye 'Restart' n'oge ọ bụla iji malite ọzọ.",
    Hausa:
      "Barka da zuwa Cibiyar Rahoto ta GBV ta FCTA. Don Allah zaɓi harshenka.\n\nShawara: Kuna iya rubuta 'Restart' a kowane lokaci don farawa."
  },
  confirmation_language_set: {
    English: 'Language set to {0}.',
    Yoruba: 'Èdè ti yí padà sí {0}.',
    Igbo: 'Atọọla asụsụ na {0}.',
    Hausa: 'An saita harshe zuwa {0}.'
  },

  // --- Anonymity & Identity ---
  prompt_anonymity: {
    English: 'Would you like to remain anonymous or share your details with us?',
    Yoruba: 'Ṣe o fẹ lati wa ni ailorukọ tabi pin awọn alaye rẹ pẹlu wa?',
    Igbo: 'Ị chọrọ ka amaghị aha gị ma ọ bụ kesaa anyị nkọwa gị?',
    Hausa: 'Kuna so ku kasance ba a san ku ba ko kuna son raba bayananku da mu?'
  },
  prompt_name: {
    English: 'Please enter your name (or nickname).',
    Yoruba: 'Jọwọ tẹ orukọ rẹ sii (tabi orukọ apeso).',
    Igbo: 'Biko tinye aha gị (ma ọ bụ aha njirimara).',
    Hausa: 'Don Allah shigar da sunanka (ko sunan laƙabi).'
  },
  prompt_phone: {
    English: "Can we have a phone number to reach you on? (Type 'skip' to decline)",
    Yoruba: "Ṣe a le ni nọmba foonu ti a le kan si ọ? (Tẹ 'fò' lati kọ)",
    Igbo: "Anyị nwere ike ịnwe nọmba ekwentị gị? (Pịa 'wụfee' iji jụ)",
    Hausa: "Za mu iya samun lambar waya? (Rubuta 'tsallake' don kin bayarwa)"
  },
  confirmation_anonymous: {
    English: "That's okay. You can report anonymously.",
    Yoruba: 'O dara. O le jabo lai sọ orukọ rẹ.',
    Igbo: 'Ọ dị mma. Ị nwere ike ịkọ akụkọ na-enweghị aha.',
    Hausa: 'Ba komai. Kuna iya bayar da rahoto ba tare da sanin sunanka ba.'
  },

  // --- Main Menu ---
  prompt_main_menu: {
    English: 'How can we help you today?',
    Yoruba: 'Báwo ni a ṣe lè ràn ọ́ lọ́wọ́ lónìí?',
    Igbo: 'Kedu ka anyị nwere ike isi nyere gị aka taa?',
    Hausa: 'Ta yaya za mu iya taimaka muku a yau?'
  },

  // --- Incident Reporting Prompts (Questions) ---
  prompt_incident_date: {
    English: 'When did this incident happen? (e.g., YYYY-MM-DD)',
    Yoruba: 'Nigba wo ni iṣẹlẹ yii ṣẹlẹ? (f.a, ODUN-OSU-OJO)',
    Igbo: 'Kedu mgbe ihe a mere? (d.o, AAAA-MM-DD)',
    Hausa: 'Yaushe wannan lamarin ya faru? (m.s, SHEKARA-WATA-RANA)'
  },
  prompt_incident_time: {
    English: 'What time of day did it happen?',
    Yoruba: 'Akoko wo ni o ṣẹlẹ ni ọjọ?',
    Igbo: 'Kedu oge n’ụbọchị ọ mere?',
    Hausa: 'Wani lokaci ne ya faru a rana?'
  },
  prompt_location_description: {
    English: 'Please describe where it happened (e.g., LGA, street, landmark).',
    Yoruba: 'Jọwọ ṣapejuwe ibi ti o ṣẹlẹ (f.a, LGA, òpópónà, àmì ilẹ̀).',
    Igbo: 'Biko kọwaa ebe ọ mere (d.o, LGA, okporo ụzọ, akara ala).',
    Hausa: 'Don Allah kwatanta inda ya faru (misali, LGA, titi, wani sanannen wuri).'
  },
  prompt_location_specific: {
    English: 'Where exactly did it happen?',
    Yoruba: 'Nibo gangan ni o ṣẹlẹ?',
    Igbo: 'Kedu ebe ọ kacha mee?',
    Hausa: 'A ina daidai ya faru?'
  },
  prompt_violence_type: {
    English: 'What type of violence was experienced?',
    Yoruba: 'Iru iwa-ipa wo ni o ni iriri?',
    Igbo: 'Kedu ụdị ime ihe ike ị nwetara?',
    Hausa: 'Wani nau’in tashin hankali ne aka ji?'
  },
  prompt_perpetrator_known: {
    English: 'Do you know the perpetrator(s)?',
    Yoruba: 'Ṣe o mọ ẹni (awọn) ti o ṣe e?',
    Igbo: 'Ị maara onye (ndị) mere ya?',
    Hausa: 'Kun san mai (masu) aikata laifi?'
  },
  prompt_perpetrator_relationship: {
    English: 'What is your relationship to them?',
    Yoruba: 'Kini ibatan rẹ si wọn?',
    Igbo: 'Kedu mmekọrịta gị na ha?',
    Hausa: 'Menene alaƙar ku da su?'
  },
  prompt_perpetrator_count: {
    English: 'How many perpetrators were involved?',
    Yoruba: 'Melo ni awọn oluṣebi ti o kopa?',
    Igbo: 'Ole ndị mere ihe a sonyere?',
    Hausa: 'Masu aikata laifi nawa ne suka shiga?'
  },
  prompt_incident_description: {
    English: 'Please tell us briefly what happened.',
    Yoruba: 'Jọwọ sọ fun wa ni ṣoki ohun ti o ṣẹlẹ.',
    Igbo: 'Biko gwa anyị nkenke ihe mere.',
    Hausa: 'Don Allah gaya mana a takaice abin da ya faru.'
  },
  prompt_media_upload: {
    English: 'You can also upload a photo, video, or voice note as evidence.',
    Yoruba: 'O tun le gbe fọto, fídíò, tabi akọsilẹ ohun soke gẹ́gẹ́ bí ẹ̀rí.',
    Igbo: 'Ị nwekwara ike bulite foto, vidiyo, ma ọ bụ ndetu olu dịka ihe akaebe.',
    Hausa: 'Hakanan kuna iya loda hoto, bidiyo, ko bayanin murya a matsayin shaida.'
  },
  prompt_other_location: {
    English: "Please describe the 'other' location.",
    Yoruba: 'Jọ̀wọ́ ṣàpèjúwe ibòmíràn náà.',
    Igbo: "Biko kọwaa ebe 'ọzọ'.",
    Hausa: "Don Allah a kwatanta 'wata' wurin."
  },
  prompt_other_violence: {
    English: "Please specify the 'other' type of violence.",
    Yoruba: "Jọ̀wọ́ ṣàlàyé irú ìwà ipá 'òmíràn' náà.",
    Igbo: "Biko kọwapụta ụdị ime ihe ike 'ọzọ'.",
    Hausa: "Don Allah a fayyace 'wani' nau'in tashin hankali."
  },
  prompt_other_service: {
    English: "Please specify the 'other' help you need.",
    Yoruba: "Jọ̀wọ́ ṣàlàyé ìrànlọ́wọ́ 'òmíràn' tó o nílò.",
    Igbo: "Biko kọwapụta enyemaka 'ọzọ' ịchọrọ.",
    Hausa: "Don Allah a fayyace 'wani' taimakon da kuke buƙata."
  },
  prompt_select_services: {
    English: 'Please select the help you need:',
    Yoruba: 'Jọ̀wọ́ yan ìrànlọ́wọ́ tí o nílò:',
    Igbo: 'Biko họrọ enyemaka ịchọrọ:',
    Hausa: 'Don Allah zaɓi taimakon da kuke buƙata:'
  },
  message_upload_media: {
    English: 'Okay, please upload your photo, video, or voice note now.',
    Yoruba: 'Ó dara, jọ̀wọ́ gbé fótò, fídíò, tàbí ìròyìn ohùn rẹ sílẹ̀ báyìí.',
    Igbo: 'Ọ dị mma, biko bulite foto, vidiyo, ma ọ bụ ndekọ olu gị ugbu a.',
    Hausa: 'To, don Allah a loda hotonku, bidiyo, ko sakon murya yanzu.'
  },

  // --- Buttons & Options (All <= 20 chars) ---
  button_select_language: { English: 'Select Language', Yoruba: 'Yan Ede', Igbo: 'Họrọ Asụsụ', Hausa: 'Zaɓi Harshe' },
  button_select_time: { English: 'Select Time', Yoruba: 'Yan Àsìkò', Igbo: 'Họrọ Oge', Hausa: 'Zaɓi Lokaci' },
  button_select_location: { English: 'Select Location', Yoruba: 'Yan Ibi Ìṣẹ̀lẹ̀', Igbo: 'Họrọ Ebe', Hausa: 'Zaɓi Wuri' },
  button_select_violence: {
    English: 'Select Violence Type',
    Yoruba: 'Yan Irú Ìwà Ipá',
    Igbo: 'Họrọ Ụdị Ime Ihe',
    Hausa: "Zaɓi Nau'in Rikici"
  },
  button_select_relationship: { English: 'Select Relationship', Yoruba: 'Yan Ibatan', Igbo: 'Họrọ Mmekọrịta', Hausa: 'Zaɓi Dangantaka' },
  button_select_service: { English: 'Select Service', Yoruba: 'Yan Iṣẹ́ Ìrànlọ́wọ́', Igbo: 'Họrọ Ọrụ', Hausa: 'Zaɓi Sabis' },
  // in ./config/translation.ts

  // Add these keys inside your translations object
  button_choose_option: {
    English: 'Choose an option',
    Yoruba: 'Yan àṣàyàn kan',
    Igbo: 'Họrọ nhọrọ',
    Hausa: 'Zaɓi wani zaɓi'
  },
  option_start_over: {
    English: 'Start Over',
    Yoruba: 'Bẹ̀rẹ̀ Lẹ́ẹ̀kansí',
    Igbo: 'Malite Ọzọ',
    Hausa: 'Fara Daga Farko'
  },
  option_report_incident: { English: 'Report Incident', Yoruba: 'Ìròyìn Ìṣẹ̀lẹ̀', Igbo: 'Kọọ Ihe Mere', Hausa: 'Bayar da Rahoto' },
  option_request_help: { English: 'Request Help', Yoruba: 'Beere fún Ìrànlọ́wọ́', Igbo: 'Rịọ Enyemaka', Hausa: 'Nemi Taimako' },
  option_check_status: {
    English: 'Check Report Status',
    Yoruba: 'Ṣayẹwo Ipò Ìròyìn',
    Igbo: 'Lelee Ọnọdụ Akụkọ',
    Hausa: 'Duba Matsayin Rahoto'
  },
  option_remain_anonymous: { English: 'Remain Anonymous', Yoruba: 'Má Sọ Orúkọ Mi', Igbo: 'Amaghị Aha', Hausa: 'Kasance Ba a San Ka' },
  option_share_details: { English: 'Share My Details', Yoruba: 'Pin Àlàyé Mi', Igbo: 'Kọwaa Nkọwa M', Hausa: 'Raba Bayanaina' },
  option_yes: { English: 'Yes', Yoruba: 'Bẹ́ẹ̀ ni', Igbo: 'Ee', Hausa: 'Eh' },
  option_no: { English: 'No', Yoruba: 'Bẹ́ẹ̀ kọ́', Igbo: 'Mba', Hausa: "A'a" },
  option_send_now: { English: 'Send Now', Yoruba: 'Firanṣẹ Nísisìyí', Igbo: 'Zipu Ugbu a', Hausa: 'Aika Yanzu' },
  option_skip: { English: 'Skip for now', Yoruba: 'Fò fún ìsinsìnyí', Igbo: 'Wụfee ugbu a', Hausa: 'Tsallake yanzu' },
  option_yes_consent: { English: 'Yes, I consent', Yoruba: 'Bẹ́ẹ̀ ni, mo gbà', Igbo: 'Ee, ekwenyere m', Hausa: 'Eh, na yarda' },
  option_no_consent: { English: 'No, I do not', Yoruba: 'Bẹ́ẹ̀ kọ́, n kò gbà', Igbo: 'Mba, ekweghị m', Hausa: "A'a, ban yarda ba" },

  // --- List Sections & Rows (Row titles <= 24 chars) ---
  section_main_menu: {
    English: 'Main Menu',
    Yoruba: 'Àtòjọ Àkọ́kọ́',
    Igbo: 'Nchịkọta Nhọrọ',
    Hausa: 'Babban Menu'
  },
  section_languages: { English: 'Available Languages', Yoruba: 'Àwọn Èdè Tó Wà', Igbo: 'Asụsụ Dị', Hausa: 'Harsunan da ke Akwai' },
  section_time_of_day: { English: 'Time of Day', Yoruba: 'Àsìkò Ọjọ́', Igbo: 'Oge Ụbọchị', Hausa: 'Lokacin Rana' },
  section_violence_types: {
    English: 'Types of Violence',
    Yoruba: 'Àwọn Irú Ìwà Ipá',
    Igbo: 'Ụdị Ime Ihe Ike',
    Hausa: "Nau'o'in Rikici"
  },
  section_relationship_types: {
    English: 'Perpetrator Relationship',
    Yoruba: 'Ibatan sí Olùṣebi',
    Igbo: 'Mmekọrịta Onye Mere Ya',
    Hausa: 'Dangantaka da Mai Laifi'
  },
  section_support_services: {
    English: 'Available Support',
    Yoruba: 'Ìrànlọ́wọ́ Tó Wà',
    Igbo: 'Nkwado Dị',
    Hausa: 'Taimakon da ke Akwai'
  },
  option_morning: { English: 'Morning', Yoruba: 'Òwúrọ̀', Igbo: 'Ụtụtụ', Hausa: 'Safe' },
  option_afternoon: { English: 'Afternoon', Yoruba: 'Ọ̀sán', Igbo: 'Ehihie', Hausa: 'Rana' },
  option_evening: { English: 'Evening', Yoruba: 'Alẹ́', Igbo: 'Mgbede', Hausa: 'Maraice' },
  option_night: { English: 'Night', Yoruba: 'Òru', Igbo: 'Abalị', Hausa: 'Dare' },
  option_not_sure: { English: 'Not Sure', Yoruba: 'Mi ò dájú', Igbo: "Ejighị m n'aka", Hausa: 'Ban Tabbata ba' },
  section_location_types: { English: 'Location Types', Yoruba: 'Irú Àwọn Ibi', Igbo: 'Ụdị Ebe', Hausa: "Nau'o'in Wuri" },
  option_home: { English: 'Home', Yoruba: 'Ilé', Igbo: 'Ụlọ', Hausa: 'Gida' },
  option_school: { English: 'School', Yoruba: 'Ilé-ìwé', Igbo: 'Ụlọ akwụkwọ', Hausa: 'Makarantar' },
  option_workplace: { English: 'Workplace', Yoruba: 'Ibi Iṣẹ́', Igbo: 'Ebe ọrụ', Hausa: 'Wurin Aiki' },
  option_street_road: { English: 'Street or Road', Yoruba: 'Òpópónà tàbí Ọ̀nà', Igbo: 'Okporo ụzọ', Hausa: 'Titi ko Hanyar' },
  option_perpetrators_house: {
    English: "Perpetrator's house",
    Yoruba: 'Ilé olùṣebi',
    Igbo: 'Ụlọ onye mere ya',
    Hausa: 'Gidan wanda ya aikata'
  },
  option_other: { English: 'Other', Yoruba: 'Òmíràn', Igbo: 'Ọzọ', Hausa: 'Wani' },
  // ... continue for other lists like violence types, relationships, services

  // --- Consent & Submission ---
  prompt_consent: {
    English: 'Do you consent for us to share this report with authorized support services?',
    Yoruba: 'Ṣé o gbà fún wa láti pín ìròyìn yìí pẹ̀lú àwọn ilé-iṣẹ́ ìrànlọ́wọ́?',
    Igbo: 'Ị kwenyere ka anyị kesaa akụkọ a na ọrụ nkwado enyere ikike?',
    Hausa: 'Ka amince mu raba wannan rahoto ga hukumomin tallafi masu izini?'
  },
  prompt_consent_direct_service: {
    English: 'To connect you with services, we need your consent to share your details.',
    Yoruba: 'Láti so ọ́ pọ̀, a nílò ìyọǹda rẹ láti pín àlàyé rẹ.',
    Igbo: 'Iji jikọọ gị na ọrụ, anyị chọrọ nkwenye gị iji kesaa nkọwa gị.',
    Hausa: 'Don haɗa ku da sabis, muna buƙatar izinin ku don raba bayananku.'
  },
  prompt_need_support_incident: {
    English: 'Would you like support or help for this incident?',
    Yoruba: 'Ṣe o fẹ́ àtìlẹyìn tàbí ìrànlọ́wọ́ fún ìṣẹ̀lẹ̀ yìí?',
    Igbo: 'Ị chọrọ nkwado ma ọ bụ enyemaka maka ihe omume a?',
    Hausa: 'Kuna son tallafi ko taimako game da wannan lamarin?'
  },
  message_report_submitted: {
    English: 'Thank you. Your report has been submitted. Your Reference ID is: {0}.',
    Yoruba: 'A dúpẹ́. A ti gba ìròyìn yín. Nọ́mbà àmì rẹ ni: {0}.',
    Igbo: 'Daalụ. Edonyela akụkọ gị. ID ntụaka gị bụ: {0}.',
    Hausa: 'Na gode. An gabatar da rahoton ku. ID ɗin ku shine: {0}.'
  },
  message_escalation: {
    English: 'We will escalate this to the appropriate agency. Someone may contact you.',
    Yoruba: 'A yóò gbé e lọ sí ọ̀dọ̀ àjọ tó yẹ. Wọn lè kàn sí yín.',
    Igbo: 'Anyị ga-ebuga nke a. Onye nwere ike ịkpọtụrụ gị.',
    Hausa: 'Za mu mika wannan ga hukumar da ta dace. Wani na iya tuntubar ku.'
  },
  message_service_connection: {
    English: 'We will connect you with the appropriate service provider shortly.',
    Yoruba: 'A yóò so ọ́ pọ̀ mọ́ olùpèsè iṣẹ́ tó yẹ láìpẹ́.',
    Igbo: "Anyị ga-ejikọ gị na onye na-enye ọrụ kwesịrị ekwesị n'oge na-adịghị anya.",
    Hausa: 'Za mu haɗa ku da mai bada sabis da ya dace nan ba da jimawa ba.'
  },
  message_consent_refused: {
    English: 'We understand. Without consent, we cannot proceed. You can come back anytime.',
    Yoruba: 'A yé wa. Láìsí ìyọǹda, a kò lè tẹ̀síwájú. O lè padà wá nígbàkúgbà.',
    Igbo: "Anyị ghọtara. Na-enweghị nkwenye, anyị enweghị ike ịga n'ihu.",
    Hausa: 'Mun fahimta. Ba tare da izini ba, ba za mu iya ci gaba ba. Kuna iya dawowa.'
  },

  // --- Status & Follow-up ---
  prompt_follow_up: {
    English: 'Would you like to receive periodic updates on your report?',
    Yoruba: 'Ṣé o fẹ́ máa gba ìsọfúnni lórí ìròyìn rẹ?',
    Igbo: 'Ị ga-achọ ịnata mmelite oge ụfọdụ na akụkọ gị?',
    Hausa: 'Kuna so ku sami sabuntawa na lokaci-lokaci akan rahoton ku?'
  },
  confirmation_follow_up: {
    English: 'Okay, we will send you periodic updates.',
    Yoruba: 'Ó dára, a yóò máa fi ìsọfúnni ránṣẹ́ sí ọ.',
    Igbo: 'Ọ dị mma, anyị ga-ezitere gị mmelite oge ụfọdụ.',
    Hausa: 'To, za mu aiko muku da sabuntawa na lokaci-lokaci.'
  },
  message_no_follow_up: {
    English: 'Alright. You can check the status anytime using your reference ID.',
    Yoruba: 'Ó dára. O lè ṣayẹwo ipò rẹ̀ nígbàkúgbà pẹ̀lú àmì ìdánimọ̀ rẹ.',
    Igbo: 'Ọ dị mma. Ị nwere ike ịlele ọkwa oge ọ bụla site na iji ID gị.',
    Hausa: 'Lafiya. Kuna iya duba matsayin kowane lokaci ta amfani da ID ɗin ku.'
  },
  prompt_enter_reference_id: {
    English: 'Please provide your Report Reference ID.',
    Yoruba: 'Jọ̀wọ́ pèsè Àmì Ìdánimọ̀ Ìròyìn rẹ.',
    Igbo: 'Biko nye ID ntụaka akụkọ gị.',
    Hausa: 'Da fatan za a ba da ID na Rahoton ku.'
  },
  message_status_check: {
    English: 'Checking status for Report ID: {0}. We will provide an update shortly.',
    Yoruba: 'A ń ṣayẹwo ipò fún ID Ìròyìn: {0}. A yóò pèsè àlàyé láìpẹ́.',
    Igbo: "Na-elele ọkwa maka ID Akụkọ: {0}. Anyị ga-enye mmelite n'oge adịghị anya.",
    Hausa: 'Duba matsayin ID na Rahoto: {0}. Za mu samar da sabuntawa nan ba da jimawa ba.'
  }
};

/**
 * Retrieves a translated string for a given key and language.
 * Falls back to English if the specified language is not found.
 * @param key The key of the translation string to retrieve.
 * @param lang The desired language. Defaults to 'English'.
 * @param args An array of strings to replace placeholders like {0}, {1}, etc.
 * @returns The translated and formatted string.
 */
export const t = (key: string, lang: Language = 'English', ...args: string[]): string => {
  const effectiveLang = lang || 'English';
  const translation = translations[key]?.[effectiveLang] || translations[key]?.['English'];

  if (!translation) {
    return `Untranslated: ${key}`;
  }

  // Replace placeholders like {0}, {1} with arguments
  return args.reduce((acc, arg, index) => acc.replace(`{${index}}`, arg), translation);
};
