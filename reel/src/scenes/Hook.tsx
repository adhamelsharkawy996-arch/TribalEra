import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from '../components/KineticText';
import {colors, FONT} from '../theme';

const Lines: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const chip = spring({frame: frame - 38, fps, config: {damping: 12}});
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 30, padding: '0 60px'}}>
			<KineticText text="لسه بتستنى" size={150} />
			<KineticText text="الشركة ترد عليك؟ 😴" size={120} delay={14} color={colors.pink} glow={colors.pink} />
			<div
				style={{
					marginTop: 40,
					fontFamily: FONT,
					direction: 'rtl',
					fontSize: 40,
					fontWeight: 700,
					color: colors.muted,
					background: '#ffffff14',
					border: '2px solid #ffffff22',
					borderRadius: 999,
					padding: '10px 36px',
					transform: `scale(${chip})`,
				}}
			>
				⏳ آخر ظهور: من ٣ أيام
			</div>
		</AbsoluteFill>
	);
};

// Opening 3s: slam-in question, screen shake on each hit, RGB glitch out.
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const shakeAmt = Math.max(interpolate(frame, [2, 12], [22, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), interpolate(frame, [16, 26], [26, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const shake = `translate(${Math.sin(frame * 9) * shakeAmt}px, ${Math.cos(frame * 7) * shakeAmt}px)`;
	const glitch = frame >= 68;
	const g = glitch ? interpolate(frame, [68, 90], [6, 40]) : 0;
	const jitter = glitch ? Math.sin(frame * 13) * g : 0;

	if (!glitch) {
		return (
			<AbsoluteFill style={{transform: shake}}>
				<Lines />
			</AbsoluteFill>
		);
	}
	return (
		<AbsoluteFill style={{transform: `translateX(${jitter}px)`}}>
			<AbsoluteFill style={{transform: `translate(${-g}px, 0)`, mixBlendMode: 'screen', filter: 'drop-shadow(0 0 0 red) hue-rotate(0deg)', opacity: 0.8}}>
				<AbsoluteFill style={{filter: 'sepia(1) saturate(20) hue-rotate(-50deg)'}}>
					<Lines />
				</AbsoluteFill>
			</AbsoluteFill>
			<AbsoluteFill style={{transform: `translate(${g}px, 0)`, mixBlendMode: 'screen', opacity: 0.8}}>
				<AbsoluteFill style={{filter: 'sepia(1) saturate(20) hue-rotate(140deg)'}}>
					<Lines />
				</AbsoluteFill>
			</AbsoluteFill>
			{[0, 1, 2, 3].map((i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: ((frame * 97 + i * 431) % 1700) + 100,
						height: 12 + ((frame + i * 5) % 4) * 14,
						background: i % 2 ? colors.green : colors.violet,
						opacity: 0.55,
						transform: `translateX(${Math.sin(frame + i) * 200}px)`,
					}}
				/>
			))}
		</AbsoluteFill>
	);
};
