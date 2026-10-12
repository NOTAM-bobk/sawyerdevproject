"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  LayoutDashboard,
  Loader2,
  Mail,
  Send,
  Sparkles,
} from "lucide-react";
import { SketchCheck, SketchSparkle } from "@/components/doodles";
import { projectForm, type Field } from "@/content/form";
import { site } from "@/content/site";
import { enquiryText, isValidEmail, type Answer } from "@/lib/enquiry";

type Values = Record<string, string | string[]>;
type Status = "idle" | "submitting" | "sent" | "fallback" | "error";

const STEPS = projectForm.steps;

const inputClasses =
  "w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-sm text-ink transition-all placeholder:text-muted/50 hover:border-line-strong focus:border-ink focus:ring-1 focus:ring-ink focus:outline-none shadow-xs";

export function ProjectForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  /** The client's dashboard code — only ever returned once, on this screen. */
  const [accessCode, setAccessCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [company, setCompany] = useState(""); // honeypot

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const answers = useMemo<Answer[]>(
    () =>
      STEPS.flatMap((entry) => entry.fields).map((field) => {
        const raw = values[field.name] ?? (field.type === "checks" ? [] : "");
        const display = (value: string) =>
          field.type === "radio" || field.type === "checks"
            ? (field.options.find((option) => option.value === value)?.label ?? value)
            : value;

        return {
          name: field.name,
          label: field.label,
          value: Array.isArray(raw) ? raw.map(display) : display(raw),
        };
      }),
    [values],
  );

  const mailto = useMemo(() => {
    const who = typeof values.name === "string" && values.name.trim() ? values.name : "website project";
    return `mailto:${site.email}?subject=${encodeURIComponent(
      `Project enquiry — ${who}`,
    )}&body=${encodeURIComponent(enquiryText(answers))}`;
  }, [answers, values.name]);

  const setValue = (name: string, value: string | string[]) =>
    setValues((current) => ({ ...current, [name]: value }));

  const toggleCheck = (name: string, option: string) => {
    const current = values[name];
    const list = Array.isArray(current) ? current : [];
    setValue(name, list.includes(option) ? list.filter((item) => item !== option) : [...list, option]);
  };

  function validateStep(index: number) {
    const found: Record<string, string> = {};

    for (const field of STEPS[index].fields) {
      const value = values[field.name];
      const isRequired = "required" in field && field.required === true;
      const empty = Array.isArray(value) ? value.length === 0 : !value || value.trim() === "";

      if (isRequired && empty) {
        found[field.name] = "This question is required.";
        continue;
      }
      if (field.type === "email" && typeof value === "string" && value.trim() && !isValidEmail(value)) {
        found[field.name] = "Please enter a valid email address.";
      }
    }

    return found;
  }

  function goNext() {
    const found = validateStep(stepIndex);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setErrors({});
    setStepIndex((index) => Math.max(index - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    const found = validateStep(stepIndex);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    setServerError("");

    try {
      const response = await fetch("/api/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, company }),
      });
      const data = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            configured?: boolean;
            accessCode?: string;
            error?: string;
          }
        | null;

      if (response.ok && data?.ok) {
        setAccessCode(typeof data.accessCode === "string" ? data.accessCode : "");
        setStatus("sent");
        return;
      }
      if (response.status === 503 && data?.configured === false) {
        setStatus("fallback");
        return;
      }
      setStatus("error");
      setServerError(data?.error ?? "Something went wrong sending that.");
    } catch {
      setStatus("error");
      setServerError("I couldn't reach the server — email works too.");
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  if (status === "sent" || status === "fallback") {
    const sent = status === "sent";

    return (
      <div className="surface w-full rounded-2xl border border-line bg-paper p-8 sm:p-12 md:p-14 shadow-xl">
        <span className="inline-flex items-center gap-2 text-ink">
          <SketchCheck className="h-5 w-5" />
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
            {sent ? "Enquiry Received" : "One quick step"}
          </span>
        </span>

        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] md:text-3xl text-ink">
          {sent ? "Thanks — your project brief is in." : "Send it from your email"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted text-pretty">
          {sent
            ? `I review every brief myself and will reply within 24 hours. You can track your project status and upload brand media in your new client dashboard below.`
            : "Nothing captured that — this site has no database connected yet. Open the pre-filled email below and hit send; everything you typed is already in it."}
        </p>

        {accessCode ? (
          <div className="mt-8 rounded-2xl border border-line bg-mist/60 p-6 sm:p-8">
            <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              Your Private Dashboard Access Code
            </span>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <code className="chip3d rounded-xl border border-line bg-paper px-5 py-3 font-mono text-xl tracking-[0.16em] text-ink font-semibold shadow-sm">
                {accessCode}
              </code>
              <button
                type="button"
                onClick={copyCode}
                className="btn3d btn3d-light inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-medium text-ink"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied code" : "Copy code"}
              </button>
            </div>
            <p className="mt-4 max-w-2xl text-xs leading-relaxed text-muted text-pretty">
              Save this code. You can use it to sign in to your dashboard anytime to track build milestones,
              chat directly with Sawyer, review staging links, and upload your logos and images.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="btn3d btn3d-dark inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-paper"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to your client dashboard
              </Link>
            </div>
          </div>
        ) : null}

        {!sent ? (
          <a
            href={mailto}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            <Mail className="h-4 w-4" />
            Open the pre-filled email
          </a>
        ) : null}

        <div className="mt-10 border-t border-line pt-8">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Summary of your answers
          </p>
          <dl className="mt-5 divide-y divide-line/60">
            {answers
              .filter((answer) => (Array.isArray(answer.value) ? answer.value.length > 0 : answer.value.trim() !== ""))
              .map((answer) => (
                <div key={answer.name} className="py-3 grid gap-1 sm:grid-cols-[240px_1fr] sm:gap-6">
                  <dt className="text-xs font-mono text-muted uppercase tracking-wider">{answer.label}</dt>
                  <dd className="text-sm text-ink-soft font-medium">
                    {Array.isArray(answer.value) ? answer.value.join(", ") : answer.value}
                  </dd>
                </div>
              ))}
          </dl>
        </div>

        <button
          type="button"
          onClick={() => {
            setValues({});
            setStepIndex(0);
            setStatus("idle");
            setAccessCode("");
          }}
          className="mt-8 text-sm text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
        >
          Start another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (isLast) void submit();
        else goNext();
      }}
      className="surface w-full rounded-2xl border border-line bg-paper p-6 sm:p-10 md:p-12 lg:p-14 shadow-xl"
    >
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      {/* Steps Navigation Bar */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-line">
        <ol className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {STEPS.map((entry, index) => {
            const done = index < stepIndex;
            const current = index === stepIndex;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (index <= stepIndex) {
                      setErrors({});
                      setStepIndex(index);
                    }
                  }}
                  disabled={index > stepIndex}
                  aria-current={current ? "step" : undefined}
                  className={`flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] uppercase transition-all ${
                    current
                      ? "text-ink font-semibold"
                      : done
                      ? "text-ink-soft hover:text-ink cursor-pointer"
                      : "text-muted/50 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] transition-colors ${
                      current
                        ? "border-ink bg-ink text-paper font-bold shadow-xs"
                        : done
                        ? "border-ink text-ink font-medium"
                        : "border-line text-muted/60"
                    }`}
                  >
                    {done ? <Check className="h-3 w-3 stroke-[2.5]" /> : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="hidden sm:inline">{entry.title}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <span className="font-mono text-xs tracking-wider text-muted font-medium">
          Step {stepIndex + 1} of {STEPS.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-mist overflow-hidden rounded-full mt-3">
        <div
          className="h-full bg-ink transition-all duration-500 ease-out rounded-full"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step Header */}
      <div className="mt-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist border border-line text-warm">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="text-xl font-semibold tracking-[-0.03em] md:text-2xl text-ink">
            {step.title}
          </h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted text-pretty max-w-2xl">
          {step.description}
        </p>

        {/* Input Fields Grid with generous spacing */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-9">
          {step.fields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={values[field.name]}
              error={errors[field.name]}
              onChange={setValue}
              onToggle={toggleCheck}
            />
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink disabled:invisible"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous Step
        </button>

        <div className="flex flex-wrap items-center gap-4">
          <p className="font-mono text-[11px] tracking-wide text-muted">
            <span className="text-red-500">*</span> required question
          </p>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn3d btn3d-dark inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-medium text-paper shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending your brief…
              </>
            ) : isLast ? (
              <>
                Submit Brief
                <Send className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {status === "error" ? (
        <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{serverError}</p>
          <a
            href={mailto}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink underline decoration-line-strong underline-offset-4"
          >
            <Mail className="h-3.5 w-3.5" />
            Email it to me instead
          </a>
        </div>
      ) : null}
    </form>
  );
}

type ChipField = Extract<Field, { type: "radio" | "checks" }>;
type EntryField = Extract<Field, { type: "text" | "email" | "tel" | "date" | "textarea" }>;

function FieldRenderer({
  field,
  value,
  error,
  onChange,
  onToggle,
}: {
  field: Field;
  value: string | string[] | undefined;
  error?: string;
  onChange: (name: string, value: string | string[]) => void;
  onToggle: (name: string, option: string) => void;
}) {
  const isHalf = "half" in field && field.half === true;
  const colSpanClass = isHalf ? "col-span-1" : "col-span-1 md:col-span-2";

  return (
    <div className={colSpanClass}>
      {field.type === "radio" || field.type === "checks" ? (
        <ChoiceField field={field} value={value} error={error} onChange={onChange} onToggle={onToggle} />
      ) : (
        <EntryFieldControl field={field} value={value} error={error} onChange={onChange} />
      )}
    </div>
  );
}

/** Radio and checkbox chips with clear selected states and hints */
function ChoiceField({
  field,
  value,
  error,
  onChange,
  onToggle,
}: {
  field: ChipField;
  value: string | string[] | undefined;
  error?: string;
  onChange: (name: string, value: string | string[]) => void;
  onToggle: (name: string, option: string) => void;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const describedBy =
    [field.hint ? `hint-${field.name}` : "", error ? `error-${field.name}` : ""].filter(Boolean).join(" ") ||
    undefined;

  return (
    <fieldset id={`field-${field.name}`} aria-describedby={describedBy} className="space-y-3">
      <legend>
        <FieldLabel field={field} />
      </legend>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {field.options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={`group relative flex flex-col justify-between cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                isSelected
                  ? "border-ink bg-ink text-paper shadow-md scale-[1.01]"
                  : "border-line bg-paper hover:border-line-strong hover:bg-mist/50"
              }`}
            >
              <input
                type={field.type === "radio" ? "radio" : "checkbox"}
                name={field.name}
                value={option.value}
                checked={isSelected}
                onChange={() =>
                  field.type === "radio"
                    ? onChange(field.name, option.value)
                    : onToggle(field.name, option.value)
                }
                className="sr-only"
              />

              <div className="flex items-start justify-between gap-2">
                <span className={`text-sm font-medium ${isSelected ? "text-paper" : "text-ink"}`}>
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border text-[10px] transition-colors ${
                    isSelected
                      ? "border-paper bg-paper text-ink"
                      : "border-line-strong text-transparent group-hover:border-ink/40"
                  }`}
                >
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </span>
              </div>

              {option.hint ? (
                <span className={`mt-2 block text-xs leading-relaxed ${isSelected ? "text-paper/75" : "text-muted"}`}>
                  {option.hint}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>

      {field.hint ? (
        <p id={`hint-${field.name}`} className="text-xs text-muted pt-1">
          {field.hint}
        </p>
      ) : null}
      {error ? (
        <p id={`error-${field.name}`} role="alert" className="text-xs font-medium text-red-600 pt-1">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Single-line inputs and textareas */
function EntryFieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: EntryField;
  value: string | string[] | undefined;
  error?: string;
  onChange: (name: string, value: string | string[]) => void;
}) {
  const text = Array.isArray(value) ? "" : (value ?? "");
  const describedBy =
    [field.hint ? `hint-${field.name}` : "", error ? `error-${field.name}` : ""].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={`field-${field.name}`} className="block">
        <FieldLabel field={field} />
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={`field-${field.name}`}
          name={field.name}
          rows={field.rows ?? 3}
          value={text}
          placeholder={field.placeholder}
          aria-required={field.required === true}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={`${inputClasses} resize-y min-h-[96px]`}
        />
      ) : (
        <input
          id={`field-${field.name}`}
          name={field.name}
          type={field.type}
          value={text}
          placeholder={field.placeholder}
          aria-required={field.required === true}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={inputClasses}
        />
      )}

      {field.hint ? (
        <p id={`hint-${field.name}`} className="text-xs text-muted">
          {field.hint}
        </p>
      ) : null}
      {error ? (
        <p id={`error-${field.name}`} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FieldLabel({ field }: { field: Field }) {
  return (
    <span className="flex items-baseline gap-2 font-mono text-xs tracking-[0.14em] text-muted uppercase font-medium">
      {field.label}
      {field.required === true ? (
        <span aria-hidden="true" className="text-red-500">
          *
        </span>
      ) : null}
    </span>
  );
}
