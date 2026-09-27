import {Audio, Sequence, staticFile} from 'remotion';

export type SfxName = 'slam' | 'cut' | 'receive' | 'send' | 'glitch' | 'tick' | 'ding';

// Kenney UI sounds (CC0, bundled with the brag skill), kept soft under the music.
export const Sfx: React.FC<{at: number; name: SfxName; volume?: number}> = ({at, name, volume = 0.45}) => (
	<Sequence from={at} durationInFrames={30} layout="none">
		<Audio src={staticFile(`sfx/${name}.ogg`)} volume={volume} />
	</Sequence>
);
