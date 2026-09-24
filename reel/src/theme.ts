import {continueRender, delayRender, staticFile} from 'remotion';

export const colors = {
	bg: '#07070d',
	bg2: '#12101f',
	green: '#25D366',
	greenDark: '#005C4B',
	violet: '#8B5CF6',
	violetGlow: '#A78BFA',
	pink: '#F43F9E',
	white: '#FFFFFF',
	muted: '#9CA3AF',
	chatBg: '#0B141A',
	aiBubble: '#202C33',
};

export const FONT = 'Cairo';

// The font load occasionally stalls in a render tab, so each attempt times out and retries.
const handle = delayRender('Loading Cairo font', {retries: 2, timeoutInMilliseconds: 60000});
const loadFont = (attempt: number): void => {
	const face = new FontFace(FONT, `url(${staticFile('Cairo.ttf')}?a=${attempt}) format('truetype')`, {weight: '200 1000'});
	const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('font load timed out')), 8000));
	Promise.race([face.load(), timeout])
		.then((loaded) => {
			document.fonts.add(loaded);
			continueRender(handle);
		})
		.catch((err) => {
			console.warn(`Cairo load attempt ${attempt} failed`, err);
			if (attempt < 5) loadFont(attempt + 1);
			else continueRender(handle);
		});
};
loadFont(1);

// Scene lengths in frames (30fps). Total = 1050 frames = 35s.
export const FPS = 30;
export const SCENES = {
	hook: 90,
	twist: 90,
	request: 240,
	edit: 180,
	seo: 180,
	features: 150,
	cta: 120,
};
export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);
