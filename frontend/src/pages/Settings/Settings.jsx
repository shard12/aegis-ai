import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import { validateTelegramChatId } from '../../services/api.js';
import { GlassPanel } from '../../components/dashboard/GlassPanel.jsx';

function Section({ title, description, children }) {
  return (
    <GlassPanel title={title} subtitle={description}>
      {children}
    </GlassPanel>
  );
}

function Toggle({ label, checked, onChange, help }) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <div>
        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</div>
        {help ? <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{help}</div> : null}
      </div>
      <input
        aria-label={label}
        type="checkbox"
        className="mt-1 h-5 w-5 accent-teal-500"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function uid() {
  return (globalThis.crypto?.randomUUID?.() || `id_${Math.random().toString(16).slice(2)}`).slice(0, 64);
}

function isValidPhone(value) {
  const v = String(value || '').trim();
  return v.length >= 7 && /^[0-9+\-\s()]+$/.test(v);
}

export function Settings() {
  const { t } = useLang();
  const { lang, setLang, dark, setDark, careMode, setCareMode, settings, setSettings } = useApp();

  const recipients = settings.telegramRecipients || [];
  const contacts = settings.emergencyContacts || [];

  const accessibility = settings.accessibility || {};
  const notifications = settings.notifications || {};

  function patchSettings(patch) {
    setSettings({ ...settings, ...patch });
  }

  async function validate(chatId) {
    const id = String(chatId || '').trim();
    if (!id) return { ok: false, description: t.telegram_invalid };
    try {
      const res = await validateTelegramChatId({ chat_id: id });
      return res;
    } catch (e) {
      return { ok: false, description: e.message || 'Validation failed' };
    }
  }

  return (
    <main className="app-page max-w-6xl space-y-5">
      <header className="animated-border rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl dark:border-cyan-300/20 dark:bg-slate-900/75">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{t.settings}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings_subtitle}</p>
      </header>

      <Section title={t.language} description={t.language_help}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिन्दी' },
            { id: 'kn', label: 'ಕನ್ನಡ' },
            { id: 'zh', label: '中文（普通话）' },
            { id: 'ja', label: '日本語' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setLang(opt.id)}
              className={`min-h-[52px] rounded-2xl border px-4 text-left text-sm font-medium transition ${
                lang === opt.id
                  ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-800 dark:text-cyan-100'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t.theme} description={t.theme_help}>
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle label={t.dark} checked={dark} onChange={setDark} help={t.dark_help} />
          <Toggle label={t.care_mode} checked={careMode} onChange={setCareMode} help={t.care_mode_help} />
        </div>
      </Section>

      <Section title={t.accessibility || 'Accessibility'} description={t.accessibility_help || 'Improve readability and interaction comfort.'}>
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle
            label={t.large_text || 'Large text'}
            checked={!!accessibility.largeText}
            onChange={(v) => patchSettings({ accessibility: { ...accessibility, largeText: v } })}
          />
          <Toggle
            label={t.reduce_motion || 'Reduce motion'}
            checked={!!accessibility.reduceMotion}
            onChange={(v) => patchSettings({ accessibility: { ...accessibility, reduceMotion: v } })}
          />
          <Toggle
            label={t.high_contrast || 'High contrast'}
            checked={!!accessibility.highContrast}
            onChange={(v) => patchSettings({ accessibility: { ...accessibility, highContrast: v } })}
          />
        </div>
      </Section>

      <Section title={t.notification_preferences || 'Notification preferences'} description={t.notification_preferences_help || 'Control alert behavior during emergencies.'}>
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle
            label={t.quiet_mode || 'Quiet mode'}
            checked={!!notifications.quietMode}
            onChange={(v) => patchSettings({ notifications: { ...notifications, quietMode: v } })}
          />
          <Toggle
            label={t.vibration || 'Vibration'}
            checked={notifications.vibration !== false}
            onChange={(v) => patchSettings({ notifications: { ...notifications, vibration: v } })}
          />
        </div>
      </Section>

      <Section title={t.my_profile} description={t.my_profile_help}>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/profiles" className="app-btn-secondary">
            {t.edit_profile}
          </Link>
          <Link to="/history" className="app-btn-secondary">
            {t.view_history}
          </Link>
        </div>
      </Section>

      <Section title={t.emergency_contacts} description={t.emergency_contacts_help}>
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <div className="rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{t.empty_contacts}</div>
          ) : (
            <div className="grid gap-3">
              {contacts
                .slice()
                .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
                .map((c) => (
                  <div key={c.id} className="rounded-2xl border border-slate-300 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {c.name || t.unnamed_contact}
                          {c.primary ? <span className="ml-2 rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-200">{t.primary}</span> : null}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          {(c.relationship || t.relationship_unknown) + (c.phone ? ` • ${c.phone}` : '')}
                          {c.chatId ? ` • Telegram: ${c.chatId}` : ''}
                          {c.phone && !isValidPhone(c.phone) ? ` • ${t.invalid_phone || 'Invalid phone format'}` : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <input
                            type="checkbox"
                            checked={c.enabled !== false}
                            onChange={(e) =>
                              patchSettings({
                                emergencyContacts: contacts.map((x) => (x.id === c.id ? { ...x, enabled: e.target.checked } : x)),
                              })
                            }
                          />
                          {t.receive_sos}
                        </label>
                        <button
                          type="button"
                          className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                          onClick={() => patchSettings({ emergencyContacts: contacts.filter((x) => x.id !== c.id) })}
                        >
                          {t.remove}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <button
            type="button"
            className="app-btn-primary w-full"
            onClick={() => {
              const next = {
                id: uid(),
                name: '',
                relationship: '',
                phone: '',
                chatId: '',
                enabled: true,
                primary: contacts.length === 0,
                priority: contacts.length + 1,
                _status: '',
              };
              patchSettings({ emergencyContacts: [...contacts, next] });
            }}
          >
            {t.add_contact}
          </button>
        </div>
      </Section>

      <Section title={t.telegram_recipients} description={t.telegram_recipients_help}>
        <div className="space-y-3">
          {recipients.length === 0 ? (
            <div className="rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{t.empty_telegram}</div>
          ) : (
            <div className="grid gap-3">
              {recipients.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-300 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.name || t.unnamed_recipient}</div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {r.chatId ? `Telegram: ${r.chatId}` : t.telegram_chat_id_required}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={r.enabled !== false}
                          onChange={(e) =>
                            patchSettings({
                              telegramRecipients: recipients.map((x) => (x.id === r.id ? { ...x, enabled: e.target.checked } : x)),
                            })
                          }
                        />
                        {t.receive_sos}
                      </label>
                      <button
                        type="button"
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
                        onClick={() => patchSettings({ telegramRecipients: recipients.filter((x) => x.id !== r.id) })}
                      >
                        {t.remove}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="app-btn-secondary w-full"
            onClick={() => patchSettings({ telegramRecipients: [...recipients, { id: uid(), name: '', chatId: '', enabled: true, _status: '' }] })}
          >
            {t.add_telegram}
          </button>
        </div>
      </Section>

      <Section title={t.quick_edit || 'Quick edit newest entries'}>
        <div className="grid gap-4 lg:grid-cols-2">
          {contacts.length > 0 ? (
            <div className="rounded-2xl border border-slate-300 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{t.edit_last_contact}</div>
              {(() => {
                const c = contacts[contacts.length - 1];
                return (
                  <div className="space-y-2">
                    <input
                      value={c.name || ''}
                      onChange={(e) =>
                        patchSettings({
                          emergencyContacts: contacts.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)),
                        })
                      }
                      className="app-input"
                      placeholder={t.full_name}
                    />
                    <input
                      value={c.relationship || ''}
                      onChange={(e) =>
                        patchSettings({
                          emergencyContacts: contacts.map((x) => (x.id === c.id ? { ...x, relationship: e.target.value } : x)),
                        })
                      }
                      className="app-input"
                      placeholder={t.relationship}
                    />
                    <input
                      value={c.phone || ''}
                      onChange={(e) =>
                        patchSettings({
                          emergencyContacts: contacts.map((x) => (x.id === c.id ? { ...x, phone: e.target.value } : x)),
                        })
                      }
                      className="app-input"
                      placeholder={t.phone}
                    />
                    <input
                      value={c.chatId || ''}
                      onChange={(e) =>
                        patchSettings({
                          emergencyContacts: contacts.map((x) => (x.id === c.id ? { ...x, chatId: e.target.value, _status: '' } : x)),
                        })
                      }
                      className="app-input"
                      placeholder={t.telegram_chat_id}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="app-btn-secondary"
                        onClick={async () => {
                          const res = await validate(c.chatId);
                          patchSettings({
                            emergencyContacts: contacts.map((x) =>
                              x.id === c.id ? { ...x, _status: res.ok ? t.telegram_valid : res.description || t.telegram_invalid } : x,
                            ),
                          });
                        }}
                      >
                        {t.validate}
                      </button>
                      <button
                        type="button"
                        className="app-btn-secondary"
                        onClick={() => patchSettings({ emergencyContacts: contacts.map((x) => ({ ...x, primary: x.id === c.id })) })}
                      >
                        {t.set_primary}
                      </button>
                    </div>
                    {c._status ? <p className="text-xs text-slate-600 dark:text-slate-400">{c._status}</p> : null}
                  </div>
                );
              })()}
            </div>
          ) : null}

          {recipients.length > 0 ? (
            <div className="rounded-2xl border border-slate-300 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{t.edit_last_recipient}</div>
              {(() => {
                const r = recipients[recipients.length - 1];
                return (
                  <div className="space-y-2">
                    <input
                      value={r.name || ''}
                      onChange={(e) =>
                        patchSettings({ telegramRecipients: recipients.map((x) => (x.id === r.id ? { ...x, name: e.target.value } : x)) })
                      }
                      className="app-input"
                      placeholder={t.full_name}
                    />
                    <input
                      value={r.chatId || ''}
                      onChange={(e) =>
                        patchSettings({
                          telegramRecipients: recipients.map((x) => (x.id === r.id ? { ...x, chatId: e.target.value, _status: '' } : x)),
                        })
                      }
                      className="app-input"
                      placeholder={t.telegram_chat_id}
                    />
                    <button
                      type="button"
                      className="app-btn-secondary"
                      onClick={async () => {
                        const res = await validate(r.chatId);
                        patchSettings({
                          telegramRecipients: recipients.map((x) =>
                            x.id === r.id ? { ...x, _status: res.ok ? t.telegram_valid : res.description || t.telegram_invalid } : x,
                          ),
                        });
                      }}
                    >
                      {t.validate}
                    </button>
                    {r._status ? <p className="text-xs text-slate-600 dark:text-slate-400">{r._status}</p> : null}
                  </div>
                );
              })()}
            </div>
          ) : null}
        </div>
      </Section>

      <Section title={t.privacy_permissions} description={t.privacy_permissions_help}>
        <div className="rounded-2xl border border-slate-300 bg-white p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{t.permissions_note}</div>
      </Section>
    </main>
  );
}

