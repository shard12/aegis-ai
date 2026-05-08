import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SymptomInput } from '../../components/SymptomInput/SymptomInput.jsx';
import { FollowUpQuestions } from '../../components/FollowUpQuestions/FollowUpQuestions.jsx';
import { RiskMeter } from '../../components/RiskMeter/RiskMeter.jsx';
import { FirstAidCards } from '../../components/FirstAidCards/FirstAidCards.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { analyzeTriage, triggerEmergency } from '../../services/api.js';
import { hasOfflineRedFlag } from '../../utils/triageRules.js';
import { useVoice } from '../../hooks/useVoice.js';
import { buildFirstAidCards } from '../../utils/clientFirstAid.js';

function StepPill({ active, done, children }) {
  const base = 'rounded-full px-3 py-1 text-xs font-semibold';
  if (active) return <span className={`${base} bg-teal-50 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200`}>{children}</span>;
  if (done) return <span className={`${base} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`}>{children}</span>;
  return <span className={`${base} bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400`}>{children}</span>;
}

export function Triage() {
  const { t, lang: langCode } = useLang();
  const { profile, bystander, careMode, setTriageSession } = useApp();
  const loc = useLocation();
  const nav = useNavigate();
  const voiceLang =
    langCode === 'hi'
      ? 'hi-IN'
      : langCode === 'kn'
        ? 'kn-IN'
        : langCode === 'zh'
          ? 'zh-CN'
          : langCode === 'ja'
            ? 'ja-JP'
            : 'en-IN';
  const { speak } = useVoice(voiceLang);
  const { listen, listening, stop } = useVoice(voiceLang);

  // 0: intake, 1: follow-ups, 2: results
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('');
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [firstAid, setFirstAid] = useState(null);
  const [offlineWarn, setOfflineWarn] = useState(false);
  const [error, setError] = useState('');
  const [followUps, setFollowUps] = useState([]);

  useEffect(() => {
    if (loc.state?.preset) setMessage(loc.state.preset);
  }, [loc.state]);

  useEffect(() => {
    if (message && hasOfflineRedFlag(message)) setOfflineWarn(true);
    else setOfflineWarn(false);
  }, [message]);

  const context = {
    profileName: profile.profileName,
    age: profile.age,
    gender: profile.gender,
    allergies: profile.allergies,
    notes: profile.notes,
    emergencyNotes: profile.emergencyNotes || '',
    previousMessages: [],
  };

  const micButton = useMemo(() => {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={t.mic}
          disabled={loading || listening}
          onClick={async () => {
            setError('');
            try {
              const text = await listen();
              setMessage((m) => (m ? `${m}\n${text}` : text));
            } catch (e) {
              setError(e.message || t.voice_not_supported);
            }
          }}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <span aria-hidden="true">🎙️</span>
        </button>
        {listening ? (
          <button type="button" onClick={stop} className="text-xs font-semibold text-slate-600 underline dark:text-slate-300">
            {t.stop}
          </button>
        ) : null}
      </div>
    );
  }, [listen, listening, loading, stop, t]);

  async function runAnalyze(followUpText = '') {
    setLoading(true);
    setError('');
    try {
      const body = {
        message: `${message}\n${followUpText}`.trim(),
        context: {
          ...context,
          lastMessage: message,
          symptoms: followUpText,
        },
      };
      const data = await analyzeTriage(body);
      setResult(data);
      setTriageSession(data);

      const fa = buildFirstAidCards(data.risk_level, data.critical_labels || []);
      setFirstAid(fa);

      if (data.risk_level === 'CRITICAL' || data.emergency_triggered) {
        speak(data.suggested_response?.slice(0, 280) || 'Emergency priority. Call emergency services.');
      }

      const qs = Array.isArray(data.follow_up_questions) ? data.follow_up_questions.filter(Boolean) : [];
      if (followUpText.trim() || qs.length === 0 || data.risk_level === 'CRITICAL') {
        setFollowUps([]);
        setStep(2);
      } else {
        setFollowUps(qs.slice(0, 4));
        setAnswers(Array(qs.slice(0, 4).length).fill(''));
        setStep(1);
      }
    } catch (e) {
      setError(e.message || t.triage_failed);
      setStep(2);
      setResult({
        risk_level: offlineWarn ? 'CRITICAL' : 'MEDIUM',
        confidence: 0.5,
        why_risk: 'Offline fallback — verify with clinician.',
        suggested_response: 'Unable to reach AI engine. If symptoms are severe, call emergency services.',
        medical_summary: message,
        possible_concerns: ['unverified'],
        emergency_triggered: offlineWarn,
        intent: 'Symptom Check',
        recommended_action: 'Seek professional care.',
        critical_labels: offlineWarn ? ['offline_red_flag'] : [],
      });
      setFirstAid(buildFirstAidCards(offlineWarn ? 'CRITICAL' : 'MEDIUM', offlineWarn ? ['default'] : []));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link className="text-aegis-teal underline" to="/">
          {t.home}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <StepPill active={step === 0} done={step > 0}>
            {t.triage_step_intake}
          </StepPill>
          <StepPill active={step === 1} done={step > 1}>
            {t.triage_step_questions}
          </StepPill>
          <StepPill active={step === 2} done={false}>
            {t.triage_step_results}
          </StepPill>
        </div>
      </div>

      {offlineWarn && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          {t.red_flag_warning}
        </div>
      )}

      {step === 0 && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {bystander ? t.triage_helper_title : t.triage_title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t.triage_helper_text}</p>
            <div className="mt-4">
              <SymptomInput
                large={careMode}
                value={message}
                onChange={setMessage}
                placeholder={t.symptom_placeholder}
                micButton={micButton}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.triage_privacy_hint}</div>
                <button
                  type="button"
                  disabled={!message.trim() || loading}
                  onClick={() => runAnalyze('')}
                  className="min-h-[48px] rounded-2xl bg-aegis-teal px-6 font-semibold text-white shadow-sm hover:bg-aegis-tealDark disabled:opacity-50"
                >
                  {loading ? t.analyzing : t.continue}
                </button>
              </div>
              {error ? (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                  {error}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <FollowUpQuestions
          questions={followUps}
          answers={answers}
          onChange={setAnswers}
          loading={loading}
          onSubmit={() => runAnalyze(answers.filter(Boolean).join('. '))}
        />
      )}

      {step >= 2 && result && (
        <div className="space-y-8">
          <RiskMeter level={result.risk_level} confidence={result.confidence} why={result.why_risk} />
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{t.summary}</p>
              <p className="text-xs text-slate-500">
                {t.intent}: <span className="font-semibold text-slate-700 dark:text-slate-200">{result.intent}</span>
              </p>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{result.medical_summary}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{result.suggested_response}</p>
            <p className="mt-3 text-sm font-medium text-aegis-tealDark">{result.recommended_action}</p>
          </div>
          <FirstAidCards firstAid={firstAid} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  await triggerEmergency({
                    sos_manual: true,
                    message,
                    context,
                    triage: result,
                  });
                } catch {
                  /* */
                } finally {
                  setLoading(false);
                }
                nav('/emergency', { state: { triage: result } });
              }}
              className="flex-1 rounded-2xl bg-aegis-alert py-4 font-bold text-white"
            >
              {t.open_sos}
            </button>
            <button
              type="button"
              onClick={() => nav('/reports', { state: { triage: result } })}
              className="flex-1 rounded-2xl border border-slate-300 py-4 font-semibold dark:border-slate-600"
            >
              {t.generate_report}
            </button>
            <button
              type="button"
              onClick={() => nav('/hospitals')}
              className="flex-1 rounded-2xl border border-slate-300 py-4 font-semibold dark:border-slate-600"
            >
              {t.hospitals}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
