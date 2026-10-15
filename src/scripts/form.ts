// Contact form: sends through Web3Forms. Without a key it opens the mail app with a ready message.
export function initForm() {
  const form = document.querySelector<HTMLFormElement>('#form');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('.form__status')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const { key, email, thanks } = form.dataset;

  function setStatus(text: string, kind: 'ok' | 'err' | '' = '') {
    status.textContent = text;
    status.dataset.kind = kind;
  }

  function firstProblem(): string | null {
    const f = form!.elements as any;
    if (!f.name.value.trim()) return 'Please enter your name.';
    if (!f.email.value.trim() || !f.email.checkValidity()) return 'Please enter a valid email so I can reply.';
    if (!f.message.value.trim()) return 'Please write a short message.';
    if (!f.consent.checked) return 'Please tick the consent box to send the message.';
    return null;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const problem = firstProblem();
    if (problem) return setStatus(problem, 'err');

    const data = new FormData(form);
    if (data.get('botcheck')) return; // spam
    const name = String(data.get('name'));
    const topic = String(data.get('topic'));
    const subject = `Website enquiry: ${topic}`;

    if (!key) {
      const body = `${data.get('message')}\n\n${name}\n${data.get('email')}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return setStatus('Your mail app opened with the message ready. Just press Send.', 'ok');
    }

    button.disabled = true;
    setStatus('Sending...');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: key,
          subject,
          from_name: name,
          name,
          email: data.get('email'),
          topic,
          message: data.get('message'),
          replyto: data.get('email'),
          botcheck: '',
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || res.statusText);
      form.reset();
      setStatus(thanks || 'Thank you, your message has been sent.', 'ok');
    } catch {
      setStatus(`Sorry, the message could not be sent. Please try again or write to ${email}.`, 'err');
    } finally {
      button.disabled = false;
    }
  });
}
