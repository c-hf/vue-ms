<template>
    <div class="app-lamp"
         :style="{'background-image': background,'box-shadow': shadow}">
        <span class="gonna-give-light">
        </span>
    </div>
</template>

<script>
export default {
	name: 'AppLamp',
	data() {
		return {
			lampSwitch: true,
		};
	},

	computed: {
		shadow() {
			if (!this.switch || this.luminance === 0) {
				return '';
			}
			return `0px 2px 5px rgba(${this.bgColorEnd}, ${0.6 *
				this.luminance}) inset,
            0px 2px 10px rgba(${this.bgColorEnd}, ${0.6 * this.luminance}),
            0px 5px 40px 10px rgba(${this.bgColorEnd}, ${0.6 * this.luminance}),
            0px 8px 80px 
            ${22.2 * this.luminance + 17.8}px rgba(${this.bgColorEnd}, 
            ${0.4 * this.luminance}),
            0px 8px 120px 
            ${44.4 * this.luminance + 35.6}px 
            rgba(${this.bgColorEnd}, ${0.2 * this.luminance})`;
		},

		background() {
			if (!this.switch || this.luminance === 0) {
				return '';
			}
			return `radial-gradient(
                rgba(${this.bgColorStart}, ${0.6 * this.luminance + 0.4}) 10%,
                rgba(${this.bgColorEnd}, ${0.6 * this.luminance + 0.4}) 100%)`;
		},

		bgColorStart() {
			let color = '255,254,255';
			if (this.color === 1) {
				color = '245,108,108';
			} else if (this.color === 2) {
				color = '103,194,58';
			} else if (this.color === 3) {
				color = '64,158,255';
			}
			return color;
		},

		bgColorEnd() {
			let color = '255,253,220';
			if (this.color === 1) {
				color = '248,179,179';
			} else if (this.color === 2) {
				color = '151, 200, 127';
			} else if (this.color === 3) {
				color = '140, 197, 235';
			}
			return color;
		},
	},

	props: {
		luminance: {
			type: Number,
			default: 0,
		},

		switch: {
			type: Boolean,
			default: false,
		},

		color: {
			type: Number,
			default: 0,
		},
	},
};
</script>

<style lang="scss" scoped>
.app-lamp {
	width: 150px;
	height: 150px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0);
	box-shadow: inset 2px -2px 10px rgba(255, 255, 255, 0.5),
		0px 0px 10px 20px rgba(255, 255, 255, 0.5);
	// border: 1px solid rgba(255, 255, 255, 0.8);
	box-shadow: 0px 0px 50px rgba(255, 255, 255, 0.8);
	transition: all 0.5s;
	position: relative;
}

.app-lamp::after {
	content: '';
	display: block;
	top: -72px;
	left: 50%;
	width: 20px;
	height: 80px;
	margin-left: -10px;
	position: absolute;
	background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
		linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
		linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
	background-repeat: no-repeat;
	background-size: 2px 52px, 6px 12px, 10px 20px;
	background-position: 50% 0, 50% 40px, 50% 50px;
}

.app-lamp::before {
	left: -1.65rem;
	bottom: -4rem;
	width: 4rem;
	height: 4rem;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.03);
	box-shadow: inset 2px -2px 10px rgba(255, 255, 255, 0.07);
	transition: all 0.5s;
}

.gonna-give-light,
.gonna-give-light::before {
	position: absolute;
}

.gonna-give-light {
	top: 0;
	left: 50%;
	width: 0;
	height: 50px;
	margin-left: -1px;
	border-right: 2px solid rgba(255, 255, 255, 0.3);
}

.gonna-give-light::before {
	content: '';
	top: 50px;
	left: 50%;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	margin-left: -16px;
	border: 2px solid rgba(255, 255, 255, 0.3);
	box-shadow: 0px 0px 50px rgba(255, 255, 255, 0.4);
}

// .lamp-active {
// background-image: radial-gradient(
// 	#fffeff 0%,
// 	rgba($color: #fff, $alpha: 1) 100%
// );
// background-image: radial-gradient(
// 	rgba($color: #fffeff, $alpha: 1) 0%,
// 	rgba($color: #fffdcd, $alpha: 1) 100%
// );
// box-shadow: 0px 2px 10px 10px rgba(255, 255, 255, 0.4) inset,
// 	0px 2px 10px rgba(255, 255, 255, 0.8),
// 	0px 5px 50px rgba(255, 255, 255, 0.8),
// 	0px 8px 80px 40px rgba(255, 255, 255, 0.6),
// 	0px 8px 120px 80px rgba(255, 255, 255, 0.6);

// box-shadow: 0px 2px 5px rgba($color: #fffddc, $alpha: 0.6) inset,
// 	0px 2px 10px rgba($color: #fffddc, $alpha: 0.6),
// 	0px 5px 40px 10px rgba($color: #fffddc, $alpha: 0.4),
// 	0px 8px 80px 30px rgba($color: #fffddc, $alpha: 0.2),
// 	0px 8px 120px 60px rgba($color: #fffddc, $alpha: 0.2);
// }
</style>
