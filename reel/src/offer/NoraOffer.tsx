import {AbsoluteFill, Audio, Freeze, getStaticFiles, interpolate, Sequence, staticFile} from 'remotion';
import manifest from '../../public/audio/nora-offer/manifest.json';
import {Background} from '../components/Background';
import {Flash} from '../components/Flash';
import {Cta} from '../scenes/Cta';
import {FPS} from '../theme';
import {Gather} from './Gather';
import {Hook} from './Hook';
import {Offer} from './Offer';
import {Prototype} from './Prototype';
import {SameDay} from './SameDay';
import {Sfx} from './Sfx';
import {OFFER_SCENES, OFFER_TOTAL, OfferScene} from './timing';

const POSTER_OFFER_FRAME = 175;

type Manifest = {voiceover: {scene: OfferScene; file: string; duration: number}[]; music: string | null};
const audio = manifest as Manifest;

// ElevenLabs music when it has been generated; otherwise a local placeholder track if one is present.
const musicSrc = (): string | null => {
	if (audio.music) return staticFile(`audio/nora-offer/${audio.music}`);
	const placeholder = getStaticFiles().find((f) => f.name === 'audio/placeholder-music.mp3');
	return placeholder ? placeholder.src : null;
};

export type NoraOfferProps = {whatsapp: string};
export const noraOfferDefaults: NoraOfferProps = {whatsapp: '01515962796'};

export const NoraOffer: React.FC<NoraOfferProps> = ({whatsapp}) => {
	const scenes: [OfferScene, React.ReactNode][] = [
		['hook', <Hook />],
		['gather', <Gather />],
		['prototype', <Prototype />],
		['sameday', <SameDay />],
		['offer', <Offer />],
		['cta', <Cta whatsapp={whatsapp} tagline="موقعك في نفس اليوم، مع نورا" button="💬 كلّم نورا على واتساب" />],
	];
	const starts = {} as Record<OfferScene, number>;
	let t = 0;
	for (const [name] of scenes) {
		starts[name] = t;
		t += OFFER_SCENES[name];
	}
	const music = musicSrc();
	const hasVoice = audio.voiceover.length > 0;

	return (
		<AbsoluteFill>
			<Background />
			{music ? (
				<Audio
					src={music}
					// louder when there is no voiceover; fade out over the last second
					volume={(f) => interpolate(f, [0, 6, OFFER_TOTAL - 30, OFFER_TOTAL], [0, hasVoice ? 0.22 : 0.5, hasVoice ? 0.22 : 0.5, 0], {extrapolateRight: 'clamp'})}
				/>
			) : null}
			{audio.voiceover.map(({scene, file, duration}) => {
				// each line starts a few frames into its beat; speed up (max 1.3x) only if it would overrun
				const room = OFFER_SCENES[scene] / FPS - 0.25;
				return (
					<Sequence key={file} from={starts[scene] + 3} durationInFrames={OFFER_SCENES[scene]} layout="none">
						<Audio src={staticFile(`audio/nora-offer/${file}`)} playbackRate={Math.min(1.3, Math.max(1, duration / room))} />
					</Sequence>
				);
			})}
			{scenes.map(([name, node]) => (
				<Sequence key={name} name={name} from={starts[name]} durationInFrames={OFFER_SCENES[name]}>
					{node}
					{starts[name] > 0 ? <Flash length={5} /> : null}
				</Sequence>
			))}
			<Sfx at={starts.cta} name="slam" volume={0.55} />
			{/* brag: bake the strongest settled frame (the price card) as frame 0 so every platform's thumbnail shows it */}
			<Sequence durationInFrames={1} name="poster">
				<Freeze frame={POSTER_OFFER_FRAME}>
					<AbsoluteFill>
						<Background />
						<Offer />
					</AbsoluteFill>
				</Freeze>
			</Sequence>
		</AbsoluteFill>
	);
};
