import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useLang } from '../../context/LanguageContext.jsx';
import { validateTelegramChatId } from '../../services/api.js';

function Section({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Toggle({ label, checked, onChange, help }) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <div>
        <div className="text-sm font-medium text-slate-900 dark:text-white">{label}</div>
        {help ? <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{help}</div> : null}
      </div>
      <input
        aria-label={label}
        type="checkbox"
        className="mt-1 h-5 w-5 accent-teal-600"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function uid() {
  return (globalThis.crypto?.randomUUID?.() || `id_${Math.random().toString(16).slice(2)}`).slice(0, 64);
}

export function Settings() {
  const { t } = useLang();
  const { lang, setLang, dark, setDark, careMode, setCareMode, settings, setSettings } = useApp();

  const recipients = settings.telegramRecipients || [];
  const contacts = settings.emergencyContacts || [];

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
    <main className="mx-auto max-w-4xl space-y-5 px-4 py-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t.settings}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.settings_subtitle}</p>
      </header>

      <Section title={t.language} description={t.language_help}>
        <div className="grid gap-2 sm:grid-cols-2">
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
                  ? 'border-teal-500 bg-teal-50 text-aegis-tealDark dark:border-teal-400 dark:bg-teal-900/20 dark:text-teal-200'
                  : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title={t.theme} description={t.theme_help}>
        <div className="space-y-3">
          <Toggle label={t.dark} checked={dark} onChange={setDark} help={t.dark_help} />
          <Toggle label={t.care_mode} checked={careMode} onChange={setCareMode} help={t.care_mode_help} />
        </div>
      </Section>

      <Section title={t.my_profile} description={t.my_profile_help}>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/profiles"
            className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            {t.edit_profile}
          </Link>
          <Link
            to="/history"
            className="inline-flex min-h-[44px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            {t.view_history}
          </Link>
        </div>
      </Section>

      <Section title={t.emergency_contacts} description={t.emergency_contacts_help}>
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {t.empty_contacts}
            </div>
          ) : (
            <div className="grid gap-3">
              {contacts
                .slice()
                .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))
                .map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {c.name || t.unnamed_contact}
                          {c.primary ? (
                            <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">
                              {t.primary}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          {(c.relationship || t.relationship_unknown) + (c.phone ? ` • ${c.phone}` : '')}
                          {c.chatId ? ` • Telegram: ${c.chatId}` : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <input
                            type="checkbox"
                            checked={c.enabled !== false}
                            onChange={(e) => {
                              setSettings({
                                ...settings,
                                emergencyContacts: contacts.map((x) =>
                                  x.id === c.id ? { ...x, enabled: e.target.checked } : x,
                                ),
                              });
                            }}
                          />
                          {t.receive_sos}
                        </label>
                        <button
                          type="button"
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                          onClick={() =>
                            setSettings({ ...settings, emergencyContacts: contacts.filter((x) => x.id !== c.id) })
                          }
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
            className="min-h-[44px] w-full rounded-2xl bg-aegis-teal px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
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
              setSettings({ ...settings, emergencyContacts: [...contacts, next] });
            }}
          >
            {t.add_contact}
          </button>
        </div>

        {contacts.length > 0 ? (
          <div className="mt-4 space-y-3">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{t.edit_last_contact}</div>
            {(() => {
              const c = contacts[contacts.length - 1];
              return (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm">
                    <span className="text-xs text-slate-600 dark:text-slate-400">{t.full_name}</span>
                    <input
                      value={c.name || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emergencyContacts: contacts.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)),
                        })
                      }
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-xs text-slate-600 dark:text-slate-400">{t.relationship}</span>
                    <input
                      value={c.relationship || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emergencyContacts: contacts.map((x) =>
                            x.id === c.id ? { ...x, relationship: e.target.value } : x,
                          ),
                        })
                      }
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-xs text-slate-600 dark:text-slate-400">{t.phone}</span>
                    <input
                      value={c.phone || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emergencyContacts: contacts.map((x) => (x.id === c.id ? { ...x, phone: e.target.value } : x)),
                        })
                      }
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="text-xs text-slate-600 dark:text-slate-400">{t.telegram_chat_id}</span>
                    <input
                      value={c.chatId || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emergencyContacts: contacts.map((x) =>
                            x.id === c.id ? { ...x, chatId: e.target.value, _status: '' } : x,
                          ),
                        })
                      }
                      className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </label>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                      onClick={async () => {
                        const res = await validate(c.chatId);
                        setSettings({
                          ...settings,
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
                      className="min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          emergencyContacts: contacts.map((x) => ({
                            ...x,
                            primary: x.id === c.id,
                          })),
                        })
                      }
                    >
                      {t.set_primary}
                    </button>
                    {c._status ? (
                      <span className="text-xs text-slate-600 dark:text-slate-400">{c._status}</span>
                    ) : null}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : null}
      </Section>

      <Section title={t.telegram_recipients} description={t.telegram_recipients_help}>
        <div className="space-y-3">
          {recipients.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {t.empty_telegram}
            </div>
          ) : (
            <div className="grid gap-3">
              {recipients.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{r.name || t.unnamed_recipient}</div>
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
                            setSettings({
                              ...settings,
                              telegramRecipients: recipients.map((x) =>
                                x.id === r.id ? { ...x, enabled: e.target.checked } : x,
                              ),
                            })
                          }
                        />
                        {t.receive_sos}
                      </label>
                      <button
                        type="button"
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                        onClick={() =>
                          setSettings({ ...settings, telegramRecipients: recipients.filter((x) => x.id !== r.id) })
                        }
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
            className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
            onClick={() => {
              const next = { id: uid(), name: '', chatId: '', enabled: true, _status: '' };
              setSettings({ ...settings, telegramRecipients: [...recipients, next] });
            }}
          >
            {t.add_telegram}
          </button>

          {recipients.length > 0 ? (
            <div className="mt-4 space-y-3">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{t.edit_last_recipient}</div>
              {(() => {
                const r = recipients[recipients.length - 1];
                return (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-sm">
                      <span className="text-xs text-slate-600 dark:text-slate-400">{t.full_name}</span>
                      <input
                        value={r.name || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            telegramRecipients: recipients.map((x) =>
                              x.id === r.id ? { ...x, name: e.target.value } : x,
                            ),
                          })
                        }
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </label>
                    <label className="text-sm">
                      <span className="text-xs text-slate-600 dark:text-slate-400">{t.telegram_chat_id}</span>
                      <input
                        value={r.chatId || ''}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            telegramRecipients: recipients.map((x) =>
                              x.id === r.id ? { ...x, chatId: e.target.value, _status: '' } : x,
                            ),
                          })
                        }
                        className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </label>
                    <div className="sm:col-span-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="min-h-[44px] rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                        onClick={async () => {
                          const res = await validate(r.chatId);
                          setSettings({
                            ...settings,
                            telegramRecipients: recipients.map((x) =>
                              x.id === r.id ? { ...x, _status: res.ok ? t.telegram_valid : res.description || t.telegram_invalid } : x,
                            ),
                          });
                        }}
                      >
                        {t.validate}
                      </button>
                      {r._status ? (
                        <span className="text-xs text-slate-600 dark:text-slate-400">{r._status}</span>
                      ) : null}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : null}
        </div>
      </Section>

      <Section title={t.privacy_permissions} description={t.privacy_permissions_help}>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          {t.permissions_note}
        </div>
      </Section>
    </main>
  );
}

