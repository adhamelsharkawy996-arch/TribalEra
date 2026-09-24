// Generates the voiceover (one clip per scene) and background music with ElevenLabs,
// then writes public/audio/manifest.json for the Remotion composition.
// Usage: ELEVENLABS_API_KEY=... node scripts/audio.mjs [--voice Nora] [--skip-music]
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error('Set ELEVENLABS_API_KEY');
const args = process.argv.slice(2);
const VOICE_NAME = args.includes('--voice') ? args[args.indexOf('--voice') + 1] : 'Nora';
const OUT = join(import.meta.dirname, '..', 'public', 'audio');
mkdirSync(OUT, {recursive: true});

// Scene order and lengths must match SCENES in src/theme.ts (seconds at 30fps).
const LINES = [
	['hook', 3, 'لسه بتستنى الشركة ترد عليك؟'],
	['twist', 3, 'إحنا خلّينا الذكاء الاصطناعي يرد… ويبني كمان!'],
	['request', 8, 'ابعت فكرتك على واتساب… وفي دقايق، هتاخد بروتوتايب حقيقي تجرّبه بإيدك.'],
	['edit', 6, 'عايز تعدّل حاجة؟ قولها في الشات… وتتنفّذ.'],
	['seo', 6, 'واسأل عن ترتيبك في جوجل… وفي شات جي بي تي كمان.'],
	['features', 5, 'وكل ده من شات واحد… أربعة وعشرين ساعة.'],
	['cta', 4, 'بروجكت ألفا تك… ابعتلنا دلوقتي!'],
];

const MUSIC_PROMPT =
	'Energetic modern trap / phonk beat for a fast-paced tech product reel, punchy 808 bass, crisp hi-hats, ' +
	'subtle oriental Middle Eastern synth melody, confident and hype, 140 BPM, big drop at the start, instrumental only, no vocals';

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
					voice_settings: {stability: 0.4, similarity_boost: 0.8, style: 0.6, use_speaker_boost: true},
				}),
			})
		).arrayBuffer(),
	);

const voiceId = await findVoice();
console.log(`Voice "${VOICE_NAME}" -> ${voiceId}`);

const manifest = {voiceover: [], music: null};
for (const [scene, seconds, text] of LINES) {
	let buf;
	try {
		buf = await tts(voiceId, text, 'eleven_v3');
	} catch (e) {
		console.warn(`eleven_v3 failed for ${scene}, falling back to multilingual_v2: ${e.message}`);
		buf = await tts(voiceId, text, 'eleven_multilingual_v2');
	}
	const file = `vo-${scene}.mp3`;
	writeFileSync(join(OUT, file), buf);
	const d = duration(join(OUT, file));
	manifest.voiceover.push({scene, file, duration: d});
	console.log(`${file}: ${d.toFixed(2)}s (scene ${seconds}s)${d > seconds ? '  <- will be sped up to fit' : ''}`);
}

if (!args.includes('--skip-music')) {
	const res = await api('/v1/music', {
		method: 'POST',
		body: JSON.stringify({prompt: MUSIC_PROMPT, music_length_ms: 36000, force_instrumental: true}),
	});
	writeFileSync(join(OUT, 'music.mp3'), Buffer.from(await res.arrayBuffer()));
	manifest.music = 'music.mp3';
	console.log('music.mp3 written');
}

writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('manifest.json written');
