import {AbsoluteFill} from 'remotion';
import {ChatItem, Phone} from '../components/Phone';
import {SceneCaption} from '../components/SceneCaption';
import {Sfx} from './Sfx';
import {NORA_TITLE} from './timing';

const ITEMS: ChatItem[] = [
	{from: 'user', at: 22, typeFrames: 16, text: 'عايز موقع لشركتي 👋'},
	{from: 'ai', at: 46, thinkFrames: 12, node: 'أهلًا! أنا نورا 🤖 نشاطك إيه وألوانك؟'},
	{from: 'user', at: 82, typeFrames: 18, text: 'مطعم مشويات · أحمر ودهبي 🍖'},
	{from: 'ai', at: 106, thinkFrames: 12, node: 'تمام! جمعت كل اللي محتاجاه ✅'},
	{from: 'user', at: 138, typeFrames: 10, text: 'ابدأ 🚀'},
];

// 2.5-8s: Nora gathers the business info, the client says "ابدأ".
export const Gather: React.FC = () => (
	<AbsoluteFill>
		<SceneCaption step="١" title="نورا بتفهم البيزنس بتاعك" />
		<Phone items={ITEMS} title={NORA_TITLE} />
		{ITEMS.map((it) => (
			<Sfx key={it.at} at={it.at} name={it.from === 'user' ? 'send' : 'receive'} volume={it.from === 'user' ? 0.5 : 0.4} />
		))}
	</AbsoluteFill>
);
