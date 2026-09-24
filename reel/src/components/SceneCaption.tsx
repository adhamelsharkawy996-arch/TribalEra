import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, FONT} from '../theme';

// Numbered pill + headline that sits above the phone in the demo scenes.
export const SceneCaption: React.FC<{step: string; title: string; accent?: string}> = ({step, title, accent = colors.green}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, config: {damping: 14}});
	return (
		<div
			style={{
				position: 'absolute',
				top: 250,
				left: 0,
				right: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 10,
				fontFamily: FONT,
				direction: 'rtl',
				transform: `translateY(${interpolate(s, [0, 1], [-60, 0])}px)`,
				opacity: s,
			}}
		>
			<div
				style={{
					background: accent,
					color: '#000',
					fontWeight: 900,
					fontSize: 34,
					padding: '4px 28px',
					borderRadius: 999,
					boxShadow: `0 0 30px ${accent}`,
				}}
			>
				{step}
			</div>
			<div style={{color: '#fff', fontWeight: 900, fontSize: 68, textShadow: `0 0 30px ${accent}88`}}>{title}</div>
		</div>
	);
};
