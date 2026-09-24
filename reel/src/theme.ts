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

const handle = delayRender('Loading Cairo font');
const face = new FontFace(FONT, `url(${staticFile('Cairo.ttf')}) format('truetype')`, {
	weight: '200 1000',
});
face
	.load()
	.then((loaded) => {
		document.fonts.add(loaded);
		continueRender(handle);
	})
	.catch((err) => {
		console.error(err);
		continueRender(handle);
	});

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
