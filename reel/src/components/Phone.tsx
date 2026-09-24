import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, FONT} from '../theme';

export const PHONE = {top: 450, width: 820, height: 1050};

export type ChatItem =
	| {from: 'user'; at: number; text: string; typeFrames?: number}
	| {from: 'ai'; at: number; node: React.ReactNode; thinkFrames?: number};

const Logo: React.FC<{size: number}> = ({size}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: '50%',
			background: `linear-gradient(135deg, ${colors.violet}, ${colors.green})`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			color: '#fff',
			fontWeight: 900,
			fontSize: size * 0.55,
			fontFamily: 'serif',
			flexShrink: 0,
		}}
	>
		α
	</div>
);

const TypingDots: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', gap: 10, padding: '8px 6px'}}>
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					style={{
						width: 16,
						height: 16,
						borderRadius: '50%',
						background: colors.muted,
						transform: `translateY(${Math.sin((frame - i * 4) / 3.5) * 7}px)`,
					}}
				/>
			))}
		</div>
	);
};

const Bubble: React.FC<{from: 'user' | 'ai'; at: number; children: React.ReactNode}> = ({from, at, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - at, fps, config: {damping: 13, stiffness: 200}});
	const isUser = from === 'user';
	return (
		<div
			style={{
				// grow height so older messages slide up smoothly instead of jumping
				maxHeight: interpolate(s, [0, 1], [0, 900]),
				overflow: 'visible',
				display: 'flex',
				justifyContent: isUser ? 'flex-start' : 'flex-end', // rtl: flex-start is the right edge
				marginTop: interpolate(s, [0, 1], [0, 18]),
			}}
		>
			<div
				style={{
					maxWidth: '82%',
					background: isUser ? colors.greenDark : colors.aiBubble,
					color: '#E9EDEF',
					borderRadius: 28,
					borderTopRightRadius: isUser ? 6 : 28,
					borderTopLeftRadius: isUser ? 28 : 6,
					padding: '14px 24px',
					fontSize: 38,
					lineHeight: 1.45,
					fontWeight: 600,
					transform: `scale(${s})`,
					transformOrigin: isUser ? 'top right' : 'top left',
					opacity: s,
					boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
				}}
			>
				{children}
			</div>
		</div>
	);
};

// WhatsApp-style phone. Messages stack from the bottom, so new ones push old ones up like a real chat.
export const Phone: React.FC<{items: ChatItem[]}> = ({items}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame, fps, config: {damping: 16}});

	const thinking = items.find((it) => it.from === 'ai' && it.thinkFrames && frame >= it.at - it.thinkFrames && frame < it.at) as
		| Extract<ChatItem, {from: 'ai'}>
		| undefined;
	const typingUser = items.find((it) => it.from === 'user' && it.typeFrames && frame >= it.at - it.typeFrames && frame < it.at) as
		| Extract<ChatItem, {from: 'user'}>
		| undefined;
	const inputText = typingUser
		? typingUser.text.slice(0, Math.ceil(interpolate(frame, [typingUser.at - typingUser.typeFrames!, typingUser.at - 4], [0, typingUser.text.length], {extrapolateRight: 'clamp'})))
		: '';

	return (
		<div
			style={{
				position: 'absolute',
				top: PHONE.top,
				left: (1080 - PHONE.width) / 2,
				width: PHONE.width,
				height: PHONE.height,
				borderRadius: 70,
				border: '14px solid #1c1c22',
				boxShadow: `0 0 0 3px #3a3a44, 0 40px 120px rgba(0,0,0,0.8), 0 0 90px ${colors.violet}55`,
				overflow: 'hidden',
				background: colors.chatBg,
				fontFamily: FONT,
				direction: 'rtl',
				display: 'flex',
				flexDirection: 'column',
				transform: `translateY(${interpolate(enter, [0, 1], [300, 0])}px) scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
				opacity: enter,
			}}
		>
			{/* header */}
			<div style={{background: '#202C33', padding: '26px 30px', display: 'flex', alignItems: 'center', gap: 20}}>
				<Logo size={78} />
				<div style={{display: 'flex', flexDirection: 'column'}}>
					<div style={{color: '#fff', fontSize: 36, fontWeight: 800, direction: 'ltr', textAlign: 'right'}}>Project Alpha Tech</div>
					<div style={{color: thinking ? colors.green : colors.muted, fontSize: 26, fontWeight: 600}}>{thinking ? 'بيكتب…' : 'متصل الآن'}</div>
				</div>
			</div>
			{/* messages */}
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					padding: '0 26px 18px',
					overflow: 'hidden',
					backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 2px, transparent 2px)',
					backgroundSize: '36px 36px',
				}}
			>
				{items.map((it, i) =>
					frame >= it.at ? (
						<Bubble key={i} from={it.from} at={it.at}>
							{it.from === 'user' ? it.text : it.node}
						</Bubble>
					) : null,
				)}
				{thinking ? (
					<Bubble from="ai" at={thinking.at - thinking.thinkFrames!}>
						<TypingDots />
					</Bubble>
				) : null}
			</div>
			{/* input bar */}
			<div style={{background: '#202C33', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16}}>
				<div
					style={{
						flex: 1,
						background: '#2A3942',
						borderRadius: 40,
						padding: '14px 28px',
						fontSize: 32,
						color: inputText ? '#E9EDEF' : colors.muted,
						fontWeight: 600,
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						minHeight: 48,
					}}
				>
					{inputText || 'اكتب رسالة'}
					{inputText && frame % 16 < 8 ? <span style={{color: colors.green}}>|</span> : null}
				</div>
				<div
					style={{
						width: 80,
						height: 80,
						borderRadius: '50%',
						background: colors.green,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${typingUser && frame >= typingUser.at - 6 ? 1.25 : 1})`,
					}}
				>
					<svg width="40" height="40" viewBox="0 0 24 24" style={{transform: 'scaleX(-1)'}}>
						<path d="M2 21l21-9L2 3v7l15 2-15 2z" fill="#0B141A" />
					</svg>
				</div>
			</div>
		</div>
	);
};

export {Logo};
