import {interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../theme';

type Props = {
	at: number; // frame the card appears (scene-relative)
	morphAt?: number; // if set, recolours violet -> green and adds food photos from this frame
};

// A tiny "live website" preview that the AI sends back as the prototype.
export const PrototypeCard: React.FC<Props> = ({at, morphAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const m = morphAt === undefined ? 0 : spring({frame: frame - morphAt, fps, config: {damping: 14}});
	const accent = interpolateColors(m, [0, 1], [colors.violet, colors.green]);
	const flip = morphAt === undefined ? 0 : interpolate(frame - morphAt, [0, 8, 16], [0, 90, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const row = (i: number) => spring({frame: frame - at - 8 - i * 5, fps, config: {damping: 14}});

	return (
		<div style={{width: 560, borderRadius: 22, overflow: 'hidden', background: '#fff', color: '#111', transform: `perspective(900px) rotateY(${flip}deg)`}}>
			<div style={{background: '#e5e7eb', padding: '8px 14px', display: 'flex', gap: 8, alignItems: 'center', direction: 'ltr'}}>
				{['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
					<div key={c} style={{width: 12, height: 12, borderRadius: '50%', background: c}} />
				))}
				<div style={{flex: 1, background: '#fff', borderRadius: 8, fontSize: 20, padding: '2px 12px', color: '#555', fontFamily: 'monospace'}}>
					alphatech.app/p/el-aseel
				</div>
			</div>
			<div style={{background: accent, padding: '22px 24px', color: '#fff'}}>
				<div style={{fontSize: 40, fontWeight: 900}}>مطعم الأصيل 🔥</div>
				<div style={{fontSize: 24, fontWeight: 600, opacity: 0.9}}>أحلى مشويات في المعادي</div>
			</div>
			{m > 0.01 ? (
				<div style={{display: 'flex', gap: 10, padding: '14px 18px 0', opacity: m}}>
					{['🍗', '🥙', '🍝'].map((e, i) => (
						<div
							key={e}
							style={{
								flex: 1,
								height: 90,
								borderRadius: 14,
								background: `linear-gradient(135deg, #fde68a, #fb923c)`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 54,
								transform: `scale(${spring({frame: frame - (morphAt ?? 0) - 6 - i * 4, fps})})`,
							}}
						>
							{e}
						</div>
					))}
				</div>
			) : null}
			<div style={{padding: '12px 24px 20px'}}>
				{[
					['مشويات مشكّلة', '٢٤٠ ج'],
					['كفتة وطرب', '١٨٠ ج'],
				].map(([name, price], i) => (
					<div
						key={name}
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							fontSize: 28,
							fontWeight: 700,
							padding: '8px 0',
							borderBottom: '2px dashed #ddd',
							opacity: row(i),
							transform: `translateX(${interpolate(row(i), [0, 1], [40, 0])}px)`,
						}}
					>
						<span>{name}</span>
						<span style={{color: accent}}>{price}</span>
					</div>
				))}
				<div
					style={{
						marginTop: 16,
						background: accent,
						color: '#fff',
						textAlign: 'center',
						borderRadius: 14,
						padding: '10px 0',
						fontSize: 30,
						fontWeight: 900,
						transform: `scale(${row(2)})`,
					}}
				>
					احجز ترابيزة
				</div>
			</div>
		</div>
	);
};
