<template>
    <div class="frame">
        <template v-if="active">
            <svg v-for="(item, index) in 3"
                 :key="index"
                 width="28px"
                 height="60px"
                 class="line">
                <path d="M2,58 C14,45 14,15 2,2"></path>
            </svg>
            <svg v-for="(item, index) in 3"
                 :key="index"
                 width="28px"
                 height="60px"
                 class="line">
                <path d="M12,58 C0,45 0,15 12,2"></path>
            </svg>
        </template>
        <svg width="100px"
             height="108px"
             viewBox="0 0 50 54"
             class="bell"
             :class="{active: active}">
            <path d="M1.13063517,45.0453694 C1.88439195,45.7991262 2.80138269,46.1760046 3.82399539,46.1760046 L17.2955975,46.1760046 C17.2955975,48.331653 18.0493543,50.110423 19.5592683,51.6179365 C21.0667819,53.1254501 22.8983629,53.8816074 25.0012002,53.8816074 C27.1544481,53.8816074 28.9332181,53.1254501 30.4431322,51.6179365 C31.9506457,50.110423 32.7044025,48.331653 32.7044025,46.1760046 L46.1760046,46.1760046 C47.1986173,46.1760046 48.115608,45.7991262 48.8693648,45.0453694 C49.6231216,44.2892122 50,43.3746219 50,42.3496087 C46.1760046,39.1185367 43.3194104,35.1313073 41.379807,30.3879207 C39.4402036,25.6469346 38.4704018,20.6370925 38.4704018,15.408805 C38.4704018,12.0697105 37.5006001,9.48197225 35.6138077,7.54236881 C33.6742042,5.54995439 31.033655,4.41931922 27.6945605,3.98722934 C27.8553939,3.66316194 27.9106054,3.28628355 27.9106054,2.90940516 C27.9106054,2.10043689 27.639349,1.40189159 27.0488262,0.86177925 C26.5087138,0.268855922 25.807768,0 25.0012002,0 C24.192232,0 23.5464977,0.268855922 23.0063853,0.86177925 C22.413462,1.40189159 22.1446061,2.10043689 22.1446061,2.90940516 C22.1446061,3.28628355 22.1974171,3.66316194 22.360651,3.98722934 C19.019156,4.41931922 16.3786068,5.54995439 14.4390033,7.54236881 C12.4993999,9.48197225 11.5295982,12.0697105 11.5295982,15.408805 C11.5295982,20.6370925 10.5597964,25.6469346 8.620193,30.3879207 C6.68058956,35.1313073 3.82399539,39.1185367 0,42.3496087 C0,43.3746219 0.376878391,44.2892122 1.13063517,45.0453694 L1.13063517,45.0453694 Z M20.2050026,45.6911037 C20.52907,45.6911037 20.6899035,45.8519372 20.6899035,46.1760046 C20.6899035,47.3618513 21.1195929,48.384464 21.9837726,49.1934322 C22.7903404,50.0552115 23.8153536,50.4873014 25.0012002,50.4873014 C25.3228672,50.4873014 25.4861011,50.6481348 25.4861011,50.9722022 C25.4861011,51.2938691 25.3228672,51.4571031 25.0012002,51.4571031 C23.5464977,51.4571031 22.3054395,50.9169907 21.2828268,49.894378 C20.2578136,48.8693648 19.7201018,47.6307072 19.7201018,46.1760046 C19.7201018,45.8519372 19.8809352,45.6911037 20.2050026,45.6911037 L20.2050026,45.6911037 Z"></path>
        </svg>
    </div>
</template>


<script>
export default {
	name: 'AppAlarm',
	data() {
		return {};
	},

	computed: {
		active() {
			return this.switch;
		},
	},

	props: {
		switch: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss" scoped>
.frame {
	width: 100%;
	height: 400px;
	overflow: hidden;
	position: relative;
	@include flex-center();

	.bell {
		fill: #c0c4cc;
		transform-origin: 50% 0;
	}

	.bell.active {
		fill: #dd3c54;
		animation: shake 2.5s ease infinite;
	}

	.line {
		fill: none;
		stroke: #dd3c54;
		stroke-width: 2;
		stroke-linecap: round;
	}

	.line:nth-of-type(1),
	.line:nth-of-type(2),
	.line:nth-of-type(3) {
		position: absolute;
		right: 260px;
	}

	.line:nth-of-type(4),
	.line:nth-of-type(5),
	.line:nth-of-type(6) {
		position: absolute;
		left: 260px;
	}

	.line:nth-of-type(1) {
		animation: line-1 2.5s ease-out infinite both;
	}
	.line:nth-of-type(2) {
		animation: line-2 2.5s ease-out infinite both;
	}
	.line:nth-of-type(3) {
		animation: line-3 2.5s ease-out infinite both;
	}
	.line:nth-of-type(4) {
		animation: line-4 2.5s ease-out infinite both;
	}
	.line:nth-of-type(5) {
		animation: line-5 2.5s ease-out infinite both;
	}
	.line:nth-of-type(6) {
		animation: line-6 2.5s ease-out infinite both;
	}
}

@keyframes line-1 {
	0% {
		transform: translate3d(0, 0, 0) scale(1);
		opacity: 1;
	}
	50%,
	100% {
		transform: translate3d(60px, 0, 0) scale(2);
		opacity: 0;
	}
}

@keyframes line-2 {
	0%,
	19% {
		opacity: 0;
	}
	20% {
		transform: translate3d(0, 0, 0) scale(1);
		opacity: 1;
	}
	70%,
	100% {
		transform: translate3d(60px, 0, 0) scale(2);
		opacity: 0;
	}
}

@keyframes line-3 {
	0%,
	39% {
		opacity: 0;
	}
	40% {
		transform: translate3d(0, 0, 0) scale(1);
		opacity: 1;
	}
	90%,
	100% {
		transform: translate3d(60px, 0, 0) scale(2);
		opacity: 0;
	}
}

@keyframes line-4 {
	0% {
		transform: translate3d(0, 0, 0) scale(1);
		opacity: 1;
	}
	50%,
	100% {
		transform: translate3d(-60px, 0, 0) scale(2);
		opacity: 0;
	}
}

@keyframes line-5 {
	0%,
	19% {
		opacity: 0;
	}
	20% {
		transform: translate3d(0, 0, 0) scale(1);
		opacity: 1;
	}
	70%,
	100% {
		transform: translate3d(-60px, 0, 0) scale(2);
		opacity: 0;
	}
}

@keyframes line-6 {
	0%,
	39% {
		opacity: 0;
	}
	40% {
		transform: translate3d(0, 0, 0) scale(1);
		opacity: 1;
	}
	90%,
	100% {
		transform: translate3d(-60px, 0, 0) scale(2);
		opacity: 0;
	}
}

@keyframes shake {
	0%,
	50%,
	100% {
		transform: rotate(0);
	}
	5%,
	10%,
	15%,
	20%,
	25%,
	30%,
	35%,
	40% {
		transform: rotate(6deg);
	}
	45% {
		transform: rotate(4deg);
	}
	7.5%,
	12.5%,
	17.5%,
	22.5%,
	27.5%,
	32.5%,
	37.5%,
	42.5% {
		transform: rotate(-6deg);
	}
	47.5% {
		transform: rotate(-2deg);
	}
}
</style>
