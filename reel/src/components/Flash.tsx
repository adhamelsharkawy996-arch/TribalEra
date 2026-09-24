import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// Quick white punch at the start of a scene to sell the hard cut.
export const Flash: React.FC<{length?: number}> = ({length = 6}) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, length], [0.85, 0], {extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{background: '#fff', opacity, pointerEvents: 'none'}} />;
};
