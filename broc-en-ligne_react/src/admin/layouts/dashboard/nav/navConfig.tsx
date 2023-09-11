import {
    Assessment as AssessmentIcon,
    AccountBox as AccountBoxIcon,
    LocalMall as LocalMallIcon,
    ConfirmationNumber as ConfirmationNumberIcon,
    Store as StoreIcon,
    LocalOffer as LocalOfferIcon,
    QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';

const navConfig = [
    {
        title: 'dashboard',
        path: '/intranet/dashboard',
        icon: <AssessmentIcon />,
    },
    {
        title: 'utilisateur',
        path: '/intranet/utilisateur/liste',
        icon: <AccountBoxIcon />,
    },
    {
        title: 'article',
        path: '/intranet/article/liste',
        icon: <LocalMallIcon />,
    },
    {
        title: 'categorie',
        path: '/intranet/categorie/liste',
        icon: <LocalOfferIcon />,
    },
    {
        title: 'reservation',
        path: '/intranet/reservation/liste',
        icon: <ConfirmationNumberIcon />,
    },
    {
        title: 'brocante',
        path: '/intranet/brocante/liste',
        icon: <StoreIcon />,
    },
    {
        title: 'Question fréquente',
        path: '/intranet/faq/liste',
        icon: <QuestionAnswerIcon />,
    }
];

export default navConfig;