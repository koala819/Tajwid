// Critères officiels du concours de Tajwid avec pondérations (total 100 points)
export const criteres = [
  { id: 'itidal', label: 'اعتدال التلاوة', labelFr: 'Modération de la récitation', max: 5 },
  { id: 'thiqah', label: 'صحة التشكيل وثقة القارئ', labelFr: 'Précision et confiance', max: 5 },
  { id: 'waqf', label: 'العناية بأحكام الوقف والابتداء', labelFr: 'Règles de pause/reprise', max: 5 },
  { id: 'lahn', label: 'الاحتراز من اللحن الجلي', labelFr: 'Éviter les erreurs évidentes', max: 30 },
  { id: 'tafkhim', label: 'تطبيق أحكام التفخيم والترقيق', labelFr: 'Emphatisation/Atténuation', max: 5 },
  { id: 'huruf', label: 'النطق الصحيح للحروف، مراعاة المخارج والصفات', labelFr: 'Prononciation correcte des lettres', max: 30 },
  { id: 'mudud', label: 'تطبيق أحكام المدود', labelFr: 'Règles d\'allongement', max: 5 },
  { id: 'nun_tanwin', label: 'تطبيق أحكام النون الساكنة والتنوين', labelFr: 'Noun Sakin et Tanwin', max: 5 },
  { id: 'mim_sakin', label: 'تطبيق أحكام الميم الساكنة', labelFr: 'Mim Sakin', max: 5 },
  { id: 'nun_mim', label: 'تطبيق أحكام النون والميم المشددتين', labelFr: 'Noun et Mim accentués', max: 5 },
  { id: 'iqlab', label: 'الإقلاب', labelFr: 'Iqlab', max: 5 },
  { id: 'qalqala', label: 'القلقلة', labelFr: 'Qalqala', max: 5 },
  { id: 'hifdh', label: 'الحفظ', labelFr: 'Mémorisation', max: 30 },
];

// Map pour retrouver un critère par son ID
export const criteresMap = criteres.reduce<Record<string, typeof criteres[0]>>((acc, critere) => {
  acc[critere.id] = critere;
  return acc;
}, {});
