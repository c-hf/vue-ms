<template>
    <div class="fire">
        <div class="flames"
             v-if="flame">
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
        </div>
        <div class="logs"></div>
    </div>
</template>

<script>
export default {
	name: 'AppFlame',
	data() {
		return {};
	},

	computed: {},

	methods: {},

	components: {},

	props: {
		flame: {
			type: Boolean,
			default: false,
		},
	},

	watch: {},

	created() {},

	mounted() {},
};
</script>

<style lang="scss" scoped>
.fire {
	height: 400px;
	width: 100%;
	@include flex-center(column);

	.flames {
		width: 80px;
		height: 80px;
		transform: rotate(45deg);
		position: relative;
	}

	.flame {
		position: absolute;
		right: 0%;
		bottom: 0%;
		width: 0%;
		height: 0%;
		background-color: #ffdc01;
		border-radius: 1vw;
	}

	.flame:nth-child(2n + 1) {
		animation: flameodd 1.5s ease-in infinite;
	}
	.flame:nth-child(2n) {
		animation: flameeven 1.5s ease-in infinite;
	}
	.flame:nth-child(1) {
		animation-delay: 0s;
	}
	.flame:nth-child(2) {
		animation-delay: 0.375s;
	}
	.flame:nth-child(3) {
		animation-delay: 0.75s;
	}
	.flame:nth-child(4) {
		animation-delay: 1.125s;
	}

	.logs {
		width: 200px;
		height: 40px;
		position: relative;

		&:before,
		&:after {
			position: absolute;
			content: '';
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) rotate(20deg);
			height: 100%;
			width: 100%;
			border-radius: 1vw;
			background-color: #70392f;
		}
		&:before {
			transform: translate(-50%, -50%) rotate(-20deg);
			background-color: #612e25;
		}
	}
}

@keyframes flameodd {
	0%,
	100% {
		width: 0%;
		height: 0%;
	}
	25% {
		width: 100%;
		height: 100%;
	}
	0% {
		background-color: #ffdc01;
		z-index: 1000000;
	}
	40% {
		background-color: #fdac01;
		z-index: 1000000;
	}
	100% {
		background-color: #f73b01;
		z-index: -10;
	}
	0% {
		right: 0%;
		bottom: 0%;
	}
	25% {
		right: 1%;
		bottom: 2%;
	}
	100% {
		right: 180%;
		bottom: 200%;
	}
}

@keyframes flameeven {
	0%,
	100% {
		width: 0%;
		height: 0%;
	}
	25% {
		width: 100%;
		height: 100%;
	}
	0% {
		background-color: #ffdc01;
		z-index: 1000000;
	}
	40% {
		background-color: #fdac01;
		z-index: 1000000;
	}
	100% {
		background-color: #f73b01;
		z-index: -10;
	}
	0% {
		right: 0%;
		bottom: 0%;
	}
	25% {
		right: 2%;
		bottom: 1%;
	}
	100% {
		right: 200%;
		bottom: 180%;
	}
}
</style>
