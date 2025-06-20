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
      "Hello, you're not alone. This is the FCTA GBV Reporting Center. We're here to listen and help, no matter what you've experienced.",
    Yoruba:
      'Pẹlẹ o, o kò nìkan wà. Ibí ni Ibùdó Ìròyìn GBV ti FCTA. A wà níbí láti gbọ́ àti láti ràn ọ́ lọ́wọ́, láìka ohun tí o ti ní ìrírí rẹ̀.',
    Igbo: "Ndeewo, ịnọghị naanị gị. Nke a bụ FCTA GBV Reporting Center. Anyị nọ ebe a iji gee ntị ma nyere aka, n'agbanyeghị ihe ị gabigara.",
    Hausa: 'Sannu, ba kai kaɗai ba. Wannan Cibiyar Rahoto ta GBV ta FCTA ce. Muna nan don saurare da taimakawa, komai abin da ka fuskanta.'
  },
  prompt_language_selection: {
    English: "Please choose the language that's easiest for you to communicate in.",
    Yoruba: 'Jọ̀wọ́ yan èdè tí ó rọrùn jùlọ fún ọ láti bá sọ̀rọ̀.',
    Igbo: 'Biko họrọ asụsụ kachasị mfe iji kwurịta okwu.',
    Hausa: 'Don Allah zaɓi harshen da ya fi maka sauƙi don sadarwa.'
  },
  confirmation_language_set: {
    English: 'Language set to {0}.',
    Yoruba: 'Èdè ti yí padà sí {0}.',
    Igbo: 'Atọọla asụsụ na {0}.',
    Hausa: 'An saita harshe zuwa {0}.'
  },

  // --- Anonymity & Identity ---
  prompt_anonymity: {
    English: 'Thank you. Before we continue, would you like to share your details or remain anonymous? Whatever you choose is okay.',
    Yoruba: 'A dúpẹ́. Kí a tó tẹ̀síwájú, ṣé o fẹ́ pín àlàyé rẹ tàbí kí o wà ní ailorúkọ? Èyíkéyìí tí o bá yàn kò burú.',
    Igbo: "Daalụ. Tupu anyị aga n'ihu, ị ga-achọ ịkekọrịta nkọwa gị ka ị nọgide na-amaghị aha gị? Ihe ọ bụla ị họọrọ dị mma.",
    Hausa: 'Na gode. Kafin mu ci gaba, kuna so ku raba bayananku ko ku kasance ba a san ku ba? Duk abin da ka zaɓa yayi daidai.'
  },
  prompt_name: {
    English: 'Please tell us your name, or you can use a nickname if that feels safer.',
    Yoruba: 'Jọ̀wọ́ sọ orúkọ rẹ fún wa, tàbí o lè lo orúkọ àpèkasí bí o bá rò pé ó pèèsè ààbò tó pọ̀jù.',
    Igbo: 'Biko gwa anyị aha gị, ma ọ bụ ị nwere ike iji aha otutu ma ọ bụrụ na ọ dị nchebe karị.',
    Hausa: 'Don Allah gaya mana sunanka, ko kuma za ka iya amfani da sunan laƙabi idan hakan ya fi aminci.'
  },
  prompt_phone: {
    English: "Can we have a phone number in case we need to reach you to support you? You can type 'skip' if you prefer not to share.",
    Yoruba: "A le gba nọ́mbà fóònù kan bí a bá nílò láti kàn sí ọ láti ràn ọ́ lọ́wọ́? O lè tẹ 'fò' bí o kò bá fẹ́ pín in.",
    Igbo: "Anyị nwere ike ịnwe nọmba ekwentị ma ọ bụrụ na anyị chọrọ iru gị iji kwado gị? Ị nwere ike pịnye 'wụfee' ma ọ bụrụ na ịchọghị ịkọrọ.",
    Hausa: "Za mu iya samun lambar waya idan muna buƙatar tuntuɓar ku don tallafa muku? Kuna iya rubuta 'tsallake' idan ba kwa son rabawa."
  },
  confirmation_anonymous: {
    English: "Okay, your privacy is respected. You don't need to share any personal details unless you want to.",
    Yoruba: 'Ó dára, a bọ̀wọ̀ fún àṣírí rẹ. Kò pọn dandan kí o pín àlàyé ara ẹni kankan àfi bí o bá fẹ́.',
    Igbo: 'Ọ dị mma, a na-asọpụrụ nzuzo gị. Ikwesighi ịkekọrịta nkọwa nkeonwe ọ bụla belụsọ ma ịchọrọ.',
    Hausa: 'To, an mutunta sirrinka. Ba kwa buƙatar raba kowane bayanan sirri sai dai idan kuna so.'
  },

  // --- Main Menu ---
  prompt_main_menu: {
    English: "Please choose what you'd like to do today. We're here for you.",
    Yoruba: 'Jọ̀wọ́ yan ohun tí o fẹ́ ṣe lónìí. A wà pẹ̀lú rẹ.',
    Igbo: 'Biko họrọ ihe ị ga-achọ ime taa. Anyị nọ ebe a maka gị.',
    Hausa: 'Don Allah zaɓi abin da kuke son yi a yau. Muna nan don ku.'
  },

  // --- Incident Reporting Prompts (Questions) ---
  prompt_incident_date: {
    English: 'When did this incident happen? (e.g., DD-MM-YYYY)',
    Yoruba: 'Nigba wo ni iṣẹlẹ yii ṣẹlẹ? (f.a, ODUN-OSU-OJO)',
    Igbo: 'Kedu mgbe ihe a mere? (d.o, AAAA-MM-DD)',
    Hausa: 'Yaushe wannan lamarin ya faru? (m.s, SHEKARA-WATA-RANA)'
  },
  prompt_incident_time: {
    English: 'Around what time of day did it happen?',
    Yoruba: 'Akoko wo ni o ṣẹlẹ ni ọjọ?',
    Igbo: 'Kedu oge n’ụbọchị ọ mere?',
    Hausa: 'Wani lokaci ne ya faru a rana?'
  },
  prompt_location_description: {
    English: 'Where did it happen? You can describe the area or address as best as you can.',
    Yoruba: 'Jọwọ ṣapejuwe ibi ti o ṣẹlẹ (f.a, LGA, òpópónà, àmì ilẹ̀).',
    Igbo: 'Biko kọwaa ebe ọ mere (d.o, LGA, okporo ụzọ, akara ala).',
    Hausa: 'Don Allah kwatanta inda ya faru (misali, LGA, titi, wani sanannen wuri).'
  },
  prompt_location_specific: {
    English: 'Was it in any of these places?',
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
    English: 'Do you know who did this?',
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
    English: 'How many people were involved?',
    Yoruba: 'Melo ni awọn oluṣebi ti o kopa?',
    Igbo: 'Ole ndị mere ihe a sonyere?',
    Hausa: 'Masu aikata laifi nawa ne suka shiga?'
  },

  prompt_incident_description: {
    English: "Please describe what happened in your own words. You can also use a voice note if that's easier for you.",
    Yoruba: 'Jọwọ sọ fun wa ni ṣoki ohun ti o ṣẹlẹ.',
    Igbo: 'Biko gwa anyị nkenke ihe mere.',
    Hausa: 'Don Allah gaya mana a takaice abin da ya faru.'
  },
  prompt_media_upload: {
    English: 'Would you like to send us a picture, video, or voice note? This is optional only if it helps.',
    Yoruba: 'O tun le gbe fọto, fídíò, tabi akọsilẹ ohun soke gẹ́gẹ́ bí ẹ̀rí.',
    Igbo: 'Ị nwekwara ike bulite foto, vidiyo, ma ọ bụ ndetu olu dịka ihe akaebe.',
    Hausa: 'Hakanan kuna iya loda hoto, bidiyo, ko bayanin murya a matsayin shaida.'
  },
  prompt_other_location: {
    English: 'Please tell us more about the location.',
    Yoruba: 'Jọ̀wọ́ ṣàpèjúwe ibòmíràn náà.',
    Igbo: "Biko kọwaa ebe 'ọzọ'.",
    Hausa: "Don Allah a kwatanta 'wata' wurin."
  },
  prompt_other_violence: {
    English: 'Please describe what happened in your own words.',
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
    English: "Please choose the type of support you'd like. You can pick more than one.",
    Yoruba: 'Jọ̀wọ́ yan ìrànlọ́wọ́ tí o nílò:',
    Igbo: 'Biko họrọ enyemaka ịchọrọ:',
    Hausa: 'Don Allah zaɓi taimakon da kuke buƙata:'
  },
  prompt_confirm_phone: {
    English: 'Are you using the same phone number for this report that we can use for contact?',
    Yoruba: 'Ṣé nọ́mbà fóònù kan náà tí ẹ fi ń ṣe ìròyìn yìí ni a lè fi kàn sí yín?',
    Igbo: 'Ị na-eji otu nọmba ekwentị maka akụkọ a nke anyị nwere ike iji kpọtụrụ gị?',
    Hausa: 'Kuna amfani da lambar waya iri ɗaya don wannan rahoto da za mu iya amfani da ita don tuntuɓar ku?'
  },
  prompt_enter_different_phone: {
    English: 'Okay, please enter the correct phone number you would like us to use for contact.',
    Yoruba: 'Ó dára, jọ̀wọ́ tẹ nọ́mbà fóònù gangan tí ẹ fẹ́ kí á máa lò fún ìbánisọ̀rọ̀.',
    Igbo: 'Ọ dị mma, biko tinye nọmba ekwentị ziri ezi ịchọrọ ka anyị jiri maka kọntaktị.',
    Hausa: 'To, don Allah shigar da lambar wayar da ta dace da kuke son mu yi amfani da ita don tuntuɓar ku.'
  },
  confirmation_phone_saved: {
    English: 'Thank you, we have saved the contact number.',
    Yoruba: 'A dúpẹ́, a ti fi nọ́mbà ìbánisọ̀rọ̀ náà pamọ́.',
    Igbo: 'Daalụ, anyị echekwala nọmba kọntaktị ahụ.',
    Hausa: 'Na gode, mun adana lambar tuntuɓar.'
  },
  message_upload_media: {
    English: 'Okay, please upload your photo, video, or voice note now.',
    Yoruba: 'Ó dara, jọ̀wọ́ gbé fótò, fídíò, tàbí ìròyìn ohùn rẹ sílẹ̀ báyìí.',
    Igbo: 'Ọ dị mma, biko bulite foto, vidiyo, ma ọ bụ ndekọ olu gị ugbu a.',
    Hausa: 'To, don Allah a loda hotonku, bidiyo, ko sakon murya yanzu.'
  },
  // Add these keys inside the 'translations' object

  prompt_area_council: {
    English: 'Please select the Area Council where the incident occurred.',
    Yoruba: 'Jọ̀wọ́ yan Àgbègbè Ìjọba (Area Council) tí iṣẹlẹ̀ náà ti ṣẹlẹ̀.',
    Igbo: 'Biko họrọ Council mpaghara ebe ihe omume ahụ mere.',
    Hausa: 'Don Allah zaɓi Hukumar Yankin inda lamarin ya faru.'
  },
  button_select_area_council: {
    English: 'Select Area Council',
    Yoruba: 'Yan Àgbègbè Ìjọba',
    Igbo: 'Họrọ Council mpaghara',
    Hausa: 'Zaɓi Hukumar Yankin'
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
  section_area_councils: {
    English: 'Abuja Area Councils',
    Yoruba: 'Àgbègbè Ìjọba Abuja',
    Igbo: 'Ndị ọchịchị mpaghara Abuja',
    Hausa: 'Hukumomin Yankin Abuja'
  },
  option_amac: { English: 'AMAC (City Center)', Yoruba: 'AMAC (Àárín Ilẹ̀)', Igbo: 'AMAC (Ebe Obodo)', Hausa: 'AMAC (Cibiyar Birni)' },
  option_bwari: { English: 'Bwari Area Council', Yoruba: 'Bwari Area Council', Igbo: 'Bwari Area Council', Hausa: 'Bwari Area Council' },
  option_gwagwalada: {
    English: 'Gwagwalada Area Council',
    Yoruba: 'Gwagwalada Area Council',
    Igbo: 'Gwagwalada Area Council',
    Hausa: 'Gwagwalada Area Council'
  },
  option_kuje: { English: 'Kuje Area Council', Yoruba: 'Kuje Area Council', Igbo: 'Kuje Area Council', Hausa: 'Kuje Area Council' },
  option_kwali: { English: 'Kwali Area Council', Yoruba: 'Kwali Area Council', Igbo: 'Kwali Area Council', Hausa: 'Kwali Area Council' },
  option_abaji: { English: 'Abaji Area Council', Yoruba: 'Abaji Area Council', Igbo: 'Abaji Area Council', Hausa: 'Abaji Area Council' },
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
  option_violence_physical: {
    English: 'Physical Violence',
    Yoruba: 'Ìwà Ipá nípa Lílu',
    Igbo: 'Ime Ihe Ike anụ Ahụ',
    Hausa: 'Rikicin Jiki'
  },
  option_violence_sexual: {
    English: 'Sexual Violence',
    Yoruba: 'Ìwà Ipá nípa Ìbálòpọ̀',
    Igbo: 'Ime Ihe Ike Mmekọahụ',
    Hausa: "Rikicin Jima'i"
  },
  option_violence_emotional: {
    English: 'Emotional Abuse',
    Yoruba: 'Ìwà Ipá nípa Ọpọlọ',
    Igbo: 'Mmetụta Mmegbu',
    Hausa: 'Cin Zarafin Hankali'
  },
  option_violence_online: {
    English: 'Online Abuse',
    Yoruba: 'Ìwà Ipá lórí Ayélujára',
    Igbo: 'Mmegbu Ịntanetị',
    Hausa: 'Cin Zarafin Yanar Gizo'
  },
  option_violence_rape: {
    English: 'Sexual Violence/Rape',
    Yoruba: 'Ìwà Ipá nípa Ìbálòpọ̀',
    Igbo: 'Ime Ihe Ike Mmekọahụ',
    Hausa: "Rikicin Jima'i"
  },
  option_violence_forced_marriage: {
    English: 'Forced Marriage',
    Yoruba: 'Ìgbéyàwó Lóòótọ́',
    Igbo: 'Akwụkwọ Nkwado Alụmdi na Nwunye',
    Hausa: 'Auren Tilas'
  },
  button_select_violence_type: {
    English: 'Select Violence Type',
    Yoruba: 'Yan Irú Ìwà Ipá',
    Igbo: 'Họrọ Ụdị Ime Ihe Ike',
    Hausa: "Zaɓi Nau'in Rikici"
  },

  option_violence_trafficking: {
    English: 'Trafficking',
    Yoruba: 'Gbígbé Ènìyàn Sálọ',
    Igbo: 'Ịzụ Ahịa Mmadụ',
    Hausa: 'Fataucin Mutane'
  },
  option_service_medical: {
    English: 'Medical Support',
    Yoruba: 'Ìrànlọ́wọ́ Ìṣègùn',
    Igbo: 'Nkwado Ahụike',
    Hausa: 'Taimakon Likita'
  },
  option_service_psychological: {
    English: 'Psychological Support',
    Yoruba: 'Ìrànlọ́wọ́ Ọpọlọ',
    Igbo: 'Nkwado Nke Uche',
    Hausa: 'Taimakon Hankali'
  },
  option_service_counselling: {
    English: 'Counselling',
    Yoruba: 'Ìgbimọ̀ràn',
    Igbo: 'Ndụmọdụ',
    Hausa: 'Nasiha'
  },
  option_service_police: {
    English: 'Police / Security',
    Yoruba: 'Ọlọ́pàá / Ààbò',
    Igbo: 'Ndị uwe ojii / Nchekwa',
    Hausa: "'Yan Sanda / Tsaro"
  },

  option_service_legal: {
    English: 'Legal Advice',
    Yoruba: 'Ìgbimọ̀ràn Ofin',
    Igbo: 'Ndụmọdụ Gbasara Iwu',
    Hausa: "Shawarar Shari'a"
  },
  option_service_shelter: {
    English: 'Shelter / Safe Home',
    Yoruba: 'Ibùdó / Ilé Ààbò',
    Igbo: 'Ebe obibi / Ụlọ Nchekwa',
    Hausa: 'Matsuguni / Gida'
  },
  option_relationship_spouse: {
    English: 'Spouse / Partner',
    Yoruba: 'Ọkọ / Aya',
    Igbo: 'Di / Nwunye',
    Hausa: 'Miji / Mata'
  },
  option_relationship_relative: {
    English: 'Relative',
    Yoruba: 'Ìbátan',
    Igbo: 'Onye ikwu',
    Hausa: 'Dan uwa'
  },
  option_relationship_teacher: {
    English: 'Teacher',
    Yoruba: 'Olùkọ́',
    Igbo: 'Onye nkụzi',
    Hausa: 'Malami'
  },
  option_relationship_authority: {
    English: 'Police / Authority',
    Yoruba: 'Ọlọ́pàá / Aláṣẹ',
    Igbo: 'Ndị Uwe Ojii/Ọchịchị',
    Hausa: "'Yan Sanda / Hukuma"
  },
  option_relationship_stranger: {
    English: 'Stranger',
    Yoruba: 'Àjèjì',
    Igbo: 'Onye ọbịbịa',
    Hausa: 'Bako'
  },

  option_other: { English: 'Other', Yoruba: 'Òmíràn', Igbo: 'Ọzọ', Hausa: 'Wani' },
  // ... continue for other lists like violence types, relationships, services

  // --- Consent & Submission ---
  prompt_consent: {
    English:
      'Do you give your consent for us to share this information confidentially with the appropriate support organizations who can help you (like NAPTIP, NSCDC, or shelters)?',
    Yoruba:
      'Ṣé o fún wa ní ìyọǹda láti pín àlàyé yìí ní àṣírí pẹ̀lú àwọn ẹgbẹ́ ìrànlọ́wọ́ tó yẹ tí wọ́n lè ràn ọ́ lọ́wọ́ (bíi NAPTIP, NSCDC, tàbí àwọn ibùdó)?',
    Igbo: 'Ị na-enye nkwenye gị ka anyị kesaa ozi a na nzuzo nye ndị otu nkwado kwesịrị ekwesị nke nwere ike inyere gị aka (dịka NAPTIP, NSCDC, ma ọ bụ ebe nchekwa)?',
    Hausa:
      'Kuna ba da izinin ku don mu raba wannan bayanin a asirce tare da ƙungiyoyin tallafi da suka dace waɗanda za su iya taimaka muku (kamar NAPTIP, NSCDC, ko matsuguni)?'
  },
  prompt_consent_direct_service: {
    English: 'To connect you with services, we need your consent to share your details.',
    Yoruba: 'Láti so ọ́ pọ̀, a nílò ìyọǹda rẹ láti pín àlàyé rẹ.',
    Igbo: 'Iji jikọọ gị na ọrụ, anyị chọrọ nkwenye gị iji kesaa nkọwa gị.',
    Hausa: 'Don haɗa ku da sabis, muna buƙatar izinin ku don raba bayananku.'
  },
  prompt_need_support_incident: {
    English: 'Do you need any help or support right now? We can help connect you.',
    Yoruba: 'Ṣe o fẹ́ àtìlẹyìn tàbí ìrànlọ́wọ́ fún ìṣẹ̀lẹ̀ yìí?',
    Igbo: 'Ị chọrọ nkwado ma ọ bụ enyemaka maka ihe omume a?',
    Hausa: 'Kuna son tallafi ko taimako game da wannan lamarin?'
  },
  prompt_add_another_service: {
    English: 'Would you like to add another?',
    Yoruba: 'A ti fi iṣẹ́ náà kún un. Ṣé o fẹ́ yan iṣẹ́ mìíràn?',
    Igbo: 'Agbakwunyela ọrụ. Ị chọrọ ịhọrọ ọrụ ọzọ?',
    Hausa: 'An ƙara sabis. Kuna so ku zaɓi wani sabis?'
  },
  message_consent_intro: {
    English: 'Thank you for sharing this with us. We respect your story and your choices.',
    Yoruba: 'A dúpẹ́ pé o pín èyí pẹ̀lú wa. A bọ̀wọ̀ fún ìtàn rẹ àti àwọn ìpinnu rẹ.',
    Igbo: 'Daalụ maka ịkọrọ anyị nke a. Anyị na-asọpụrụ akụkọ gị na nhọrọ gị.',
    Hausa: 'Na gode da raba wannan da mu. Muna girmama labarinka da zaɓinka.'
  },
  message_report_submitted: {
    English: "Your Reference ID is: {0}. Keep this if you'd like to check back.",
    Yoruba: 'Nọ́mbà Àmì Ìdánimọ̀ rẹ ni: {0}. Pa á mọ́ bí o bá fẹ́ yẹ̀ ẹ́ wò ní ọjọ́ iwájú.',
    Igbo: 'ID ntụaka gị bụ: {0}. Debe nke a ma ọ bụrụ na ị ga-achọ ịlele azụ.',
    Hausa: 'ID ɗin Maganarku shine: {0}. Rike wannan idan kuna son dubawa.'
  },
  message_report_start: {
    English: "Take your time. Let's go through what happened, one step at a time.",
    Yoruba: 'Máa farabalẹ̀. Jẹ́ kí a gbé ohun tó ṣẹlẹ̀ yẹ̀wò ní ìṣísẹ̀-n-tẹ̀lé.',
    Igbo: "Wepụta oge gị. Ka anyị gafee ihe merenụ, otu nzọụkwụ n'otu oge.",
    Hausa: 'Ka dauki lokacinka. Mu bi abin da ya faru, mataki-mataki.'
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
    English: 'We respect your decision. We will not share your information. If you change your mind, you can start again anytime.',
    Yoruba: 'A bọ̀wọ̀ fún ìpinnu rẹ. A kò ní pín àlàyé rẹ. Bí o bá yí èrò rẹ padà, o lè bẹ̀rẹ̀ lẹ́ẹ̀kansí nígbàkúgbà.',
    Igbo: 'Anyị na-asọpụrụ mkpebi gị. Anyị agaghị ekesa ozi gị. Ọ bụrụ na ị gbanwee obi gị, ịnwere ike ịmalite ọzọ oge ọ bụla.',
    Hausa: "Muna girmama shawararku. Ba za mu raba bayananku ba. Idan kun canza ra'ayinku, kuna iya sake farawa kowane lokaci."
  },
  // --- Status & Follow-up ---
  prompt_follow_up: {
    English: 'Would you like to get updates about your case?',
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
  },
  message_restart: {
    English: "No problem. Let's start fresh. We're still here with you.",
    Yoruba: 'Kò sí ìṣòro. Jẹ́ kí a bẹ̀rẹ̀ tuntun. A ṣì wà pẹ̀lú rẹ.',
    Igbo: 'Nsogbu adịghị. Ka anyị malite ọzọ. Anyị ka nọnyeere gị.',
    Hausa: 'Babu matsala. Mu fara sabo. Har yanzu muna tare da ku.'
  },
  error_submission_failed: {
    English: "We're sorry, there was a technical problem submitting your report. Please try again in a few moments.",
    Yoruba: 'A dúpẹ́, ṣùgbọ́n ìṣòro wà nígbà tí a fẹ́ gba ìròyìn yín. Jọ̀wọ́ gbìyànjú lẹ́ẹ̀kansí.',
    Igbo: "Ndo, enwere nsogbu teknụzụ na-edozi akụkọ gị. Biko nwaa ọzọ n'obere oge.",
    Hausa: 'Yi haƙuri, an sami matsalar fasaha wajen gabatar da rahoton ku. Da fatan za a sake gwadawa anjima.'
  },
  confirmation_report_saved: {
    English: 'Thank you. We are now saving your report securely and sending it to the right agency.',
    Yoruba: 'A dúpẹ́. A ti ń fi ìròyìn rẹ pamọ́ sí ibi ààbò, a sì ti ń fi í ránṣẹ́ sí àjọ tó yẹ.',
    Igbo: 'Daalụ. Anyị na-echekwa akụkọ gị ugbu a ma na-eziga ya na ụlọ ọrụ ziri ezi.',
    Hausa: 'Na gode. Yanzu muna adana rahotonku cikin aminci kuma muna aika shi zuwa ga hukumar da ta dace.'
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
