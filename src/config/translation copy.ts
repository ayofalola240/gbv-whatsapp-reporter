const translations: Record<string, Record<string, string>> = {
  welcome_message: {
    English: 'Welcome to the FCTA GBV Reporting Center. Please select your language:',
    Yoruba: 'Ẹ ku abọ si Ile-iṣẹ Iroyin GBV ti FCTA. Jọwọ yan èdè rẹ:',
    Igbo: 'Nnọọ na FCTA GBV Reporting Center. Biko họrọ asụsụ gị:',
    Hausa: 'Barka da zuwa Cibiyar Rahoto ta GBV ta FCTA. Don Allah zaɓi harshenka:'
  },
  anonymity_prompt: {
    English: 'Would you like to remain anonymous or share your details with us?',
    Yoruba: 'Ṣe o fẹ lati wa ni ailorukọ tabi pin awọn alaye rẹ pẹlu wa?',
    Igbo: 'Ị chọrọ ka amaghị aha gị ma ọ bụ kesaa anyị nkọwa gị?',
    Hausa: 'Kuna so ku kasance ba a san ku ba ko kuna son raba bayananku da mu?'
  },
  remain_anonymous_option: {
    English: 'Remain Anonymous',
    Yoruba: 'Má Sọ Orúkọ Mi',
    Igbo: 'Amaghị Aha',
    Hausa: 'Kasance Ba a San Ka Ba'
  },
  share_details_option: {
    English: 'Share My Details',
    Yoruba: 'Pin Àwọn Àlàyé Mi',
    Igbo: 'Kọwaa Nkọwa M',
    Hausa: 'Raba Bayanaina'
  },
  select_language_button: {
    English: 'Select Language',
    Yoruba: 'Yan Ede',
    Igbo: 'Họrọ Asụsụ',
    Hausa: 'Zaɓi Harshe'
  },
  language_section_title: {
    English: 'Available Languages',
    Yoruba: 'Àwọn Èdè Tó Wà',
    Igbo: 'Asụsụ Dị',
    Hausa: 'Harsunan da ke Akwai'
  },
  anonymity_respected: {
    English: "That's okay. You can report anonymously.",
    Yoruba: 'O dara. O le jabo lai sọ orukọ rẹ.',
    Igbo: 'Ọ dị mma. Ị nwere ike ịkọ akụkọ na-enweghị aha.',
    Hausa: 'Ba komai. Kuna iya bayar da rahoto ba tare da sanin sunanka ba.'
  },
  ask_name: {
    English: 'Please enter your name (or nickname).',
    Yoruba: 'Jọwọ tẹ orukọ rẹ sii (tabi orukọ apeso).',
    Igbo: 'Biko tinye aha gị (ma ọ bụ aha njirimara).',
    Hausa: 'Don Allah shigar da sunanka (ko sunan laƙabi).'
  },
  ask_phone: {
    English: "Can we have a phone number we can reach you on (optional)? Type 'skip' if you prefer not to.",
    Yoruba: "Ṣe a le ni nọmba foonu ti a le kan si ọ (aṣayan)? Tẹ 'skip' ti o ba fẹ kọ.",
    Igbo: "Anyị nwere ike ịnwe nọmba ekwentị anyị ga-akpọtụrụ gị (nhọrọ)? Pịnye 'skip' ma ọ bụrụ na ị chọghị.",
    Hausa: "Za mu iya samun lambar waya da za mu iya tuntuɓar ku (na zaɓi)? Rubuta 'skip' idan ba ku so."
  },
  incident_or_help_prompt: {
    English: 'Would you like to:',
    Yoruba: 'Ṣe o fẹ lati:',
    Igbo: 'Ị chọrọ ka:',
    Hausa: 'Kuna so ku:'
  },
  ask_incident_date: {
    English: "When did this incident happen? (e.g., YYYY-MM-DD or 'yesterday')",
    Yoruba: "Nigba wo ni iṣẹlẹ yii ṣẹlẹ? (fún àpẹẹrẹ, YYYY-MM-DD tabi 'àná')",
    Igbo: "Kedu mgbe ihe a mere? (dịka, YYYY-MM-DD ma ọ bụ 'ụnyaahụ')",
    Hausa: "Yaushe wannan lamarin ya faru? (misali, YYYY-MM-DD ko 'jiya')"
  },
  ask_incident_time: {
    English: 'What time of day did it happen?',
    Yoruba: 'Akoko wo ni o ṣẹlẹ ni ọjọ?',
    Igbo: 'Kedu oge n’ụbọchị ọ mere?',
    Hausa: 'Wani lokaci ne ya faru a rana?'
  },
  ask_location_general: {
    English: 'Please describe where it happened (e.g., state, LGA, street, or any known location).',
    Yoruba: 'Jọwọ ṣapejuwe ibi ti o ṣẹlẹ (fún àpẹẹrẹ, ìpínlẹ̀, LGA, òpópónà, tabi ibikíbi tí a mọ).',
    Igbo: 'Biko kọwaa ebe ọ mere (dịka, steeti, LGA, okporo ụzọ, ma ọ bụ ebe ọ bụla a maara).',
    Hausa: 'Don Allah kwatanta inda ya faru (misali, jiha, LGA, titi, ko duk wani sanannen wuri).'
  },
  ask_location_specific: {
    English: 'Where exactly did it happen?',
    Yoruba: 'Nibo gangan ni o ṣẹlẹ?',
    Igbo: 'Kedu ebe ọ kacha mee?',
    Hausa: 'A ina daidai ya faru?'
  },
  ask_violence_type: {
    English: 'What type of violence was experienced?',
    Yoruba: 'Iru iwa-ipa wo ni o ni iriri?',
    Igbo: 'Kedu ụdị ime ihe ike ị nwetara?',
    Hausa: 'Wani nau’in tashin hankali ne aka ji?'
  },
  ask_perpetrator_known: {
    English: 'Do you know the perpetrator(s)?',
    Yoruba: 'Ṣe o mọ ẹni (tabi awọn) ti o ṣe e?',
    Igbo: 'Ị maara onye (ma ọ bụ ndị) mere ya?',
    Hausa: 'Kun san mai (ko masu) aikata laifi?'
  },
  ask_perpetrator_relationship: {
    English: 'What is your relationship to them?',
    Yoruba: 'Kini ibatan rẹ si wọn?',
    Igbo: 'Kedu mmekọrịta gị na ha?',
    Hausa: 'Menene alaƙar ku da su?'
  },
  ask_perpetrator_count: {
    English: 'How many perpetrators were involved?',
    Yoruba: 'Elo ni awọn oluṣebi ti o kopa?',
    Igbo: 'Ole ndị mere ihe a sonyere?',
    Hausa: 'Masu aikata laifi nawa ne suka shiga?'
  },
  ask_incident_description: {
    English: 'Please tell us briefly what happened.',
    Yoruba: 'Jọwọ sọ fun wa ni ṣoki ohun ti o ṣẹlẹ.',
    Igbo: 'Biko gwa anyị nkenke ihe mere.',
    Hausa: 'Don Allah gaya mana a takaice abin da ya faru.'
  },
  ask_media_upload: {
    English: 'You may also upload a photo, video, or voice note if it helps explain or show evidence.',
    Yoruba: 'O tun le gbe fọto, fídíò, tabi akọsilẹ ohun soke ti o ba ṣe iranlọwọ lati ṣalaye tabi fi ẹri han.',
    Igbo: 'Ị nwekwara ike bulite foto, vidiyo, ma ọ bụ ndetu olu ma ọ bụrụ na ọ na-enyere aka ịkọwa ma ọ bụ gosi ihe akaebe.',
    Hausa: 'Hakanan kuna iya loda hoto, bidiyo, ko bayanin murya idan yana taimakawa wajen bayani ko nuna shaida.'
  },
  ask_need_support_incident: {
    English: 'Would you like support or help for this incident?',
    Yoruba: 'Ṣe o fẹ atilẹyin tabi iranlọwọ fun iṣẹlẹ yii?',
    Igbo: 'Ị chọrọ nkwado ma ọ bụ enyemaka maka ihe omume a?',
    Hausa: 'Kuna son tallafi ko taimako ga wannan lamarin?'
  },
  select_services_prompt: {
    English: 'Please select the help you need (you can choose more than one):',
    Yoruba: 'Jọwọ yan iranlọwọ ti o nilo (o le yan ju ọkan lọ):',
    Igbo: 'Biko họrọ enyemaka ị chọrọ (ị nwere ike ịhọrọ karịa otu):',
    Hausa: 'Don Allah zaɓi taimakon da kuke buƙata (kuna iya zaɓin fiye da ɗaya):'
  },
  ask_consent: {
    English:
      "Do you give us consent to safely share this report with authorized support services (like FCTA Women's Affairs, NAPTIP, NSCDC, shelters)?",
    Yoruba:
      "Ṣe o fun wa ni igbanilaaye lati pin iroyin yii lailewu pẹlu awọn iṣẹ atilẹyin ti a fun ni aṣẹ (bii FCTA Women's Affairs, NAPTIP, NSCDC, awọn ibi aabo)?",
    Igbo: "Ị na-enye anyị ikike ka anyị kesaa akụkọ a n’enweghị nsogbu na ndị ọrụ nkwado enyere ikike (dịka FCTA Women's Affairs, NAPTIP, NSCDC, ụlọ nchekwa)?",
    Hausa:
      "Kuna ba mu izini mu raba wannan rahoto cikin aminci tare da ayyukan tallafi masu izini (kamar FCTA Women's Affairs, NAPTIP, NSCDC, matsuguni)?"
  },
  consent_refused_message: {
    English: 'We understand. Without consent, we cannot submit the report. You can come back anytime.',
    Yoruba: 'A loye. Laisi igbanilaaye, a ko le fi iroyin silẹ. O le pada wa nigbakugba.',
    Igbo: 'Anyị ghọtara. Na-enweghị ikike, anyị enweghị ike ịnyefe akụkọ ahụ. Ị nwere ike ịlaghachi oge ọ bụla.',
    Hausa: 'Mun ji. Ba tare da izini ba, ba za mu iya ƙaddamar da rahoton ba. Kuna iya dawowa kowane lokaci.'
  },
  report_submitted_success: {
    English: 'Thank you. Your report has been successfully submitted. Your Reference ID is: {0}.',
    Yoruba: 'O ṣeun. Iroyin rẹ ti fi silẹ ni aṣeyọri. ID Itọkasi rẹ ni: {0}.',
    Igbo: 'Daalụ. E nyefela akụkọ gị nke ọma. ID Ntụnye gị bụ: {0}.',
    Hausa: 'Na gode. An ƙaddamar da rahotonku cikin nasara. ID ɗin Neman ku shine: {0}.'
  },
  report_escalated_message: {
    English: 'We will escalate this to the appropriate agency, and someone may contact you shortly.',
    Yoruba: 'A yoo gbe eyi sii si ile-iṣẹ ti o yẹ, ati pe ẹnikan le kan si ọ laipẹ.',
    Igbo: 'Anyị ga-ebuli nke a gaa n’ụlọ ọrụ kwesịrị ekwesị, na onye nwere ike ịkpọtụrụ gị n’oge na-adịghị anya.',
    Hausa: 'Za mu ƙara wannan zuwa hukumar da ta dace, kuma wani na iya tuntuɓar ku nan ba da jimawa ba.'
  },
  ask_follow_up_updates: {
    English: 'Would you like to receive periodic updates on your report?',
    Yoruba: 'Ṣe o fẹ lati gba awọn imudojuiwọn igbakọọkan lori iroyin rẹ?',
    Igbo: 'Ị chọrọ ịnata mmelite oge ụfọdụ na akụkọ gị?',
    Hausa: 'Kuna so ku karɓi sabuntawa na lokaci-lokaci akan rahotonku?'
  },
  follow_up_yes_reply: {
    English: 'Okay, we will send you periodic updates.',
    Yoruba: 'O dara, a yoo fi awọn imudojuiwọn igbakọọkan ranṣẹ si ọ.',
    Igbo: 'Ọ dị mma, anyị ga-ezitere gị mmelite oge ụfọdụ.',
    Hausa: 'To, za mu aika muku da sabuntawa na lokaci-lokaci.'
  },
  follow_up_no_reply: {
    English: 'Alright. You can check the status anytime using your reference ID.',
    Yoruba: 'O dara. O le ṣayẹwo ipo nigbakugba nipa lilo ID itọkasi rẹ.',
    Igbo: 'Ọ dị mma. Ị nwere ike ịlele ọnọdụ oge ọ bụla site na iji ID ntụnye gị.',
    Hausa: 'To. Kuna iya duba matsayin kowane lokaci ta amfani da ID ɗin nema.'
  }
};
