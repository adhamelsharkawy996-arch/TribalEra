import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from '../components/KineticText';
import {Logo} from '../components/Phone';
import {colors, FONT} from '../theme';
import {Sfx} from './Sfx';

// 0-2.5s: "Nora got stronger" slams in with a power-up ring.
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const badge = spring({frame: frame - 2, fps, config: {damping: 9, stiffness: 160}});
	const ring = interpolate(frame % 24, [0, 24], [1, 2.2]);
	const ringOpacity = interpolate(frame % 24, [0, 24], [0.8, 0]);
	const shake = interpolate(frame, [10, 20], [18, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 50, transform: `translate(${Math.sin(frame * 9) * shake}px, ${Math.cos(frame * 7) * shake}px)`}}>
			<div style={{position: 'relative', transform: `scale(${badge})`}}>
				<div style={{position: 'absolute', inset: -10, borderRadius: '28%', border: `6px solid ${colors.green}`, transform: `scale(${ring})`, opacity: ringOpacity}} />
				<div style={{filter: `drop-shadow(0 0 60px ${colors.green})`}}>
					<Logo size={230} />
				</div>
			</div>
			<KineticText text="نورا بقت أقوى 💪" size={116} delay={8} color={colors.green} glow={colors.green} />
			<div
				style={{
					fontFamily: FONT,
					fontSize: 46,
					fontWeight: 800,
					color: '#fff',
					direction: 'rtl',
					opacity: interpolate(frame, [30, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				}}
			>
				مساعدتك الذكية على واتساب
			</div>
			<Sfx at={8} name="slam" volume={0.7} />
			<Sfx at={10} name="glitch" volume={0.3} />
		</AbsoluteFill>
	);
};
