import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from '../components/KineticText';
import {Logo} from '../components/Phone';
import {colors, FONT} from '../theme';

export const Twist: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const brand = spring({frame: frame - 48, fps, config: {damping: 12}});
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 20, padding: '0 60px'}}>
			<KineticText text="إحنا خلّينا الـAI يرد…" size={100} />
			<KineticText text="ويبني كمان ⚡" size={118} delay={22} color={colors.green} glow={colors.green} />
			<div
				style={{
					marginTop: 60,
					display: 'flex',
					alignItems: 'center',
					gap: 24,
					transform: `scale(${brand})`,
					opacity: brand,
					fontFamily: FONT,
					fontSize: 58,
					fontWeight: 900,
					color: '#fff',
					background: '#ffffff10',
					border: `2px solid ${colors.violet}`,
					boxShadow: `0 0 50px ${colors.violet}88`,
					borderRadius: 999,
					padding: '14px 40px 14px 20px',
				}}
			>
				<Logo size={90} />
				Project Alpha Tech
			</div>
		</AbsoluteFill>
	);
};
