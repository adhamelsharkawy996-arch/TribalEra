import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from '../components/KineticText';
import {colors, FONT} from '../theme';
import {Sfx} from './Sfx';

const PAGES = ['الرئيسية', 'من نحن', 'خدماتنا', 'أعمالنا', 'تواصل'];
const TINTS = [colors.violet, colors.pink, colors.green, '#F59E0B', '#38BDF8'];

// A tiny website page thumbnail.
const Page: React.FC<{label: string; tint: string}> = ({label, tint}) => (
	<div style={{width: 250, height: 360, borderRadius: 22, background: '#fff', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.55)', fontFamily: FONT, direction: 'rtl'}}>
		<div style={{height: 26, background: '#e5e7eb', display: 'flex', gap: 6, alignItems: 'center', padding: '0 10px', direction: 'ltr'}}>
			{['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
				<div key={c} style={{width: 9, height: 9, borderRadius: '50%', background: c}} />
			))}
		</div>
		<div style={{background: tint, color: '#fff', padding: '18px 10px', fontSize: 34, fontWeight: 900, textAlign: 'center'}}>{label}</div>
		<div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
			{[90, 70, 80].map((w, i) => (
				<div key={i} style={{height: 14, width: `${w}%`, borderRadius: 7, background: '#e5e7eb'}} />
			))}
			<div style={{display: 'flex', gap: 10, marginTop: 6}}>
				<div style={{flex: 1, height: 80, borderRadius: 12, background: `${tint}33`}} />
				<div style={{flex: 1, height: 80, borderRadius: 12, background: `${tint}33`}} />
			</div>
			<div style={{height: 34, borderRadius: 10, background: tint, marginTop: 4}} />
		</div>
	</div>
);

// 11-16s: payment confirmed, then five pages fan out: the full site, same day.
export const SameDay: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const paid = spring({frame, fps, config: {damping: 10}});
	const badge = spring({frame: frame - 100, fps, config: {damping: 9}});
	return (
		<AbsoluteFill style={{alignItems: 'center', fontFamily: FONT, direction: 'rtl'}}>
			<div
				style={{
					marginTop: 270,
					background: `${colors.green}22`,
					border: `3px solid ${colors.green}`,
					color: colors.green,
					fontSize: 54,
					fontWeight: 900,
					borderRadius: 999,
					padding: '10px 44px',
					transform: `scale(${paid})`,
					boxShadow: `0 0 40px ${colors.green}66`,
				}}
			>
				تم الدفع ✅
			</div>
			<div style={{marginTop: 30}}>
				<KineticText text="موقعك كامل جاهز" size={96} delay={8} />
			</div>
			<div style={{position: 'relative', width: 1080, height: 620, marginTop: 30}}>
				{PAGES.map((label, i) => {
					const s = spring({frame: frame - 30 - i * 12, fps, config: {damping: 13, stiffness: 150}});
					const offset = i - 2;
					return (
						<div
							key={label}
							style={{
								position: 'absolute',
								left: 540 - 125,
								top: 90,
								transform: `translateX(${interpolate(s, [0, 1], [0, -offset * 192])}px) translateY(${interpolate(s, [0, 1], [500, Math.abs(offset) * 30])}px) rotate(${interpolate(s, [0, 1], [0, -offset * 6])}deg)`,
								zIndex: 10 - Math.abs(offset),
								opacity: Math.min(1, s * 2),
							}}
						>
							<Page label={label} tint={TINTS[i]} />
						</div>
					);
				})}
			</div>
			<div
				style={{
					position: 'absolute',
					top: 1310,
					background: `linear-gradient(90deg, ${colors.pink}, ${colors.violet})`,
					color: '#fff',
					fontSize: 60,
					fontWeight: 900,
					borderRadius: 24,
					padding: '10px 50px',
					transform: `scale(${badge}) rotate(-3deg)`,
					boxShadow: `0 0 60px ${colors.pink}88`,
				}}
			>
				🔥 في نفس اليوم
			</div>
			<Sfx at={0} name="ding" volume={0.5} />
			{PAGES.map((_, i) => (
				<Sfx key={i} at={30 + i * 12} name="tick" volume={0.25} />
			))}
			<Sfx at={100} name="slam" volume={0.55} />
		</AbsoluteFill>
	);
};
