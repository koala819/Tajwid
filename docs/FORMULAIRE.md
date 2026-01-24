# Formulaire officiel de notation - Concours de Tajwid

## Format du formulaire

Le formulaire respecte le format officiel du concours avec **13 critères** totalisant **100 points**.

### Titre
```
توزيع النقاط لمسابقة التجويد (المجموع 100 نقطة)
Distribution des points pour le concours de Tajwid (Total 100 points)
```

## Les 13 critères de notation

| # | Critère (العربية) | Critère (Français) | Points max |
|---|-------------------|-------------------|------------|
| 1 | اعتدال التلاوة | Modération de la récitation | 5 |
| 2 | صحة التشكيل وثقة القارئ من نفسه، وعدم التردد أو التلعثم أو التوقف أو الرجوع للوراء | Précision de la vocalisation et confiance du récitant | 5 |
| 3 | العناية بأحكام الوقف والابتداء | Attention aux règles de pause et de reprise | 5 |
| 4 | الاحتراز من اللحن الجلي | Se prémunir contre les erreurs évidentes | **30** |
| 5 | تطبيق أحكام التفخيم والترقيق | Application des règles d'emphatisation et d'atténuation | 5 |
| 6 | النطق الصحيح للحروف، مراعاة المخارج والصفات | Prononciation correcte des lettres, respect des points d'articulation et des caractéristiques | **30** |
| 7 | تطبيق أحكام المدود | Application des règles d'allongement | 5 |
| 8 | تطبيق أحكام النون الساكنة والتنوين | Application des règles du Noun Sakin et du Tanwin | 5 |
| 9 | تطبيق أحكام الميم الساكنة | Application des règles du Mim Sakin | 5 |
| 10 | تطبيق أحكام النون والميم المشددتين | Application des règles du Noun et Mim accentués | 5 |
| 11 | الإقلاب | Iqlab (Conversion) | 5 |
| 12 | القلقلة | Qalqala (Écho) | 5 |
| 13 | الحفظ | Mémorisation | **30** |
| | **المجموع (TOTAL)** | | **100** |

## Pondération

Les critères les plus importants (30 points chacun) :
1. **الاحتراز من اللحن الجلي** (Éviter les erreurs évidentes)
2. **النطق الصحيح للحروف** (Prononciation correcte)
3. **الحفظ** (Mémorisation)

## Champ supplémentaire

- **الملاحظات (Observations)** : Zone de texte libre pour les commentaires du jury

## Informations requises

- **اسم الطالب او الطالبة** (Nom de l'élève) : Pré-rempli automatiquement
- **المستوى** (Niveau) : Pré-rempli automatiquement
- **Nom du jury** : À saisir obligatoirement

## Validation

- Chaque critère accepte des valeurs de **0 à son maximum** (avec demi-points possibles)
- Le total est calculé automatiquement
- Le total ne peut pas dépasser 100 points
- Le jury doit renseigner son nom

## Stockage

Les données sont enregistrées dans Supabase avec :
- `niveau` : Slug du niveau
- `eleve` : Nom complet de l'élève
- `jury` : Nom du jury
- `total` : Note totale sur 100
- `moyenne` : Moyenne sur 10 (total / 10) pour compatibilité
- `scores` : Objet JSON contenant :
  - Les 13 critères avec leurs notes
  - Les observations
- `recorded_at` : Date et heure d'enregistrement

## Affichage

Le formulaire présente :
1. **En-tête bilingue** avec le titre officiel
2. **Tableau** avec 4 colonnes :
   - Critère en arabe
   - Critère en français
   - Maximum de points
   - Champ de saisie de la note
3. **Ligne de total** en bas avec le calcul automatique
4. **Zone observations** en texte libre
5. **Champ jury** obligatoire
6. **Bouton d'enregistrement**

## Responsive

Le formulaire s'adapte aux différents écrans :
- **Desktop** : Tableau complet visible
- **Tablette** : Scroll horizontal si nécessaire
- **Mobile** : Vue optimisée avec scroll horizontal pour le tableau
