import {
    Cpu,
    Zap,
    Radio,
    Settings,
    Building,
    Music,
    Mic,
    Video,
    Users,
    User,
    Smile,
    Shirt,
    MessageSquare
} from 'lucide-svelte';

// Image imports
import cseBg from '../assets/cse_bg.jpg';
import eeeBg from '../assets/eee_bg.jpg';
import eceBg from '../assets/ece_bg.jpg';
import mechBg from '../assets/mech_bg.jpg';
import civilBg from '../assets/civil_bg.jpg';

// Cultural Image imports
import grpDanceImg from '../assets/events/grp-dance.webp';
import soloDanceImg from '../assets/events/solo-dance.webp';
import singingImg from '../assets/events/singing.webp';
import mimeImg from '../assets/events/mime.webp';
import fashionImg from '../assets/events/fashion.webp';
import mimixImg from '../assets/events/mimix.webp';

const rawCseRules = {
    department: 'Computer Science & Engineering',
    general_instructions: [
        'Participants must carry valid College ID Card',
        'Reporting time must be strictly followed',
        'Maintain discipline throughout the event',
        'Organizing committee decision will be final'
    ],
    technical_events: [
        {
            id: 'cse-paper',
            event_name: 'Paper Presentation',
            rules: [
                'Team Size: 2–3 Members',
                'Time Limit: 5 Minutes Only (Strictly Followed)',
                'Topics must be related to AI, Machine Learning, Deep Learning, Generative AI, or Recent Trends in AI',
                'Maximum 10 PPT Slides',
                'Abstract must be submitted before deadline',
                'Bring PPT in Pen Drive & Mail Copy',
                'Judges\' decision will be final'
            ]
        },
        {
            id: 'cse-blind-code',
            event_name: 'Blind Code',
            rules: [
                'Individual Participation Only',
                'Time Limit: 30 Minutes',
                'Only Python Programming Language Allowed',
                'Screen will be turned OFF after question explanation',
                'No Internet / Mobile Phones Allowed',
                'Code must execute successfully after screen is turned ON',
                'Malpractice leads to disqualification'
            ]
        },
        {
            id: 'cse-debugging',
            event_name: 'Debugging',
            rules: [
                'Individual Participation',
                'Time Limit: 30 Minutes',
                'Identify and correct errors in given program',
                'No external help allowed',
                'Winner based on errors fixed, correct output, and time taken'
            ]
        },
        {
            id: 'cse-quiz',
            event_name: 'Technical Quiz',
            rules: [
                'Individual Participation (1 Member Only)',
                'Rounds: MCQ, Rapid Fire, Visual, Buzzer',
                'Time per Question: 30–60 Seconds',
                'No Mobile Phones Allowed',
                'Judges\' decision will be final'
            ]
        }
    ],
    non_technical_events: [
        {
            id: 'cse-gaming',
            event_name: 'Gaming',
            event_subtitle: 'Free Fire Tournament',
            rules: [
                'Team Size: 4 Members (Squad Only)',
                'Mode: Custom Room – Classic / Clash Squad',
                'Only registered players are allowed to participate',
                'No hacks, cheats, or unfair tools (Immediate disqualification)',
                'Players must bring their own mobile device and ensure proper charging',
                'Stable internet connection required',
                'Points will be calculated based on Kill Points and Placement Points',
                'Organizing committee decision will be final'
            ]
        },
        {
            id: 'cse-ctf',
            event_name: 'Capture The Flag',
            rules: [
                'Each team can have 1–2 members',
                'Total number of questions: 10–20 flags',
                'Each question will be displayed for 20–30 seconds',
                'Participants must write: Country name and Missing symbol/element',
                'No mobile phones or internet allowed',
                'No discussion between teams',
                '1 mark for each correct country name',
                '1 mark for each correct missing element',
                'In case of tie, a rapid-fire round will be conducted',
                'Judge’s decision will be final',
                'Any malpractice leads to disqualification'
            ]
        }
    ]
};

const rawEeeRules = {
    department: 'Electrical & Electronics Engineering',
    general_instructions: [
        'A participant cannot take part in more than three events.',
        'Spot Registration is permitted only if prior intimation is given.',
        'Lunch and snacks will be provided.',
        'All participants shall bring their college ID card and bonafide certificate duly signed by the HoD or Principal.',
        'Dress code - Strictly formals.',
        'All participants should report at registration counter at 9.00 AM.',
        'Prelims will be conducted for all the events, if needed, depending on the entries.',
        'Accommodation, TA and DA will not be provided.',
        'In all events decision of the judges will be final and obligatory.'
    ],
    technical_events: [
        {
            id: 'eee-paper',
            event_name: 'Paperbestowment (Paper Presentation)',
            rules: [
                'Maximum 2 participants per paper are allowed.',
                'The paper should be in IEEE document format.',
                'Soft-copy + abstract submission on or before 10th March 3:45 PM.',
                'Topics can be on any domain in EEE.',
                'Front page must include team names, contact, email, college, and title.',
                'Bring two hardcopies on the day of the event.',
                'Presentation: 10 mins + 2 mins query session.',
                'Time limit should be strictly followed.'
            ]
        },
        {
            id: 'eee-quiz',
            event_name: 'Technical Brain Blast (Technical Quiz)',
            rules: [
                'Maximum 2 participants per team.',
                'Two rounds: Preliminary and Final.',
                'Questions based on core concepts in Electrical and Electronics Engineering.',
                'Decision of the judges will be final.'
            ]
        },
        {
            id: 'eee-debugging',
            event_name: 'Circuit Debugging',
            rules: [
                'Individual participation only.',
                'Circuits from either electrical or electronics engineering.',
                'Spot the errors and debug the circuit within 5 minutes.',
                'Decision of the judges will be final.'
            ]
        },
        {
            id: 'eee-expo',
            event_name: 'Trade Show (Project Expo)',
            rules: [
                'Maximum 2 participants per team.',
                'Hardware Project Kit is required.',
                'Projects should be Social-Oriented or based on Recent Trends.',
                'Decision of the judges will be final.'
            ]
        }
    ],
    non_technical_events: [
        {
            id: 'eee-recreation',
            event_name: 'Recreational Events',
            rules: [
                'Each team consists of 2 participants.',
                'Focus on thinking ability and decision making.',
                'Decision of the judges will be final.'
            ]
        }
    ]
};

const rawEceRules = {
    department: 'Electronics and Communication Engineering',
    general_instructions: {
        id_card: 'College ID is mandatory for all participants.',
        team_size_general: 'Maximum 3 members per team (Except for Free Fire which is Solo).',
        punctuality: 'Teams must report 15 minutes before the event starts.',
        decorum: "Judge's decisions are final. Malpractice leads to immediate disqualification."
    },
    technical_events: [
        {
            id: 'paper-tract',
            event_name: 'Paper Tract (Paper Presentation)',
            rules: [
                'Maximum 3 members per team.',
                'Time limit: 7 Minutes (Presentation) + 3 Minutes (Q&A).',
                'Participants must submit a soft copy of their abstract/PPT before the deadline.',
                'The paper MUST be strictly related to ECE domains (e.g., VLSI, Electronics, Embedded Systems, IoT, Communication Networks, Signal Processing).',
                'If the topic is found to be irrelevant or outside the specified domain, the team will be immediately disqualified.'
            ]
        },
        {
            id: 'flyer-buzzcard',
            event_name: 'Flyer / Buzzcard (Chart Presentation)',
            rules: [
                'Maximum 3 members per team.',
                'Pre-prepared Submission: Participants must bring a fully completed chart/poster.',
                'No time or materials will be provided at the venue to design the chart.',
                'The chart will be collected or displayed for evaluation immediately.',
                'The chart content must be technically related to the ECE Department or emerging technologies.',
                'Judging Criteria: Creativity, Content Quality, Visual Appeal, and Relevance to the theme.'
            ]
        },
        {
            id: 'fine-tune',
            event_name: 'Fine Tune (Circuit Debugging/Quiz)',
            rules: [
                'Maximum 3 members per team.',
                'Round 1: Technical Quiz (Basics of ECE).',
                'Round 2: Circuit Debugging / Component Identification.'
            ]
        },
        {
            id: 'innovation-expo',
            event_name: 'Innovation Expo (Project Expo)',
            rules: [
                'Maximum 3 members per team.',
                'A working model (Hardware or Software simulation) is mandatory.',
                'Projects must be accompanied by a chart or block diagram explaining the concept.'
            ]
        }
    ],
    non_technical_events: [
        {
            id: 'connection',
            event_name: 'Connection',
            rules: [
                'Maximum 3 members per team.',
                'Gameplay: Identify technical terms, songs, or movies by connecting the images displayed.',
                'Time limit: 30 seconds per slide.',
                'Answers must be precise.'
            ]
        },
        {
            id: 'free-fire',
            event_name: 'Free Fire (Mobile Gaming)',
            rules: [
                'SOLO (Individual Event).',
                'Map: BERMUDA | Mode: Custom Match.',
                'Players must bring their own mobile phones.',
                'Strictly No Emulators, Triggers, or iPads/Tablets.',
                'Players must use their own mobile data.',
                'Scoring: Based on Position (Survival) + Eliminations (Kills). Exact point table shared at venue.',
                'Fair Play: Use of hacks, scripts, or exploiting bugs results in an immediate ban.'
            ]
        }
    ]
};

const rawMechRules = {
    department: 'Mechanical & Mechatronics',
    general_instructions: [
        'College ID is mandatory for all participants',
        'Teams must report 15 minutes before the event starts',
        'Judge\'s decisions are final',
        'Malpractice leads to immediate disqualification'
    ],
    technical_events: [
        {
            id: 'mech-paper',
            event_name: 'Paper Presentation',
            rules: [
                'Team Size: Individual or Maximum of 2 members',
                'Timing: 10 minutes presentation + 5 minutes Q&A (Total 15 mins)',
                'Requirements: PPT and working model required',
                'Must wear Identity card',
                'Prizes: Total of 3 prizes. 1st prize gets reward with certificate, 2nd and 3rd get certificate only',
                'Participants must be on time in the allotted venue',
                'Final decision based on judges result'
            ]
        },
        {
            id: 'mech-cad',
            event_name: 'CAD Modeling',
            rules: [
                'Individual participation only',
                'Timing: 30 minutes',
                'Software: CREO 11.0 only',
                'Task: Complete given part diagram and its assembly',
                'Prizes: Total of 3 prizes based on duration taken',
                '1st prize: reward with certificate, 2nd and 3rd: certificate only',
                'Participants must be on time in the allotted venue',
                'Final decision based on judges result'
            ]
        },
        {
            id: 'mech-calibre',
            event_name: 'Calibre',
            rules: [
                'Individual participation only',
                'Timing: 5 minutes only',
                'Task: Measure given component dimensions using various measuring instruments',
                'Instruments: Select appropriate instrument from the table provided',
                'Prizes: Total of 3 prizes for accurate results',
                '1st prize: reward with certificate, 2nd and 3rd: certificate only',
                'Participants must be on time in the allotted venue',
                'Final decision based on judges result'
            ]
        },
        {
            id: 'mech-quiz',
            event_name: 'Technical Quiz',
            rules: [
                'Team Size: Pair only (2 members)',
                'Duration: Maximum 30 minutes',
                'Participation: Maximum 5 teams (Shortlisting via preliminary round if needed)',
                'Format: Total of 25 questions',
                'Prizes: Total of 3 prizes. 1st prize gets reward with certificate, 2nd and 3rd get certificate only',
                'Participants must be on time in the allotted venue',
                'Final decision based on judges result'
            ]
        }
    ],
    non_technical_events: [
        {
            id: 'mech-paper-plane',
            event_name: 'Paper Plane',
            rules: [
                'Individual participation only',
                'Requirements: Bring own materials for making the paper plane',
                'Design: Any design is allowed',
                'Scoring: Based on "time of flight"',
                'Prizes: Total of 3 prizes. 1st prize gets reward with certificate, 2nd and 3rd get certificate only',
                'Participants must be on time in the allotted venue',
                'Final decision based on judges result'
            ]
        },
        {
            id: 'mech-painting',
            event_name: 'Brushless Painting',
            rules: [
                'Individual participation only',
                'Requirements: Bring own materials',
                'Task: Painting according to the title given by the judge',
                'Prizes: Total of 3 prizes. 1st prize gets reward with certificate, 2nd and 3rd get certificate only',
                'Participants must be on time in the allotted venue',
                'Final decision based on judges result'
            ]
        }
    ]
};

const rawCivilRules = {
    department: 'Civil Engineering',
    general_instructions: [
        'College ID is mandatory for all participants',
        'Teams must report 15 minutes before the event starts',
        'Judge\'s decisions are final',
        'Malpractice leads to immediate disqualification'
    ],
    technical_events: [
        {
            id: 'civil-bridge',
            event_name: 'Bridge',
            event_subtitle: 'Techno Bridge - Technical Presentation',
            rules: [
                'Students can present technical paper or project work',
                'Individual or maximum 2 members per team',
                'Technical paper should not exceed 8 pages',
                'Present through PowerPoint (Max 15 slides)',
                'Presentation should be submitted before deadline',
                'Time limit for presentation will be announced',
                'Topics should be in specific area of Civil Engineering'
            ]
        },
        {
            id: 'civil-model',
            event_name: 'Model Making',
            event_subtitle: 'Model Expo - Creative Model Building',
            rules: [
                'Materials will be provided by organizing committee',
                'Students must create model using given materials only',
                'Bring knowledge and creative thinking in model making',
                'Time limit will be announced on event day',
                'Models will be judged on creativity, stability, and presentation',
                'No external materials allowed'
            ]
        },
        {
            id: 'civil-poster',
            event_name: 'Poster',
            event_subtitle: 'Builder - Creative Poster Making',
            rules: [
                'Showcase understanding and creativity through posters',
                'Theme-based poster creation',
                'Demonstrate knowledge and performance ability',
                'Materials may be provided or bring your own (confirm with organizers)',
                'Poster size and theme will be announced',
                'Time limit will be specified on event day'
            ]
        },
        {
            id: 'civil-cad',
            event_name: 'CAD Quest',
            event_subtitle: 'Empowering Design Knowledge',
            rules: [
                'Drawing understanding and creation test',
                'Line plan of building will be provided',
                'Students must draw: Plan, Elevation, and Sectional view',
                'Time limit will be given',
                'Software/tools will be specified on event day',
                'Focus on accuracy and presentation quality'
            ]
        },
        {
            id: 'civil-quiz',
            event_name: 'Quiz',
            event_subtitle: 'Fall Out - Technical Problem Solving',
            rules: [
                'Participants will be given structural engineering issues',
                'Provide solution/remedy to the problem',
                'Enhances problem-solving ability',
                'Improves technical knowledge in Civil Engineering',
                'Time limit per question will be specified',
                'Individual or team participation (to be confirmed)',
                'Judges\' decision will be final'
            ]
        }
    ],
    non_technical_events: []
};

export const rawCulturalRules = [
    {
        id: 'general',
        name: 'General Rules',
        rules: [
            'Each participant should carry identity card.',
            'Spot registration is not permitted.',
            'Punctuality will be appreciated.',
            'Please do not carry sharp objects; inflammable objects or any other that might be potentially dangerous.',
            'Please do not carry/consume any intoxicant, liquor, any narcotics drugs, cigarettes or additives or any sort smoking in strictly prohibited within the campus.',
            'Students should refrain from abusive revealing costumes during the competitions, failing which they will be disqualified.',
            'Participants should go through the event rules and adhere to the specifics.',
            'Any form of vulgarity or obscenity is strictly prohibited and any such behaviors on or offstage will call for immediate disqualification of the team.',
            'Participants must maintain decorum inside the campus. Any misbehavior will be dealt with severely.'
        ]
    },
    {
        id: 'danzera',
        name: 'DANZERA (GROUP DANCE)',
        type: 'Group Dance',
        image: grpDanceImg,
        icon: Users,
        color: 'from-pink-500 to-rose-500',
        rules: [
            'Any dance form is accepted.',
            'Theme: RETRO TO MODERN (old to new generation) (or) CLASSICAL WITH HIP HOP FUSION. You can choose any one theme.',
            'Minimum 6 to maximum 8 participants.',
            'Vulgarity of any kind with respect to dance moves, costumes etc, will lead to disqualification.',
            'Time allocated to 5 minutes.',
            'No use of fire onstage.',
            'The dance should not end with a negative emotion.',
            'Can use decent film songs.',
            'Only one minute will be provided for setup.',
            'The sound track should be handed over in MP3 format in a pen drive or a CD, in person before the event begins. Soundtracks on mobile phones are not permitted.',
            'Each participant must carry their college ID for verification purpose.',
            'Failure to adhere to the rules will lead to disqualification.',
            'The decision made by judges shall be final & binding.'
        ]
    },
    {
        id: 'sizzle-shake',
        name: 'SIZZLE AND SHAKE (SOLO DANCE)',
        type: 'Solo Dance',
        image: soloDanceImg,
        icon: User,
        color: 'from-violet-500 to-purple-500',
        rules: [
            'Any dance form is accepted.',
            'Vulgarity of any kind with respect to dance moves, costumes etc, will lead to disqualification.',
            'Time allocated to 5 minutes.',
            'No use of fire onstage.',
            'The dance should not end with a negative emotion.',
            'Can use decent film songs.',
            'Only one minute will be provided for setup.',
            'The sound track should be handed over in MP3 format in a pen drive or a CD, in person before the event begins. Soundtracks on mobile phones are not permitted.',
            'Each participant must carry their college ID for verification purpose.',
            'Failure to adhere to the rules will lead to disqualification.',
            'The decision made by judges shall be final & binding.'
        ]
    },
    {
        id: 'voice-vibes',
        name: 'VOICE VIBES (SINGING)',
        type: 'Singing',
        image: singingImg,
        icon: Mic,
        color: 'from-blue-500 to-cyan-500',
        rules: [
            'Each participant can sing for a maximum of 3 minutes.',
            'Only Karaoke based singing is allowed.',
            'Exceeding this time limit would lead to negative marking. An extra minute will be given for setup.',
            'Participants may sing any mainstream Bollywood songs or any songs that might be semi-classical, classical, folk composition. Performing an original composition will fetch bonus points.',
            'Participants in singing can be either solo or group performances.'
        ]
    },
    {
        id: 'rhythm-strings',
        name: 'RHYTHM STRINGS (INSTRUMENTAL MUSIC)',
        type: 'Instrumental Music',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2000&auto=format&fit=crop',
        icon: Music,
        color: 'from-amber-400 to-orange-500',
        rules: [
            'This is a solo instrumental performance.',
            'Only instrumental music is allowed (no vocals).',
            'Time limit: 3–5 minutes (including setup).',
            'Participants must bring their own instruments.',
            'Pre-recorded backing tracks are not allowed.',
            'Karaoke or vocal assistance is not permitted.',
            'Judges’ decision will be final and binding.'
        ]
    },
    {
        id: 'silent-symphony',
        name: 'SILENT SYMPHONY (MIME)',
        type: 'MIME',
        image: mimeImg,
        icon: Smile,
        color: 'from-teal-400 to-emerald-500',
        rules: [
            '7 minutes per team. Negative points for exceeding time.',
            'Minimum 5 to maximum 8 students per team.',
            'Music should only contain instrumental tracks (no lyrics).',
            'Act should not contain any dialogue or lip sync.',
            'Obscenity will lead to disqualification.',
            'Content should not be political, religious, or include flags.',
            'No offensive, vulgar or obscene language.',
            'Judged on Content and Impact.'
        ]
    },
    {
        id: 'fashion-fiesta',
        name: 'FASHION FIESTA (FASHION PARADE)',
        type: 'Fashion Show',
        image: fashionImg,
        icon: Shirt,
        color: 'from-fuchsia-500 to-pink-500',
        rules: [
            'Theme: FASHION THROUGH THE ERAS (70s, 80s, 90s to 2026 trends).',
            'Team event: 6-12 members.',
            'Time limit: 8 minutes.',
            'Vulgarity is strongly prohibited. Any form of obscenity will lead to debarring.',
            'Should carry tracks in pen drive and submit in advance.',
            'Negative marking if participants exceed time limit.',
            'Teams will be judged based on: costumes, theme, walking stance, attitude and tagline.'
        ]
    },
    {
        id: 'mimix',
        name: 'MIMIX (MIMICRY)',
        type: 'Mimicry',
        image: mimixImg,
        icon: MessageSquare,
        color: 'from-indigo-500 to-blue-600',
        rules: [
            'Individual event.',
            'Time allotted 3 minutes.',
            'No use of abusive languages/foul language is permitted.',
            'No inappropriate comments that could hurt community sentiments (religious, race, sex, culture).',
            'Participants may mimic sound of machines and speeches of well-known persons including film personalities.'
        ]
    },
    {
        id: 'cinebuzz',
        name: 'CINEBUZZ (SHORT FILM)',
        type: 'Short Film',
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop',
        icon: Video,
        color: 'from-red-500 to-orange-600',
        rules: [
            'Individual event.',
            'Theme of the short film: HONESTY.',
            'Time: 5 to 10 minutes.',
            'Try your best to give your short movie a professional look.',
            'It should be in MP4 format and should be shot using DSLR Camera only.',
            'Judges decision should be final.'
        ]
    }
];

export const symposiumData = [
    {
        id: 'cse',
        name: 'Computer Science',
        dept: rawCseRules.department,
        fullName: rawCseRules.department,
        icon: Cpu,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        image: cseBg,
        hasRules: true,
        rulesData: rawCseRules,
        categories: [
            {
                title: 'Technical',
                items: rawCseRules.technical_events.map((e) => e.event_name)
            },
            {
                title: 'Non-Technical',
                items: rawCseRules.non_technical_events.map((e) => e.event_name)
            }
        ],
        events: {
            technical: rawCseRules.technical_events.map((e) => e.event_name),
            nonTechnical: rawCseRules.non_technical_events.map((e) => e.event_name)
        }
    },
    {
        id: 'eee',
        name: 'Electrical & Electronics',
        dept: rawEeeRules.department,
        fullName: rawEeeRules.department,
        icon: Zap,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        image: eeeBg,
        hasRules: true,
        rulesData: rawEeeRules,
        staff: ['Mr. M. Prasath, AP', 'Mr. C. Karthick, AP'],
        categories: [
            {
                title: 'Technical Symposium',
                items: rawEeeRules.technical_events.map((e) => e.event_name)
            },
            {
                title: 'Non-Technical',
                items: rawEeeRules.non_technical_events.map((e) => e.event_name)
            }
        ],
        events: {
            technical: rawEeeRules.technical_events.map((e) => e.event_name),
            nonTechnical: rawEeeRules.non_technical_events.map((e) => e.event_name)
        }
    },
    {
        id: 'ece',
        name: 'Electronics & Comm',
        dept: rawEceRules.department,
        fullName: rawEceRules.department,
        icon: Radio,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        image: eceBg,
        hasRules: true,
        rulesData: rawEceRules,
        categories: [
            {
                title: 'Technical',
                items: rawEceRules.technical_events.map((e) => e.event_name)
            },
            {
                title: 'Non-Technical',
                items: rawEceRules.non_technical_events.map((e) => e.event_name)
            }
        ],
        events: {
            technical: rawEceRules.technical_events.map((e) => e.event_name),
            nonTechnical: rawEceRules.non_technical_events.map((e) => e.event_name)
        }
    },
    {
        id: 'mech',
        name: 'Mech & Mechatronics',
        dept: rawMechRules.department,
        fullName: rawMechRules.department,
        icon: Settings,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        image: mechBg,
        hasRules: true,
        rulesData: rawMechRules,
        categories: [
            {
                title: 'Technical',
                items: rawMechRules.technical_events.map((e) => e.event_name)
            },
            {
                title: 'Non-Technical',
                items: rawMechRules.non_technical_events.map((e) => e.event_name)
            }
        ],
        events: {
            technical: rawMechRules.technical_events.map((e) => e.event_name),
            nonTechnical: rawMechRules.non_technical_events.map((e) => e.event_name)
        }
    },
    {
        id: 'civil',
        name: 'Civil Engineering',
        dept: rawCivilRules.department,
        fullName: rawCivilRules.department,
        icon: Building,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        image: civilBg,
        hasRules: true,
        rulesData: rawCivilRules,
        categories: [
            {
                title: 'Events',
                items: rawCivilRules.technical_events.map((e) => e.event_name)
            }
        ],
        events: {
            technical: rawCivilRules.technical_events.map((e) => e.event_name),
            nonTechnical: rawCivilRules.non_technical_events?.map((e) => e.event_name) || []
        }
    }
];

export const culturalData = rawCulturalRules.filter((item) => item.id !== 'general');

export const culturalEvents = culturalData.map((item) => item.name);
export const culturalGeneralRules =
    rawCulturalRules.find((item) => item.id === 'general')?.rules || [];
