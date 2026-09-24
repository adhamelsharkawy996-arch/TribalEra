import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from '../components/KineticText';
import {Logo} from '../components/Phone';
import {colors, FONT} from '../theme';

export const Cta: React.FC<{whatsapp: string}> = ({whatsapp}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame, fps, config: {damping: 10}});
	const btn = spring({frame: frame - 30, fps, config: {damping: 11}});
	const pulse = 1 + Math.max(0, Math.sin((frame - 30) / 5)) * 0.06;
	const ring = interpolate((frame - 30) % 30, [0, 30], [1, 1.5]);
	const ringOpacity = frame > 30 ? interpolate((frame - 30) % 30, [0, 30], [0.7, 0]) : 0;
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: FONT, gap: 36, paddingBottom: 120}}>
			<div style={{transform: `scale(${logo}) rotate(${interpolate(logo, [0, 1], [-180, 0])}deg)`, filter: `drop-shadow(0 0 60px ${colors.violet})`}}>
				<Logo size={200} />
			</div>
			<div style={{fontSize: 100, fontWeight: 900, color: '#fff', opacity: logo, textShadow: `0 0 40px ${colors.violet}`}}>Project Alpha Tech</div>
			<KineticText text="شركتك كلها في شات واتساب واحد" size={54} weight={800} delay={10} stagger={3} style={{padding: '0 60px'}} />
			<div style={{position: 'relative', marginTop: 30}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						borderRadius: 999,
						border: `4px solid ${colors.green}`,
						transform: `scale(${ring})`,
						opacity: ringOpacity,
					}}
				/>
				<div
					style={{
						direction: 'rtl',
						background: colors.green,
						color: '#04120a',
						fontSize: 62,
						fontWeight: 900,
						padding: '22px 70px',
						borderRadius: 999,
						transform: `scale(${btn * pulse})`,
						boxShadow: `0 0 70px ${colors.green}`,
					}}
				>
					💬 ابعتلنا على واتساب
				</div>
			</div>
			<div style={{fontSize: 52, fontWeight: 800, color: colors.green, direction: 'ltr', opacity: btn}}>{whatsapp}</div>
		</AbsoluteFill>
	);
};
