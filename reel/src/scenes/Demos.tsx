import {AbsoluteFill, Sequence} from 'remotion';
import {Phone} from '../components/Phone';
import {PrototypeCard} from '../components/PrototypeCard';
import {SceneCaption} from '../components/SceneCaption';
import {SeoReport} from '../components/SeoReport';
import {colors} from '../theme';

export const RequestDemo: React.FC = () => (
	<AbsoluteFill>
		<Sequence durationInFrames={150} layout="none">
			<SceneCaption step="١" title="ابعت فكرتك على واتساب" />
		</Sequence>
		<Sequence from={150} layout="none">
			<SceneCaption step="٢" title="خُد بروتوتايب في دقايق" accent={colors.violetGlow} />
		</Sequence>
		<Phone
			items={[
				{from: 'user', at: 60, typeFrames: 45, text: 'عايز موقع لمطعمي فيه منيو وحجز ترابيزات 🍽️'},
				{from: 'ai', at: 100, thinkFrames: 28, node: 'تمام! بجهّزلك البروتوتايب دلوقتي ⚡'},
				{
					from: 'ai',
					at: 150,
					thinkFrames: 36,
					node: (
						<div>
							<div style={{marginBottom: 12}}>جاهز! افتح وجرّب 👇</div>
							<PrototypeCard at={150} />
						</div>
					),
				},
			]}
		/>
	</AbsoluteFill>
);

export const EditDemo: React.FC = () => (
	<AbsoluteFill>
		<SceneCaption step="٣" title="عدّل أي حاجة من الشات" accent={colors.pink} />
		<Phone
			items={[
				{from: 'user', at: 40, typeFrames: 35, text: 'غيّر اللون للأخضر وضيف صور الأكل 🎨'},
				{
					from: 'ai',
					at: 78,
					thinkFrames: 28,
					node: (
						<div>
							<div style={{marginBottom: 12}}>اتعمل ✅ شوف كده</div>
							<PrototypeCard at={70} morphAt={100} />
						</div>
					),
				},
			]}
		/>
	</AbsoluteFill>
);

export const SeoDemo: React.FC = () => (
	<AbsoluteFill>
		<SceneCaption step="٤" title="اسأل عن ترتيبك: SEO + GEO" />
		<Phone
			items={[
				{from: 'user', at: 32, typeFrames: 26, text: 'ترتيبي عامل إيه؟ 👀'},
				{from: 'ai', at: 66, thinkFrames: 26, node: <SeoReport at={66} />},
			]}
		/>
	</AbsoluteFill>
);
