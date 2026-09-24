import {Composition} from 'remotion';
import {Reel, reelSchemaDefaults} from './Reel';
import {FPS, TOTAL} from './theme';

export const RemotionRoot: React.FC = () => (
	<Composition
		id="AlphaTechReel"
		component={Reel}
		durationInFrames={TOTAL}
		fps={FPS}
		width={1080}
		height={1920}
		defaultProps={reelSchemaDefaults}
	/>
);
