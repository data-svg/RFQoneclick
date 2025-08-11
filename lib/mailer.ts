// Minimal mailer stub for MVP. If RESEND_API_KEY is set, you can integrate Resend here.
// For now we just log the invite payload and resolve.
export async function sendInviteEmail(opts: { to: string; rfqTitle: string; inviteUrl: string }) {
  console.log("[mailer] sendInviteEmail ->", opts);
  return { ok: true };
}
