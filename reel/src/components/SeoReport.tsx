import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../theme';

const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

// The AI's ranking reply: Google position counting up, AI-search mention, traffic growth.
export const SeoReport: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const f = frame - at;
	const rank = Math.round(interpolate(f, [10, 45], [12, 3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const traffic = Math.round(interpolate(f, [40, 80], [0, 248], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const card = (i: number) => spring({frame: f - i * 14, fps, config: {damping: 13}});

	const Row: React.FC<{i: number; label: string; children: React.ReactNode; accent: string}> = ({i, label, children, accent}) => (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 20,
				background: '#111b21',
				border: `2px solid ${accent}66`,
				borderRadius: 18,
				padding: '10px 20px',
				marginTop: 12,
				opacity: card(i),
				transform: `translateY(${interpolate(card(i), [0, 1], [30, 0])}px)`,
			}}
		>
			<span style={{fontSize: 30, fontWeight: 700, color: '#cbd5e1'}}>{label}</span>
			<span style={{fontSize: 40, fontWeight: 900, color: accent, direction: 'ltr', unicodeBidi: 'isolate'}}>{children}</span>
		</div>
	);

	return (
		<div style={{width: 560}}>
			<div style={{fontSize: 36, fontWeight: 800}}>تقرير النهارده 📊</div>
			<Row i={0} label="ترتيبك في Google" accent={colors.green}>
				▲ #{toArabicDigits(rank)}
			</Row>
			<Row i={1} label="ترشيحات ChatGPT" accent={colors.violetGlow}>
				<span style={{direction: 'rtl', unicodeBidi: 'isolate'}}>✓ بيرشّحوك</span>
			</Row>
			<Row i={2} label="زيارات الشهر" accent={colors.pink}>
				+{toArabicDigits(traffic)}٪
			</Row>
		</div>
	);
};
