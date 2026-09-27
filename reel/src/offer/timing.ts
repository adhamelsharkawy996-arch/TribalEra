// Beat lengths in frames (30fps). Total = 885 frames = 29.5s.
export const OFFER_SCENES = {
	hook: 75,
	gather: 165,
	prototype: 90,
	sameday: 150,
	offer: 300,
	cta: 105,
};
export const OFFER_TOTAL = Object.values(OFFER_SCENES).reduce((a, b) => a + b, 0);
export type OfferScene = keyof typeof OFFER_SCENES;

export const NORA_TITLE = 'نورا · Project Alpha Tech';
