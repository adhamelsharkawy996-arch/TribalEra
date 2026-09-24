import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from '../components/KineticText';
import {colors, FONT} from '../theme';

const CHIPS: [string, string][] = [
	['⚡ بروتوتايب في دقايق', colors.violet],
	['✏️ تعديلات من الشات', colors.pink],
	['📈 SEO + GEO بالأرقام', colors.green],
	['🕐 شغّال ٢٤/٧', colors.violetGlow],
];

export const Features: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: 330}}>
			<KineticText text="وكل ده من شات واحد 📲" size={82} glow={colors.violet} />
			<div style={{marginTop: 90, display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center'}}>
				{CHIPS.map(([label, color], i) => {
					const s = spring({frame: frame - 18 - i * 12, fps, config: {damping: 11, stiffness: 160}});
					const dir = i % 2 ? 1 : -1;
					return (
						<div
							key={label}
							style={{
								fontFamily: FONT,
								direction: 'rtl',
								fontSize: 64,
								fontWeight: 900,
								color: '#fff',
								padding: '18px 56px',
								borderRadius: 30,
								background: `${color}26`,
								border: `3px solid ${color}`,
								boxShadow: `0 0 45px ${color}77, inset 0 0 30px ${color}33`,
								transform: `translateX(${interpolate(s, [0, 1], [dir * 900, 0])}px) rotate(${interpolate(s, [0, 1], [dir * 8, i % 2 ? 1.5 : -1.5])}deg)`,
							}}
						>
							{label}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
