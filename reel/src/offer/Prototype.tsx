import {AbsoluteFill} from 'remotion';
import {Phone} from '../components/Phone';
import {PrototypeCard} from '../components/PrototypeCard';
import {SceneCaption} from '../components/SceneCaption';
import {colors} from '../theme';
import {Sfx} from './Sfx';
import {NORA_TITLE} from './timing';

// 8-11s: the prototype lands in the chat within hours.
export const Prototype: React.FC = () => (
	<AbsoluteFill>
		<SceneCaption step="⏱" title="البروتوتايب في ساعات" accent={colors.violetGlow} />
		<Phone
			title={NORA_TITLE}
			items={[
				{
					from: 'ai',
					at: 16,
					thinkFrames: 12,
					node: (
						<div>
							<div style={{marginBottom: 12}}>البروتوتايب جاهز، جرّبه 👇</div>
							<PrototypeCard at={16} />
						</div>
					),
				},
			]}
		/>
		<Sfx at={16} name="ding" volume={0.5} />
	</AbsoluteFill>
);
