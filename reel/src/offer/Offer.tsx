import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticText} from '../components/KineticText';
import {colors, FONT} from '../theme';
import {Sfx} from './Sfx';

const PERKS = ['موقع ٥ صفحات', 'استضافة مجانية سنة كاملة', 'حماية عالية 🔒', 'تعديلات مجانية ٢٤/٧ من الواتساب', 'تسليم خلال ساعات ⚡'];
const SWAP = 118; // checklist out, price card in

const toArabic = (n: number) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

// 14.5-21.5s: the launch offer. Checklist first, then the price card (staggered, never a double exposure).
export const Offer: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const listOut = interpolate(frame, [SWAP, SWAP + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const price = spring({frame: frame - SWAP - 10, fps, config: {damping: 11}});
	const amount = Math.round(interpolate(frame, [SWAP + 14, SWAP + 40], [0, 1500], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
	const pulse = 1 + Math.max(0, Math.sin(frame / 4)) * 0.05;

	return (
		<AbsoluteFill style={{alignItems: 'center', fontFamily: FONT, direction: 'rtl'}}>
			<div style={{marginTop: 260, transform: `scale(${pulse})`}}>
				<KineticText text="🔥 عرض من النهارده" size={104} color="#FFD34D" glow="#F59E0B" />
			</div>

			{frame < SWAP + 10 ? (
				<div style={{marginTop: 60, display: 'flex', flexDirection: 'column', gap: 26, width: 900, opacity: 1 - listOut, transform: `translateY(${-listOut * 80}px)`}}>
					{PERKS.map((perk, i) => {
						const s = spring({frame: frame - 12 - i * 12, fps, config: {damping: 12, stiffness: 170}});
						return (
							<div
								key={perk}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 24,
									background: '#ffffff10',
									border: '2px solid #ffffff22',
									borderRadius: 26,
									padding: '16px 30px',
									transform: `translateX(${interpolate(s, [0, 1], [-700, 0])}px)`,
									opacity: s,
								}}
							>
								<div
									style={{
										width: 62,
										height: 62,
										borderRadius: '50%',
										background: colors.green,
										color: '#04120a',
										fontSize: 40,
										fontWeight: 900,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
										transform: `scale(${spring({frame: frame - 18 - i * 12, fps, config: {damping: 8}})})`,
									}}
								>
									✓
								</div>
								<div style={{fontSize: 46, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap'}}>{perk}</div>
							</div>
						);
					})}
				</div>
			) : (
				<div style={{marginTop: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, transform: `scale(${price})`, opacity: price}}>
					<div
						style={{
							width: 900,
							borderRadius: 40,
							padding: '40px 30px 46px',
							background: `linear-gradient(160deg, ${colors.violet}, #3b1d8f)`,
							border: `3px solid ${colors.violetGlow}`,
							boxShadow: `0 0 90px ${colors.violet}aa`,
							textAlign: 'center',
							color: '#fff',
						}}
					>
						<div style={{fontSize: 56, fontWeight: 800}}>امتلك اللاندينج بيدج</div>
						<div style={{fontSize: 38, fontWeight: 700, opacity: 0.85}}>(البروتوتايب المجاني بتاعك)</div>
						<div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 20, marginTop: 10}}>
							<span style={{fontSize: 190, fontWeight: 900, lineHeight: 1.1, color: '#FFD34D', textShadow: '0 0 50px #F59E0B'}}>{toArabic(amount)}</span>
							<span style={{fontSize: 80, fontWeight: 900}}>ج بس!</span>
						</div>
					</div>
					{['🌐 الدومين بسعره الحقيقي', '📄 الموقع الكامل: كلّمنا للسعر'].map((line, i) => {
						const s = spring({frame: frame - SWAP - 36 - i * 8, fps, config: {damping: 12}});
						return (
							<div key={line} style={{fontSize: 48, fontWeight: 800, color: '#fff', background: '#ffffff12', border: '2px solid #ffffff2a', borderRadius: 999, padding: '10px 40px', opacity: s, transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`}}>
								{line}
							</div>
						);
					})}
				</div>
			)}
			<Sfx at={0} name="slam" volume={0.6} />
			{PERKS.map((_, i) => (
				<Sfx key={i} at={18 + i * 12} name="tick" volume={0.3} />
			))}
			<Sfx at={SWAP + 10} name="slam" volume={0.6} />
			<Sfx at={SWAP + 40} name="ding" volume={0.5} />
		</AbsoluteFill>
	);
};
