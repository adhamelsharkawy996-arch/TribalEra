# brag plan: Nora offer reel (NoraOffer composition)

Built with /brag-slim rules (Opus 5.5 path), rendered in Remotion instead of Hyperframes so the
existing WhatsApp chat components could be reused ("show the thing").

- **What it is:** Nora, Project Alpha Tech's WhatsApp AI assistant, takes a client from first message to a live website.
- **Who it's for:** Egyptian small businesses that want a website fast without meetings.
- **What sets it apart:** everything happens in one WhatsApp chat; prototype in hours, full site the same day after payment.
- **Most impressive claim:** 5-page site, 1 year free hosting + security + unlimited WhatsApp edits; landing page 1,500 EGP.
- **Hook:** "نورا بقت أقوى 💪" with a slam in the first second.
- **Tone:** chaotic-leaning default: fast cuts, loud type, but every line held long enough to read.
- **Format:** vertical 1080×1920, 30fps, 25.0s. Poster (price card) baked as frame 0.

## Storyboard
| # | Time | Beat | On screen | Voiceover (Nora, eleven_v3) | SFX |
|---|---|---|---|---|---|
| 1 | 0–2.5s | Hook | Nora logo power-up ring, "نورا بقت أقوى 💪" | نورا بقت أقوى من الأول! | slam, glitch |
| 2 | 2.5–8s | Gather | Chat with Nora: business, colours, "ابدأ 🚀" | ابعتلها على واتساب، وهي تفهم البيزنس بتاعك كله، وتقولها: ابدأ! | send / receive pops |
| 3 | 8–11s | Prototype | "البروتوتايب في ساعات", prototype card in chat | وفي ساعات، البروتوتايب عندك! | ding |
| 4 | 11–14.5s | Same day | "تم الدفع ✅", five pages fan out, "🔥 في نفس اليوم" | وبعد الدفع، موقعك كامل، في نفس اليوم! | ding, ticks, slam |
| 5 | 14.5–21.5s | Offer | "🔥 عرض من النهارده" checklist, then 1,500 ج price card | عرض من النهارده! موقع خمس صفحات، واستضافة وحماية وتعديلات مجانًا لمدة سنة. واللاندينج بيدج بألف وخمسمية جنيه بس! | ticks, slam, ding |
| 6 | 21.5–25s | CTA | Logo, "كلّم نورا على واتساب", 01515962796 | كلّم نورا دلوقتي على واتساب! | slam |

## Audio
- Current music: `public/audio/nora-offer/beat.mp3`, an original royalty-free beat synthesized by `scripts/beat.py` (128 BPM, D Hijaz), hits at 0s / 16s / 21.5s / 26s.
- Voice + music: ElevenLabs via `node scripts/audio.mjs --reel nora-offer` (voice "Nora", `eleven_v3`, 26s instrumental).
- SFX: Kenney UI sounds (CC0) bundled with the brag skill, in `public/sfx/`.
- Until ElevenLabs audio exists, the render falls back to a local placeholder track if `public/audio/placeholder-music.mp3` is present
  (brag's bundled ende.app track: its license is unverified, so it is git-ignored and must not ship in a published post).
