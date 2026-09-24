import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';

type Props = {
	text: string;
	delay?: number;
	size?: number;
	color?: string;
	weight?: number;
	glow?: string;
	stagger?: number;
	style?: React.CSSProperties;
};

// Words slam in one by one (scale down from big + unblur).
export const KineticText: React.FC<Props> = ({text, delay = 0, size = 110, color = '#fff', weight = 900, glow, stagger = 4, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const words = text.split(' ');
	return (
		<div
			style={{
				fontFamily: FONT,
				fontSize: size,
				fontWeight: weight,
				color,
				direction: 'rtl',
				textAlign: 'center',
				lineHeight: 1.35,
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				gap: `0 ${size * 0.28}px`,
				textShadow: glow ? `0 0 40px ${glow}, 0 0 90px ${glow}` : undefined,
				...style,
			}}
		>
			{words.map((w, i) => {
				const s = spring({frame: frame - delay - i * stagger, fps, config: {damping: 12, stiffness: 180, mass: 0.6}});
				const scale = interpolate(s, [0, 1], [2.4, 1]);
				const blur = interpolate(s, [0, 1], [18, 0]);
				return (
					<span
						key={i}
						style={{display: 'inline-block', transform: `scale(${scale})`, opacity: Math.min(1, s * 1.5), filter: `blur(${blur}px)`}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};
