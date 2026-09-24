import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import manifest from '../public/audio/manifest.json';
import {Background} from './components/Background';
import {Flash} from './components/Flash';
import {Cta} from './scenes/Cta';
import {EditDemo, RequestDemo, SeoDemo} from './scenes/Demos';
import {Features} from './scenes/Features';
import {Hook} from './scenes/Hook';
import {Twist} from './scenes/Twist';
import {FPS, SCENES, TOTAL} from './theme';

type Manifest = {voiceover: {scene: keyof typeof SCENES; file: string; duration: number}[]; music: string | null};
const audio = manifest as Manifest;

export type ReelProps = {whatsapp: string};

// Swap in the real number/handle here (or via --props) before rendering.
export const reelSchemaDefaults: ReelProps = {whatsapp: '01515962796'};

export const Reel: React.FC<ReelProps> = ({whatsapp}) => {
	const scenes: [keyof typeof SCENES, React.ReactNode][] = [
		['hook', <Hook />],
		['twist', <Twist />],
		['request', <RequestDemo />],
		['edit', <EditDemo />],
		['seo', <SeoDemo />],
		['features', <Features />],
		['cta', <Cta whatsapp={whatsapp} />],
	];
	const starts: Record<string, number> = {};
	let from = 0;
	for (const [name] of scenes) {
		starts[name] = from;
		from += SCENES[name];
	}
	from = 0;
	return (
		<AbsoluteFill>
			<Background />
			{audio.music ? (
				<Audio
					src={staticFile(`audio/${audio.music}`)}
					// music sits under the voice, fades in fast and out over the last second
					volume={(f) => interpolate(f, [0, 8, TOTAL - 30, TOTAL], [0, 0.28, 0.28, 0], {extrapolateRight: 'clamp'})}
				/>
			) : null}
			{audio.voiceover.map(({scene, file, duration}) => {
				// start each line a few frames into its scene; speed up (max 1.3x) if it would overrun the scene
				const room = SCENES[scene] / FPS - 0.3;
				return (
					<Sequence key={file} from={starts[scene] + 4} durationInFrames={SCENES[scene]} layout="none">
						<Audio src={staticFile(`audio/${file}`)} playbackRate={Math.min(1.3, Math.max(1, duration / room))} volume={1} />
					</Sequence>
				);
			})}
			{scenes.map(([name, node]) => {
				const start = from;
				from += SCENES[name];
				return (
					<Sequence key={name} name={name} from={start} durationInFrames={SCENES[name]}>
						{node}
						{start > 0 ? <Flash /> : null}
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
