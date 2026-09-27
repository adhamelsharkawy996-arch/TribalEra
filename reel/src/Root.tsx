import {Composition} from 'remotion';
import {NoraOffer, noraOfferDefaults} from './offer/NoraOffer';
import {OFFER_TOTAL} from './offer/timing';
import {Reel, reelSchemaDefaults} from './Reel';
import {FPS, TOTAL} from './theme';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="AlphaTechReel"
			component={Reel}
			durationInFrames={TOTAL}
			fps={FPS}
			width={1080}
			height={1920}
			defaultProps={reelSchemaDefaults}
		/>
		<Composition
			id="NoraOffer"
			component={NoraOffer}
			durationInFrames={OFFER_TOTAL}
			fps={FPS}
			width={1080}
			height={1920}
			defaultProps={noraOfferDefaults}
		/>
	</>
);
