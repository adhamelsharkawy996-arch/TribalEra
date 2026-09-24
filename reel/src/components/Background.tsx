import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

// Drifting neon blobs over a faint perspective grid. Lives under every scene.
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / 30;
	const blob = (x: number, y: number, size: number, color: string, speed: number, phase: number) => (
		<div
			style={{
				position: 'absolute',
				left: x + Math.sin(t * speed + phase) * 120,
				top: y + Math.cos(t * speed * 0.8 + phase) * 160,
				width: size,
				height: size,
				borderRadius: '50%',
				background: color,
				filter: 'blur(140px)',
				opacity: 0.55,
			}}
		/>
	);
	const gridShift = interpolate(frame % 60, [0, 60], [0, 80]);
	return (
		<AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${colors.bg2}, ${colors.bg} 70%)`, overflow: 'hidden'}}>
			{blob(-200, 200, 800, colors.violet, 0.6, 0)}
			{blob(500, 1100, 900, colors.greenDark, 0.5, 2)}
			{blob(300, 500, 500, colors.pink, 0.4, 4)}
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
					backgroundSize: '80px 80px',
					backgroundPosition: `0 ${gridShift}px`,
					maskImage: 'linear-gradient(to bottom, transparent, black 40%, black 70%, transparent)',
				}}
			/>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7))'}} />
		</AbsoluteFill>
	);
};
