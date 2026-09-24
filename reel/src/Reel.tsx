import {AbsoluteFill, Sequence} from 'remotion';
import {Background} from './components/Background';
import {Flash} from './components/Flash';
import {Cta} from './scenes/Cta';
import {EditDemo, RequestDemo, SeoDemo} from './scenes/Demos';
import {Features} from './scenes/Features';
import {Hook} from './scenes/Hook';
import {Twist} from './scenes/Twist';
import {SCENES} from './theme';

export type ReelProps = {whatsapp: string};

// Swap in the real number/handle here (or via --props) before rendering.
export const reelSchemaDefaults: ReelProps = {whatsapp: '+20 1X XXXX XXXX'};

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
	let from = 0;
	return (
		<AbsoluteFill>
			<Background />
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
