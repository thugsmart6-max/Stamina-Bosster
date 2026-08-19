import type { Locale } from "@/i18n/routing";
import type { IntakeData } from "@/lib/types";
import copyData from "../../../data/copy.json";
import en from "../../../messages/en.json";
import hi from "../../../messages/hi.json";
import ta from "../../../messages/ta.json";

const catalogs = { en, hi, ta } as const;

const PDF_UI = {
  en: {
    coverKicker: "Wellness report",
    indexLabel: "Wellness index",
    indexHint: "Lifestyle screening, not a medical score",
    of100: "of 100",
    erectionQuality: "Erection quality",
    move: "Move",
    fuel: "Fuel",
    recover: "Recover",
    reference: "Reference",
    frequency: "Frequency",
    recoverTitle: "Sleep, sample day, and a four-week log",
    recoverLead:
      "Stamina improves when sleep, training, and evenings work together. Use this as a four-week log — not a medical chart.",
    trackerHint: "One box per week. Tick it when you met the habit on most days.",
    weekShort: ["W1", "W2", "W3", "W4"] as const,
    habits: [
      {
        title: "Sleep 7+ hours",
        how: "Keep a regular bedtime. Screens off about 45 minutes before you lie down.",
      },
      {
        title: "Training sessions",
        how: "Tick the week if you completed at least three of your planned Move sessions.",
      },
      {
        title: "Alcohol-free evenings",
        how: "Aim for three drink-free nights, especially before training or an early morning.",
      },
      {
        title: "Energy check-in",
        how: "On Sunday, score energy from 1 to 10. Look for a slow climb over four weeks, not a spike.",
      },
    ],
  },
  hi: {
    coverKicker: "वेलनेस रिपोर्ट",
    indexLabel: "वेलनेस इंडेक्स",
    indexHint: "जीवनशैली स्क्रीनिंग — चिकित्सा स्कोर नहीं",
    of100: "/ 100",
    erectionQuality: "इरेक्शन गुणवत्ता",
    move: "मूव",
    fuel: "फ्यूल",
    recover: "रिकवर",
    reference: "संदर्भ",
    frequency: "आवृत्ति",
    recoverTitle: "नींद, नमूना दिन, और चार-सप्ताह लॉग",
    recoverLead:
      "नींद, व्यायाम और शामें साथ चलें तो स्टैमिना सुधरती है। यह चार-सप्ताह का लॉग है — चिकित्सा चार्ट नहीं।",
    trackerHint: "हर सप्ताह एक बॉक्स। ज्यादातर दिनों में आदत पूरी हो तो टिक करें।",
    weekShort: ["स1", "स2", "स3", "स4"] as const,
    habits: [
      {
        title: "7+ घंटे नींद",
        how: "ज्यादातर रातों एक ही समय सोएँ। सोने से लगभग 45 मिनट पहले स्क्रीन बंद करें।",
      },
      {
        title: "व्यायाम सत्र",
        how: "सप्ताह में कम से कम तीन नियोजित मूव सत्र पूरे हों तो टिक करें।",
      },
      {
        title: "शराब-मुक्त शामें",
        how: "कम से कम तीन शामें बिना शराब — खासकर व्यायाम या सुबह जल्दी से पहले।",
      },
      {
        title: "ऊर्जा जाँच",
        how: "रविवार को ऊर्जा 1 से 10। चार सप्ताह में धीमी बढ़त देखें, अचानक उछाल नहीं।",
      },
    ],
  },
  ta: {
    coverKicker: "நல்வாழ்வு அறிக்கை",
    indexLabel: "நல்வாழ்வு குறியீடு",
    indexHint: "வாழ்க்கை முறை சோதனை — மருத்துவ மதிப்பெண் அல்ல",
    of100: "/ 100",
    erectionQuality: "ஆண்மை தரம்",
    move: "இயக்கம்",
    fuel: "உணவு",
    recover: "மீட்பு",
    reference: "குறிப்பு",
    frequency: "அதிர்வெண்",
    recoverTitle: "தூக்கம், மாதிரி நாள், நான்கு வார பதிவு",
    recoverLead:
      "தூக்கம், பயிற்சி, மாலைகள் சேர்ந்தால் சகிப்புத்தன்மை மேம்படும். இது நான்கு வார பதிவு — மருத்துவ அட்டவணை அல்ல.",
    trackerHint:
      "ஒரு வாரத்திற்கு ஒரு பெட்டி. பெரும்பாலான நாட்களில் பழக்கம் நிறைவேறினால் குறிக்கவும்.",
    weekShort: ["வா1", "வா2", "வா3", "வா4"] as const,
    habits: [
      {
        title: "7+ மணி நேரம் தூக்கம்",
        how: "பெரும்பாலான இரவுகளில் ஒரே நேரத்தில் படுக்கவும். படுக்க 45 நிமிடம் முன் திரைகளை அணைக்கவும்.",
      },
      {
        title: "பயிற்சி அமர்வுகள்",
        how: "திட்டமிட்ட இயக்க அமர்வுகள் மூன்று அல்லது மேல் முடிந்த வாரம் குறிக்கவும்.",
      },
      {
        title: "மது இல்லா மாலைகள்",
        how: "குறைந்தது மூன்று மாலைகள் மது இல்லாமல் — பயிற்சி அல்லது அதிகாலைக்கு முன்.",
      },
      {
        title: "ஆற்றல் சோதனை",
        how: "ஞாயிற்றுக்கிழமை ஆற்றலை 1 முதல் 10 வரை. நான்கு வாரத்தில் மெதுவான உயர்வு பாருங்கள்.",
      },
    ],
  },
} as const;

export function getPdfCopy(locale: Locale) {
  const m = catalogs[locale] ?? catalogs.en;
  const rh = m.reportHtml;
  const ui = PDF_UI[locale] ?? PDF_UI.en;

  return {
    ...ui,
    preparedFor: rh.preparedFor,
    date: rh.date,
    profileTitle: rh.profileTitle,
    age: rh.age,
    bmi: rh.bmi,
    goal: rh.goal,
    readiness: rh.readiness,
    activity: rh.activity,
    exerciseTitle: rh.exerciseTitle,
    nutritionTitle: rh.nutritionTitle,
    eatMore: rh.eatMore,
    limitAvoid: rh.limitAvoid,
    sampleDayTitle: rh.sampleDayTitle,
    meal: rh.meal,
    timelineTitle: rh.timelineTitle,
    trackerTitle: rh.trackerTitle,
    week: rh.week,
    orderRef: rh.orderRef,
    watermark: rh.watermark,
    coverTitle: rh.coverTitle,
    coverSubtitle: rh.coverSubtitle,
    disclaimer: m.legal.disclaimer,
    medicalTitle: copyData.medicalBlock.title,
    medicalBody: copyData.medicalBlock.body,
    dietText: copyData.dietVariants,
    timeline: copyData.timeline,
    sampleDay: copyData.sampleDay,
    demoNotice: copyData.demoNotice,
  };
}

export function goalLabel(locale: Locale, goal: IntakeData["goal"]): string {
  const m = catalogs[locale] ?? catalogs.en;
  const intakeGoals = m.intake.goals as Record<string, string>;
  const introGoals = m.introGoals as Record<string, string>;
  return intakeGoals[goal] ?? introGoals[goal] ?? goal.replace(/_/g, " ");
}

export function erectionQualityLabel(
  locale: Locale,
  quality: IntakeData["erectionQuality"]
): string {
  const m = catalogs[locale] ?? catalogs.en;
  const options = m.intake.erectionQualityOptions as Record<string, string> | undefined;
  return options?.[quality] ?? quality;
}

export function activityLabel(
  locale: Locale,
  activity: IntakeData["activity"]
): string {
  const m = catalogs[locale] ?? catalogs.en;
  const levels = m.intake.activityLevels as Record<string, string>;
  return levels[activity] ?? activity.replace(/_/g, " ");
}

export function bmiCategoryLabel(locale: Locale, category: string): string {
  const m = catalogs[locale] ?? catalogs.en;
  const cats = m.bmiCategories as Record<string, string>;
  return cats[category] ?? category.replace(/_/g, " ");
}
