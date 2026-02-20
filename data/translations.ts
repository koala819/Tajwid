// Système de traduction FR/AR pour l'application

export const translations = {
  fr: {
    // Navigation et général
    home: 'Accueil',
    results: 'Voir les résultats',
    admin: 'Administration',
    logout: 'Déconnexion',
    back: 'Retour',
    
    // Page d'accueil
    title: 'Concours de Tajwid - Demi-finale',
    selectCreneau: 'Choisissez votre créneau',
    participants: 'participants',
    
    // Créneaux
    'samedi-matin': 'Samedi matin',
    'samedi-aprem': 'Samedi après-midi',
    'dimanche-matin': 'Dimanche matin',
    'dimanche-aprem': 'Dimanche après-midi',
    
    // Niveaux
    selectLevel: 'Choisissez votre niveau',
    selectStudent: 'Choisissez un élève',
    professor: 'Professeur',
    
    // Formulaire de notes
    evaluationFor: 'Évaluation de',
    juryName: 'Nom du jury',
    juryNamePlaceholder: 'Nom complet du jury',
    criteria: 'Critères',
    max: 'Max',
    note: 'Note',
    total: 'TOTAL',
    observations: 'Observations (optionnel)',
    observationsPlaceholder: 'Commentaires généraux sur la prestation...',
    save: 'Enregistrer la note',
    saving: 'Enregistrement...',
    successTitle: 'Note enregistrée !',
    successMessage: 'L\'évaluation a été enregistrée avec succès.',
    backToHome: 'Retour à l\'accueil',
    errorSaving: 'Erreur lors de l\'enregistrement',
    
    // Page admin
    adminTitle: 'Gestion des résultats',
    noNotes: 'Aucune note enregistrée pour ce niveau',
    juries: 'jurys',
    jury: 'jury',
    waitingSecondJury: 'En attente du 2e jury',
    modify: 'Modifier',
    detailNotes: 'Détail des notes',
    comments: 'Commentaires',
    published: 'Publié',
    hidden: 'Caché',
    seePublicPage: 'Voir la page publique',
    
    // Page résultats
    resultsTitle: 'Résultats de la demi-finale',
    resultsQualifTitle: 'Résultats de qualification',
    resultsQualifSubtitle: 'Concours de Tajwid 2025 - Phase de qualification',
    noPublishedResults: 'Aucun résultat publié pour le moment',
    noQualifResults: 'Aucun résultat de qualification enregistré pour le moment',
    phaseQualification: 'Qualification',
    phaseDemiFinale: 'Demi-finale',
    phaseFinale: 'Finale',
    noResultsPhase: 'Aucun résultat publié pour cette phase',
    phaseLabel: 'Phase',
    phaseChoice: 'Choix de la phase',
    juryLabel: 'Jury',
    passwordLabel: 'Mot de passe',
    languageLabel: 'Langue',
    validateButton: 'Valider',
    langFr: 'Français',
    langAr: 'العربية',
    savingPhaseLabel: 'Enregistrement pour la phase',
    savingPhaseDefault: 'Phase non choisie (enregistrement en Demi-finale par défaut)',
    rank: 'Classement',
    student: 'Élève',
    score: 'Note',
    note1: 'Note 1',
    note2: 'Note 2',
    moyenneQualif: 'Moyenne',
    obsQualif: 'Statut',
    
    // Modal d'édition
    editNote: 'Modifier la note',
    deleteNote: 'Supprimer cette note',
    password: 'Mot de passe',
    passwordRequired: 'Mot de passe requis pour modifier',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    delete: 'Supprimer',
  },
  ar: {
    // Navigation et général
    home: 'الرئيسية',
    results: 'عرض النتائج',
    admin: 'الإدارة',
    logout: 'تسجيل الخروج',
    back: 'رجوع',
    
    // Page d'accueil
    title: 'مسابقة التجويد - نصف النهائي',
    selectCreneau: 'اختر موعدك',
    participants: 'مشاركين',
    
    // Créneaux
    'samedi-matin': 'السبت صباحا',
    'samedi-aprem': 'السبت بعد الظهر',
    'dimanche-matin': 'الأحد صباحا',
    'dimanche-aprem': 'الأحد بعد الظهر',
    
    // Niveaux
    selectLevel: 'اختر مستواك',
    selectStudent: 'اختر طالبا',
    professor: 'الأستاذ',
    
    // Formulaire de notes
    evaluationFor: 'تقييم',
    juryName: 'اسم الحكم',
    juryNamePlaceholder: 'الاسم الكامل للحكم',
    criteria: 'المعايير',
    max: 'الحد الأقصى',
    note: 'النقطة',
    total: 'المجموع',
    observations: 'ملاحظات (اختياري)',
    observationsPlaceholder: 'تعليقات عامة على الأداء...',
    save: 'حفظ النقطة',
    saving: 'جاري الحفظ...',
    successTitle: 'تم حفظ النقطة!',
    successMessage: 'تم حفظ التقييم بنجاح.',
    backToHome: 'العودة إلى الصفحة الرئيسية',
    errorSaving: 'خطأ أثناء الحفظ',
    
    // Page admin
    adminTitle: 'إدارة النتائج',
    noNotes: 'لا توجد نقاط مسجلة لهذا المستوى',
    juries: 'حكام',
    jury: 'حكم',
    waitingSecondJury: 'في انتظار الحكم الثاني',
    modify: 'تعديل',
    detailNotes: 'تفاصيل النقاط',
    comments: 'التعليقات',
    published: 'منشور',
    hidden: 'مخفي',
    seePublicPage: 'عرض الصفحة العامة',
    
    // Page résultats
    resultsTitle: 'نتائج نصف النهائي',
    resultsQualifTitle: 'نتائج التصفيات',
    resultsQualifSubtitle: 'مسابقة التجويد 2025 - مرحلة التصفيات',
    noPublishedResults: 'لا توجد نتائج منشورة في الوقت الحالي',
    noQualifResults: 'لا توجد نتائج تصفيات مسجلة في الوقت الحالي',
    phaseQualification: 'التصفيات',
    phaseDemiFinale: 'نصف النهائي',
    phaseFinale: 'النهائي',
    noResultsPhase: 'لا توجد نتائج منشورة لهذه المرحلة',
    phaseLabel: 'المرحلة',
    phaseChoice: 'اختر المرحلة',
    juryLabel: 'الحكم',
    passwordLabel: 'كلمة المرور',
    languageLabel: 'اللغة',
    validateButton: 'تأكيد',
    langFr: 'Français',
    langAr: 'العربية',
    savingPhaseLabel: 'التسجيل للمرحلة',
    savingPhaseDefault: 'المرحلة غير محددة (يُسجّل في نصف النهائي افتراضياً)',
    rank: 'الترتيب',
    student: 'الطالب',
    score: 'النقطة',
    note1: 'النقطة 1',
    note2: 'النقطة 2',
    moyenneQualif: 'المعدل',
    obsQualif: 'الحالة',
    
    // Modal d'édition
    editNote: 'تعديل النقطة',
    deleteNote: 'حذف هذه النقطة',
    password: 'كلمة المرور',
    passwordRequired: 'كلمة المرور مطلوبة للتعديل',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    delete: 'حذف',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.fr;

export const t = (key: TranslationKey, lang: Language = 'fr'): string => {
  return translations[lang][key];
};
