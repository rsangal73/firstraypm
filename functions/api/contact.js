export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { fname, lname, email, phone, property, inquiry, message } = body;

    if (!fname || !email || !message) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const inquiryLabel = { owner: 'Property Owner', prospective: 'Prospective Tenant', other: 'Other' }[inquiry] || inquiry;

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1B2C5E;padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:#C8972A;margin:0">New Contact Form Submission</h2>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0">First Ray Property Management</p>
        </div>
        <div style="background:#f8f9fc;padding:32px;border-radius:0 0 8px 8px;border:1px solid #eee">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:140px">Name</td><td style="padding:8px 0;font-weight:600">${fname} ${lname || ''}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>` : ''}
            ${property ? `<tr><td style="padding:8px 0;color:#666">Property</td><td style="padding:8px 0">${property}</td></tr>` : ''}
            ${inquiryLabel ? `<tr><td style="padding:8px 0;color:#666">I am a</td><td style="padding:8px 0">${inquiryLabel}</td></tr>` : ''}
          </table>
          <div style="margin-top:24px;padding:16px;background:white;border-radius:6px;border:1px solid #e0e4ef">
            <p style="color:#666;margin:0 0 8px;font-size:13px">MESSAGE</p>
            <p style="margin:0;line-height:1.6">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'First Ray PM Website <noreply@firstraypm.com>',
        to: ['contact@firstraypm.com'],
        reply_to: email,
        subject: `New Inquiry from ${fname} ${lname || ''} — First Ray Property Management`,
        html
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
