import type { Locale } from "@/i18n/routing";
import {
  AVOID_ROWS,
  DAILY_ROUTINE,
  DOCTOR_FOOTNOTE,
  DOCTOR_ROWS,
  EXERCISE_ROWS,
  EXERCISE_WARNING,
  FOOD_HINDI,
  FOOD_NEUTRAL,
  FOOD_TAMIL,
  HEALTH_CHECKS,
  LIFESTYLE_HABITS,
  PERFORMANCE_GUIDE_TITLE,
} from "@/data/performance-guide";
import { getPerformanceGuide } from "@/lib/i18n-performance-guide";

export type LocalizedGuideContent = {
  title: string;
  subtitle: string;
  disclaimer: string;
  doctorFootnote: string;
  exerciseWarning: string;
  sections: {
    exercisesDo: string;
    avoid: string;
    foodsIndian: string;
    foodsTamil: string;
    foodsHindi: string;
    foodsPan: string;
    improvePerformance: string;
    dailyRoutine: string;
    healthChecks: string;
    lifestyleHabits: string;
    doctor: string;
  };
  headers: {
    exercise: string;
    how: string;
    frequency: string;
    benefit: string;
    avoid: string;
    reason: string;
    food: string;
    why: string;
    time: string;
    action: string;
    check: string;
    sign: string;
    doctorAction: string;
  };
  profile: {
    title: string;
    name: string;
    age: string;
    gender: string;
    bmi: string;
    smokingWarn: string;
    alcoholWarnWeekly: string;
    alcoholWarnDaily: string;
    male: string;
    female: string;
    preferNot: string;
  };
  exercises: { exercise: string; how: string; frequency: string; benefit: string }[];
  avoid: { item: string; reason: string }[];
  foodsTamil: { food: string; why: string }[];
  foodsHindi: { food: string; why: string }[];
  foodsPan: { food: string; why: string }[];
  dailyRoutine: { time: string; action: string }[];
  healthChecks: { check: string; why: string }[];
  lifestyleHabits: string[];
  doctor: { sign: string; action: string }[];
};

const PROFILE_EN = {
  title: "Your Health Profile",
  name: "Name",
  age: "Age",
  gender: "Gender",
  bmi: "BMI",
  smokingWarn: "You reported smoking — please avoid tobacco. Smoking damages blood vessels and reduces penis blood flow.",
  alcoholWarnWeekly:
    "You reported weekly alcohol use — limit drinks to support erection quality and hormone balance.",
  alcoholWarnDaily:
    "You reported daily alcohol use — please reduce or avoid alcohol. Excess alcohol is a major ED risk factor.",
  male: "Male",
  female: "Female",
  preferNot: "Prefer not to say",
};

const PROFILE_HI = {
  title: "आपकी स्वास्थ्य प्रोफ़ाइल",
  name: "नाम",
  age: "उम्र",
  gender: "लिंग",
  bmi: "BMI",
  smokingWarn:
    "आप धूम्रपान करते हैं — तंबाकू छोड़ें। धूम्रपान रक्त वाहिकाओं को नुकसान पहुंचाता है।",
  alcoholWarnWeekly:
    "आप साप्ताहिक शराब पीते हैं — मात्रा सीमित करें। अधिक शराब इरेक्शन को प्रभावित करती है।",
  alcoholWarnDaily:
    "आप रोज शराब पीते हैं — कृपया कम करें या छोड़ें। अधिक शराब ED का बड़ा कारण है।",
  male: "पुरुष",
  female: "महिला",
  preferNot: "बताना नहीं चाहते",
};

const PROFILE_TA = {
  title: "உங்கள் சுகாதார விவரம்",
  name: "பெயர்",
  age: "வயது",
  gender: "பாலினம்",
  bmi: "BMI",
  smokingWarn:
    "நீங்கள் புகைபிடிப்பு என்று தெரிவித்துள்ளீர்கள் — தயவுசெய்து தவிர்க்கவும். புகை இரத்த நாளங்களை பாதிக்கும்.",
  alcoholWarnWeekly:
    "வாரந்தோறும் மது என்று தெரிவித்துள்ளீர்கள் — அளவை குறைக்கவும்.",
  alcoholWarnDaily:
    "தினமும் மது என்று தெரிவித்துள்ளீர்கள் — குறைக்கவும் அல்லது தவிர்க்கவும்.",
  male: "ஆண்",
  female: "பெண்",
  preferNot: "சொல்ல விரும்பவில்லை",
};

const SECTIONS_EN = {
  exercisesDo: "What Exercises to Do",
  avoid: "What to Avoid",
  foodsIndian: "Foods to Eat (Indian Specific: Tamil + Hindi + Neutral)",
  foodsTamil: "Tamil Nadu Foods",
  foodsHindi: "Hindi Belt Foods",
  foodsPan: "Pan-India (Neutral) Foods",
  improvePerformance: "What to Do to Improve Erections & Performance",
  dailyRoutine: "Daily Routine",
  healthChecks: "Key Health Checks",
  lifestyleHabits: "Lifestyle Habits",
  doctor: "When to See a Doctor",
};

const SECTIONS_HI = {
  exercisesDo: "कौन से व्यायाम करें",
  avoid: "क्या न करें",
  foodsIndian: "क्या खाएं (तमिल + हिंदी + सामान्य)",
  foodsTamil: "तमिलनाडु खाद्य",
  foodsHindi: "हिंदी बेल्ट खाद्य",
  foodsPan: "पूरे भारत (सामान्य) खाद्य",
  improvePerformance: "इरेक्शन और प्रदर्शन सुधारने के लिए क्या करें",
  dailyRoutine: "दैनिक दिनचर्या",
  healthChecks: "महत्वपूर्ण स्वास्थ्य जांच",
  lifestyleHabits: "जीवनशैली की आदतें",
  doctor: "डॉक्टर कब दिखाएं",
};

const SECTIONS_TA = {
  exercisesDo: "செய்ய வேண்டிய பயிற்சிகள்",
  avoid: "தவிர்க்க வேண்டியவை",
  foodsIndian: "சாப்பிட வேண்டிய உணவு (தமிழ் + ஹிந்தி + பொது)",
  foodsTamil: "தமிழ்நாடு உணவுகள்",
  foodsHindi: "வட இந்திய உணவுகள்",
  foodsPan: "இந்தியா முழுவதும் (பொது) உணவுகள்",
  improvePerformance: "செயல்திறனை மேம்படுத்த என்ன செய்வது",
  dailyRoutine: "தினசரி வழக்கம்",
  healthChecks: "முக்கிய சுகாதார பரிசோதனை",
  lifestyleHabits: "வாழ்க்கை முறை பழக்கங்கள்",
  doctor: "மருத்துவர் எப்போது",
};

const EXTRA_EN = {
  exerciseWarning: EXERCISE_WARNING,
  doctorFootnote: DOCTOR_FOOTNOTE,
  dailyRoutine: DAILY_ROUTINE.map((r) => ({ time: r.time, action: r.action })),
  healthChecks: HEALTH_CHECKS.map((r) => ({ check: r.check, why: r.why })),
  lifestyleHabits: [...LIFESTYLE_HABITS],
};

const EXTRA_HI = {
  exerciseWarning:
    "தவிர்க்கவும்: அதிக சைக்கிள் ஓட்டுதல் (பெரினியம் அழுத்தம் இரத்த நாளங்களை பாதிக்கும்)",
  doctorFootnote: "தேவைப்படும்போது மருந்து மற்றும் சிகிச்சை உதவும்.",
  dailyRoutine: [
    { time: "सुबह", action: "10 केगेल × 5 सेट + 30 मिनट चाल" },
    { time: "भोजन", action: "मेडिटेरेनियन शैली (सब्जी, मछली, मेवे, साबुत अनाज)" },
    { time: "स्नैक", action: "बादाम + अखरोट + कद्दू के बीज या डार्क चॉकलेट" },
    { time: "पेय", action: "2–3 कप कॉफी + नारियल पानी + तरबूज" },
    { time: "रात", action: "गर्म दूध + हल्दी (या केसर)" },
    { time: "नींद", action: "7–9 घंटे/रात" },
  ],
  healthChecks: [
    { check: "रक्तचाप", why: "उच्च BP पेनिस की नसों को नुकसान" },
    { check: "कोलेस्ट्रॉल", why: "उच्च कोलेस्ट्रॉल → ED" },
    { check: "ब्लड शुगर", why: "मधुमेह प्रमुख ED कारण" },
    { check: "टेस्टोस्टेरोन", why: "कम T → कमजोर इरेक्शन" },
    { check: "कमर का आकार", why: "42 इंच कमर = 50% अधिक ED जोखिम" },
  ],
  lifestyleHabits: [
    "स्वस्थ वजन बनाए रखें",
    "धूम्रपान छोड़ें",
    "शराब सीमित करें",
    "तनाव कम करें",
    "जोखिम भरे सेक्स पोज़िशन से बचें",
    "स्वस्थ भोजन योजना अपनाएं",
  ],
};

// Fix EXTRA_HI exerciseWarning - used Hindi not Tamil by mistake
EXTRA_HI.exerciseWarning =
  "बचें: अत्यधिक साइकिल चलाना (पेरिनियम पर दबाव रक्त वाहिकाओं को नुकसान पहुंचाता है)";
EXTRA_HI.doctorFootnote = "जरूरत पड़ने पर दवा और थेरेपी मदद कर सकती है।";

const EXTRA_TA = {
  exerciseWarning:
    "தவிர்க்கவும்: அதிக சைக்கிள் ஓட்டுதல் (பெரினியம் அழுத்தம் இரத்த நாளங்களை பாதிக்கும்)",
  doctorFootnote: "தேவைப்படும்போது மருந்து மற்றும் சிகிச்சை உதவும்.",
  dailyRoutine: [
    { time: "காலை", action: "10 கேகெல் × 5 செட் + 30 நிமிட நடை" },
    { time: "உணவு", action: "மெடிடரேனியன் பாணி (கீரை, மீன், கொட்டை, முழு தானியம்)" },
    { time: "சிற்றுண்டி", action: "பாதாம் + வால்நட் + பூசணி விதை அல்லது டார்க் சாக்லேட்" },
    { time: "பானம்", action: "2–3 கப் காபி + தேங்காய் நீர் + தர்பூசணி" },
    { time: "இரவு", action: "சூடான பால் + மஞ்சள் (அல்லது குங்குமப்பூ)" },
    { time: "தூக்கம்", action: "7–9 மணி/இரவு" },
  ],
  healthChecks: [
    { check: "இரத்த அழுத்தம்", why: "அதிக BP ஆண்குறி நாளங்களை பாதிக்கும்" },
    { check: "கொழுப்பு", why: "அதிக கொழுப்பு → ED" },
    { check: "இரத்த சர்க்கரை", why: "நீரிழிவு முக்கிய ED காரணம்" },
    { check: "டெஸ்டோஸ்டிரோன்", why: "குறைவு → பலவீனமான எரிச்சல்" },
    { check: "இடுப்பு அளவு", why: "42 அங்குல இடுப்பு = 50% அதிக ED அபாயம்" },
  ],
  lifestyleHabits: [
    "ஆரோக்கியமான எடையை பராமரிக்கவும்",
    "புகைபிடிப்பை நிறுத்துங்கள்",
    "மதுவை குறைக்கவும்",
    "மன அழுத்தத்தை குறைக்கவும்",
    "ஆபத்தான பாலியல் நிலைகளை தவிர்க்கவும்",
    "ஆரோக்கியமான உணவு திட்டத்தை பின்பற்றுங்கள்",
  ],
};

type GuideExtras = {
  exerciseWarning: string;
  doctorFootnote: string;
  dailyRoutine: { time: string; action: string }[];
  healthChecks: { check: string; why: string }[];
  lifestyleHabits: string[];
};

const localeExtras: Record<Locale, GuideExtras> = {
  en: EXTRA_EN,
  hi: EXTRA_HI,
  ta: EXTRA_TA,
};

const localeSections: Record<Locale, typeof SECTIONS_EN> = {
  en: SECTIONS_EN,
  hi: SECTIONS_HI,
  ta: SECTIONS_TA,
};

const localeProfile: Record<Locale, typeof PROFILE_EN> = {
  en: PROFILE_EN,
  hi: PROFILE_HI,
  ta: PROFILE_TA,
};

function mapExercises(guide: ReturnType<typeof getPerformanceGuide>) {
  if (guide.exercises.length) {
    return guide.exercises.map((e) => ({
      exercise: e.name ?? e.exercise ?? "",
      how: e.how ?? "",
      frequency: e.frequency ?? "",
      benefit: e.benefit ?? "",
    }));
  }
  return EXERCISE_ROWS.map((r) => ({
    exercise: r.exercise,
    how: r.how,
    frequency: r.frequency,
    benefit: r.benefit,
  }));
}

function mapFoods(
  rows: { food?: string; why?: string }[],
  fallback: readonly { food: string; why: string }[]
) {
  if (rows.length) {
    return rows.map((r) => ({ food: r.food ?? "", why: r.why ?? "" }));
  }
  return fallback.map((r) => ({ food: r.food, why: r.why }));
}

export function getLocalizedGuideContent(locale: Locale): LocalizedGuideContent {
  const guide = getPerformanceGuide(locale);
  const extras = localeExtras[locale] ?? localeExtras.en;
  const fallbackSections = localeSections[locale] ?? localeSections.en;
  const gs = guide.sections;
  const sections = {
    exercisesDo: gs.exercisesDo ?? fallbackSections.exercisesDo,
    avoid: gs.avoid ?? fallbackSections.avoid,
    foodsIndian: fallbackSections.foodsIndian,
    foodsTamil: gs.foodsTamil ?? fallbackSections.foodsTamil,
    foodsHindi: gs.foodsHindi ?? fallbackSections.foodsHindi,
    foodsPan: gs.foodsPan ?? fallbackSections.foodsPan,
    improvePerformance: fallbackSections.improvePerformance,
    dailyRoutine: fallbackSections.dailyRoutine,
    healthChecks: fallbackSections.healthChecks,
    lifestyleHabits: fallbackSections.lifestyleHabits,
    doctor: gs.doctor ?? fallbackSections.doctor,
  };
  const profile = localeProfile[locale] ?? localeProfile.en;
  const h = guide.tableHeaders;

  const avoid =
    guide.avoid.length > 0
      ? guide.avoid.map((r) => ({ item: r.item ?? "", reason: r.reason ?? "" }))
      : AVOID_ROWS.map((r) => ({ item: r.item, reason: r.reason }));

  const doctor =
    guide.doctor.length > 0
      ? guide.doctor.map((r) => ({ sign: r.sign ?? "", action: r.action ?? "" }))
      : DOCTOR_ROWS.map((r) => ({ sign: r.sign, action: r.action }));

  return {
    title: locale === "en" ? PERFORMANCE_GUIDE_TITLE : guide.title,
    subtitle: guide.subtitle,
    disclaimer: guide.disclaimer,
    doctorFootnote: extras.doctorFootnote,
    exerciseWarning: extras.exerciseWarning,
    sections,
    headers: {
      exercise: h.exercise ?? "Exercise",
      how: h.how ?? "How to Do It",
      frequency: h.frequency ?? "Frequency",
      benefit: h.benefit ?? "Benefit",
      avoid: h.avoid ?? "Avoid",
      reason: h.reason ?? "Reason",
      food: h.food ?? "Food",
      why: h.why ?? "Why It Helps",
      time: h.time ?? "Time",
      action: h.action ?? "Action",
      check: h.check ?? "Check",
      sign: h.sign ?? "Sign",
      doctorAction: h.doctorAction ?? "Action",
    },
    profile,
    exercises: mapExercises(guide),
    avoid,
    foodsTamil: mapFoods(guide.foodsTamil, FOOD_TAMIL),
    foodsHindi: mapFoods(guide.foodsHindi, FOOD_HINDI),
    foodsPan: mapFoods(guide.foodsPan, FOOD_NEUTRAL),
    dailyRoutine: extras.dailyRoutine,
    healthChecks: extras.healthChecks,
    lifestyleHabits: extras.lifestyleHabits,
    doctor,
  };
}
