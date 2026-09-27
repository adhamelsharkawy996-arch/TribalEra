// Generates the voiceover (one clip per scene) and background music with ElevenLabs,
// then writes public/audio/manifest.json for the Remotion composition.
// Usage: ELEVENLABS_API_KEY=... node scripts/audio.mjs [--reel alpha-tech|nora-offer] [--voice Nora] [--skip-music]
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error('Set ELEVENLABS_API_KEY');
const args = process.argv.slice(2);
const VOICE_NAME = args.includes('--voice') ? args[args.indexOf('--voice') + 1] : 'Nora';
const REEL = args.includes('--reel') ? args[args.indexOf('--reel') + 1] : 'alpha-tech';

// Per-reel line sets. Scene order and lengths must match the composition's scene map
// (src/theme.ts SCENES for alpha-tech, src/offer/timing.ts OFFER_SCENES for nora-offer).
const REELS = {
	'alpha-tech': {
		dir: '',
		models: ['eleven_v3', 'eleven_multilingual_v2'],
		musicMs: 36000,
		lines: [
			['hook', 3, 'لسه بتستنى الشركة ترد عليك؟'],
			['twist', 3, 'إحنا خلّينا الذكاء الاصطناعي يرد، ويبني كمان!'],
			['request', 8, 'ابعت فكرتك على واتساب، وفي دقايق، هتاخد بروتوتايب حقيقي تجرّبه بإيدك.'],
			['edit', 6, 'عايز تعدّل حاجة؟ قولها في الشات، وتتنفّذ.'],
			['seo', 6, 'واسأل عن ترتيبك في جوجل، وفي شات جي بي تي كمان.'],
			['features', 5, 'وكل ده من شات واحد، أربعة وعشرين ساعة.'],
			['cta', 4, 'بروجكت ألفا تك، ابعتلنا دلوقتي!'],
		],
		music:
			'Energetic modern trap / phonk beat for a fast-paced tech product reel, punchy 808 bass, crisp hi-hats, ' +
			'subtle oriental Middle Eastern synth melody, confident and hype, 140 BPM, big drop at the start, instrumental only, no vocals',
	},
	// v3 audio tags ([excited], [confident]) steer delivery; no "…" since v3 can voice it as a sound.
	'nora-offer': {
		dir: 'nora-offer',
		models: ['eleven_v3'],
		musicMs: 26000,
		lines: [
			['hook', 2.5, '[excited] نورا بقت أقوى من الأول!'],
			['gather', 5.5, '[confident] ابعتلها على واتساب، وهي تفهم البيزنس بتاعك كله، وتقولها: ابدأ!'],
			['prototype', 3, '[excited] وفي ساعات، البروتوتايب عندك!'],
			['sameday', 3.5, 'وبعد الدفع، موقعك كامل، في نفس اليوم!'],
			['offer', 7, '[excited] عرض من النهارده! موقع خمس صفحات، واستضافة وحماية وتعديلات مجانًا لمدة سنة. واللاندينج بيدج بألف وخمسمية جنيه بس!'],
			['cta', 3.5, '[excited] كلّم نورا دلوقتي على واتساب!'],
		],
		music:
			'Upbeat Egyptian mahraganat-inspired electronic beat for a 25 second social media ad, punchy drums, ' +
			'energetic synth hook, festive and confident, 128 BPM, starts immediately with no intro, clean ending, instrumental only, no vocals',
	},
};
const cfg = REELS[REEL];
if (!cfg) throw new Error(`Unknown --reel ${REEL}; use one of ${Object.keys(REELS).join(', ')}`);
const OUT = join(import.meta.dirname, '..', 'public', 'audio', cfg.dir);
mkdirSync(OUT, {recursive: true});

const api = async (path, init = {}) => {
	const res = await fetch(`https://api.elevenlabs.io${path}`, {
		...init,
		headers: {'xi-api-key': KEY, 'Content-Type': 'application/json', ...(init.headers ?? {})},
	});
	if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} -> ${res.status}: ${await res.text()}`);
	return res;
};

const findVoice = async () => {
	const mine = await (await api(`/v2/voices?search=${encodeURIComponent(VOICE_NAME)}&page_size=50`)).json();
	const hit = mine.voices.find((v) => v.name.toLowerCase().startsWith(VOICE_NAME.toLowerCase()));
	if (hit) return hit.voice_id;
	// Not in the account yet: look in the shared Voice Library and add it.
	const shared = await (await api(`/v1/shared-voices?search=${encodeURIComponent(VOICE_NAME)}&page_size=50`)).json();
	const lib = shared.voices.find((v) => v.name.toLowerCase().startsWith(VOICE_NAME.toLowerCase()));
	if (!lib) throw new Error(`No voice named "${VOICE_NAME}" in your voices or the Voice Library`);
	const added = await (
		await api(`/v1/voices/add/${lib.public_owner_id}/${lib.voice_id}`, {method: 'POST', body: JSON.stringify({new_name: lib.name})})
	).json();
	return added.voice_id;
};

const duration = (file) =>
	Number(
		execFileSync('npx', ['remotion', 'ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {
			encoding: 'utf8',
		}).trim(),
	);

const tts = async (voiceId, text, model) =>
	Buffer.from(
		await (
			await api(`/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
				method: 'POST',
				body: JSON.stringify({
					text,
					model_id: model,
					voice_settings: model === 'eleven_v3' ? {stability: 0.5, similarity_boost: 0.8} : {stability: 0.4, similarity_boost: 0.8, style: 0.6, use_speaker_boost: true},
				}),
			})
		).arrayBuffer(),
	);

const voiceId = await findVoice();
console.log(`Voice "${VOICE_NAME}" -> ${voiceId}`);

const manifest = {voiceover: [], music: null};
for (const [scene, seconds, text] of cfg.lines) {
	let buf;
	for (const model of cfg.models) {
		try {
			buf = await tts(voiceId, text, model);
			break;
		} catch (e) {
			console.warn(`${model} failed for ${scene}: ${e.message}`);
		}
	}
	if (!buf) throw new Error(`No model could voice the "${scene}" line`);
	const file = `vo-${scene}.mp3`;
	writeFileSync(join(OUT, file), buf);
	const d = duration(join(OUT, file));
	manifest.voiceover.push({scene, file, duration: d});
	console.log(`${file}: ${d.toFixed(2)}s (scene ${seconds}s)${d > seconds ? '  <- will be sped up to fit' : ''}`);
}

if (!args.includes('--skip-music')) {
	const res = await api('/v1/music', {
		method: 'POST',
		body: JSON.stringify({prompt: cfg.music, music_length_ms: cfg.musicMs, force_instrumental: true}),
	});
	writeFileSync(join(OUT, 'music.mp3'), Buffer.from(await res.arrayBuffer()));
	manifest.music = 'music.mp3';
	console.log('music.mp3 written');
}

writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('manifest.json written');
