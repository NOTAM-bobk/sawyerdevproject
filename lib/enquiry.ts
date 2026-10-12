/** Shared enquiry shape used by the form, the API route and the email sender. */

export type Answer = {
  name: string;
  label: string;
  value: string | string[];
};

/**
 * Field *names* that must be answered. Names (not labels) so editing the
 * question copy in content/form.ts can never break validation.
 */
export const REQUIRED_ANSWER_NAMES = [
  "name",
  "email",
  "projectType",
  "goal",
  "designStyles",
  "pages",
  "timeframe",
] as const;

export function isAnswered(answer: Answer) {
  return Array.isArray(answer.value) ? answer.value.length > 0 : answer.value.trim() !== "";
}

export function answeredOnly(answers: Answer[]) {
  return answers.filter(isAnswered);
}

/** Human-readable rendering — used for the email body and the mailto fallback. */
export function enquiryText(answers: Answer[]) {
  return answeredOnly(answers)
    .map((answer) => {
      const value = Array.isArray(answer.value) ? answer.value.join(", ") : answer.value;
      return `${answer.label}: ${value}`;
    })
    .join("\n");
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
