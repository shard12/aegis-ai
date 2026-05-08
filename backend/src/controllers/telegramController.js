export async function validate(req, res, next) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = String(req.body?.chat_id || '').trim();
    if (!token) {
      const err = new Error('Telegram bot token not configured on server');
      err.status = 400;
      throw err;
    }
    if (!chat_id) {
      const err = new Error('chat_id is required');
      err.status = 400;
      throw err;
    }

    const url = `https://api.telegram.org/bot${token}/getChat`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id }),
    });
    const data = await resp.json().catch(() => ({}));
    if (data?.ok !== true) {
      res.json({ ok: false, description: data?.description || 'Invalid chat_id or bot cannot access the chat.' });
      return;
    }
    const chat = data.result || {};
    res.json({
      ok: true,
      chat: {
        id: chat.id,
        type: chat.type,
        title: chat.title,
        username: chat.username,
      },
    });
  } catch (e) {
    next(e);
  }
}

