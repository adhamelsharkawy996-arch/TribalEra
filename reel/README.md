# Project Alpha Tech — Facebook reels

Two compositions: `AlphaTechReel` (35s product reel) and `NoraOffer` (25s "Nora got stronger" launch-offer reel, planned with the brag skill: see `brag-output/`).

Vertical 1080×1920, 30fps, 35s reel built with [Remotion](https://remotion.dev). Voiceover and music come from ElevenLabs via `scripts/audio.mjs`; without them the video renders silent.

```bash
npm install
ELEVENLABS_API_KEY=... node scripts/audio.mjs   # voiceover (voice "Nora") + music -> public/audio
npm run studio                 # live preview / tweak in the browser
npx remotion render src/index.ts AlphaTechReel out/alpha-tech-reel.mp4 \
  --props='{"whatsapp":"01515962796"}'   # put your real number here
```

- Scene lengths: `src/theme.ts` (`SCENES`)
- Chat scripts (what the client and AI say): `src/scenes/Demos.tsx`
- Copy for the post: `../copy/pitch.md`

## NoraOffer (25s offer reel)

```bash
ELEVENLABS_API_KEY=... node scripts/audio.mjs --reel nora-offer   # Nora voice (eleven_v3) + music -> public/audio/nora-offer
npx remotion render src/index.ts NoraOffer out/nora-offer.mp4
```

Needs network access to `api.elevenlabs.io`. Beat timings live in `src/offer/timing.ts`.
