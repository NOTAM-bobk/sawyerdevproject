"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Mail, Send } from "lucide-react";
import { SketchCheck, SketchSparkle } from "@/components/doodles";
import { projectForm, type Field } from "@/content/form";
import { site } from "@/content/site";
import { enquiryText, isValidEmail, type Answer } from "@/lib/enquiry";

type Values = Record<string, string | string[]>;
type Status = "idle" | "submitting" | "sent" | "fallback" | "error";

const STEPS = projectForm.steps;

const inputClasses =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink transition-colors placeholder:text-muted/60 hover:border-line-strong focus:border-ink focus:outline-none";

export function ProjectForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [company, setCompany] = useState(""); // honeypot — never shown to a human

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const answers = useMemo<Answer[]>(
    () =>
      STEPS.flatMap((entry) => entry.fields).map((field) => {
        const raw = values[field.name] ?? (field.type === "checks" ? [] : "");
        // Choice fields hold option values; show the labels a person actually picked.
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
        found[field.name] = "This one is needed.";
        continue;
      }
      if (field.type === "email" && typeof value === "string" && value.trim() && !isValidEmail(value)) {
        found[field.name] = "That email doesn't look right.";
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
        | { ok?: boolean; configured?: boolean; error?: string }
        | null;

      if (response.ok && data?.ok) {
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

  /* ---------------------------------------------------------------- sent ---- */

  if (status === "sent" || status === "fallback") {
    const sent = status === "sent";

    return (
      <div className="rounded-2xl border border-line bg-paper p-8 md:p-10">
        <span className="inline-flex items-center gap-2 text-ink">
          <SketchCheck className="h-5 w-5" />
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
            {sent ? "Enquiry sent" : "One quick step"}
          </span>
        </span>

        <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
          {sent ? "Thanks — that landed." : "Send it from your own email"}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted text-pretty">
          {sent
            ? `I read every enquiry myself and usually reply within a day. If you need to add anything, just reply to ${site.email}.`
            : "Email delivery isn't switched on for this site yet, so nothing was submitted. Open the pre-filled email below and hit send — everything you typed is already in it."}
        </p>

        {!sent ? (
          <a
            href={mailto}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            <Mail className="h-4 w-4" />
            Open the pre-filled email
          </a>
        ) : null}

        <div className="mt-8 border-t border-line pt-6">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            What you told me
          </p>
          <dl className="mt-4 space-y-3">
            {answers
              .filter((answer) => (Array.isArray(answer.value) ? answer.value.length > 0 : answer.value.trim() !== ""))
              .map((answer) => (
                <div key={answer.name} className="grid gap-1 sm:grid-cols-[220px_1fr] sm:gap-4">
                  <dt className="text-xs text-muted">{answer.label}</dt>
                  <dd className="text-sm text-ink-soft">
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
          }}
          className="mt-8 text-sm text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
        >
          Start another enquiry
        </button>
      </div>
    );
  }

  /* ---------------------------------------------------------------- form ---- */

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (isLast) void submit();
        else goNext();
      }}
      className="rounded-2xl border border-line bg-paper p-6 md:p-9"
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

      {/* Progress */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ol className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
                  className={`flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors ${
                    current ? "text-ink" : done ? "text-ink-soft hover:text-ink" : "text-muted/60"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                      current ? "border-ink bg-ink text-paper" : done ? "border-ink text-ink" : "border-line"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="hidden sm:inline">{entry.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <span className="font-mono text-[11px] tracking-wide whitespace-nowrap text-muted">
          Step {stepIndex + 1} of {STEPS.length}
        </span>
      </div>

      <div className="mt-4 h-px w-full bg-line">
        <div
          className="h-full bg-ink transition-all duration-500"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step body */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          <SketchSparkle className="h-4 w-4 text-ink" delay={150} />
          {step.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{step.description}</p>

        <div className="mt-8 space-y-8">
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

      {/* Footer actions */}
      <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink disabled:invisible"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-wrap items-center gap-4">
          <p className="font-mono text-[11px] tracking-wide text-muted">
            <span className="text-red-600">*</span> required
          </p>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : isLast ? (
              <>
                Send enquiry
                <Send className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
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
  if (field.type === "radio" || field.type === "checks") {
    return <ChoiceField field={field} value={value} error={error} onChange={onChange} onToggle={onToggle} />;
  }
  return <EntryFieldControl field={field} value={value} error={error} onChange={onChange} />;
}

/** Radio and checkbox chips. */
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
  const hasHints = field.options.some((option) => option.hint);
  const describedBy =
    [field.hint ? `hint-${field.name}` : "", error ? `error-${field.name}` : ""].filter(Boolean).join(" ") ||
    undefined;

  return (
    <fieldset id={`field-${field.name}`} aria-describedby={describedBy}>
      <legend className="mb-3">
        <FieldLabel field={field} />
      </legend>

      <div className={hasHints ? "grid gap-3 sm:grid-cols-2" : "flex flex-wrap gap-2"}>
        {field.options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border px-4 py-3 transition-all duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
                isSelected
                  ? "border-ink bg-ink text-paper shadow-[0_6px_20px_-12px_rgba(0,0,0,0.6)]"
                  : "border-line bg-paper hover:border-line-strong"
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
              <span className="block text-sm font-medium">{option.label}</span>
              {option.hint ? (
                <span className={`mt-1 block text-xs ${isSelected ? "text-paper/70" : "text-muted"}`}>
                  {option.hint}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>

      {field.hint ? (
        <p id={`hint-${field.name}`} className="mt-3 text-xs text-muted">
          {field.hint}
        </p>
      ) : null}
      {error ? (
        <p id={`error-${field.name}`} role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Single-line inputs and textareas. */
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
  const isHalf = "half" in field && field.half === true;

  return (
    <div className={isHalf ? "sm:inline-block sm:w-[calc(50%-0.75rem)] sm:align-top" : ""}>
      <label htmlFor={`field-${field.name}`} className="mb-3 block">
        <FieldLabel field={field} />
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={`field-${field.name}`}
          name={field.name}
          rows={field.rows ?? 4}
          value={text}
          placeholder={field.placeholder}
          aria-required={field.required === true}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={`${inputClasses} resize-y`}
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
        <p id={`hint-${field.name}`} className="mt-2 text-xs text-muted">
          {field.hint}
        </p>
      ) : null}
      {error ? (
        <p id={`error-${field.name}`} role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FieldLabel({ field }: { field: Field }) {
  return (
    <span className="flex items-baseline gap-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
      {field.label}
      {field.required === true ? (
        <>
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
          <span className="sr-only">(required)</span>
        </>
      ) : null}
    </span>
  );
}
