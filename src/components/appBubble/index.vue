<template>
    <div class="bubble"
         ref="bubble">
        <span class="bubble-mini bubble-mini-1"></span>
        <span class="bubble-mini bubble-mini-3"></span>
        <span class="bubble-num">
            {{animatedNumber}}
            <i>&#8451;</i>
        </span>
        <span class="bubble-icon">
            <i class="active">
                <svg-icon iconClass="icon-zhileng" />
            </i>
            <i>
                <svg-icon iconClass="icon-zhire" />
            </i>
            <i>
                <svg-icon iconClass="icon-time" />
            </i>
        </span>
    </div>
</template>

<script>
export default {
	name: 'AppBubble',
	data() {
		return {
			x: 0,
			y: 0,
			tweenedNumber: 0,
		};
	},

	computed: {
		animatedNumber: function() {
			return this.tweenedNumber.toFixed(0);
		},
	},

	methods: {
		mousemove(event) {
			const x = Math.round(
				(event.clientX - this.$refs.bubble.offsetLeft - 240) / 22
			);
			const y = Math.round(
				(event.clientY - this.$refs.bubble.offsetTop - 133) / 22
			);
			this.x = (x - 5) * 1.5;
			this.y = (y - 5) * 1.5;
			console.log(this.x, -this.y);
		},
	},

	watch: {
		number: function(newValue) {
			/*global TweenLite */
			TweenLite.to(this.$data, 0.5, { tweenedNumber: newValue });
		},
	},

	props: {
		number: {
			type: Number,
		},
	},
};
</script>

<style lang="scss" scoped>
.bubble {
	width: 280px;
	height: 280px;
	border-radius: 50%;
	box-shadow: 0 0 60px 2px rgba(255, 255, 255, 1) inset,
		0 0 100px 30px rgba(255, 255, 255, 0.1) inset,
		0 0 60px 10px rgba($color: #44cdf7, $alpha: 1) inset,
		0 0px 8px 0 rgba($color: #000000, $alpha: 0.2),
		0 6px 16px 0 rgba($color: #000000, $alpha: 0.1);
	// box-shadow: 0 0 0 0.5px rgba($color: #fff, $alpha: 1) inset,
	// 	00 90px 20px rgba(255, 255, 255, 0.1) inset,
	// 	0 0 40px 10px rgba($color: #f56c6c, $alpha: 0.8) inset;
	text-decoration: none;
	position: relative;
	transform: matrix(1, 0, 0, 1, 0, 0);
	cursor: pointer;
	user-select: none;
	@include flex-center(column);

	&::before {
		background-color: rgba($color: #fff, $alpha: 1);
		box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.8) inset;
		border-radius: 50%;
		content: '';
		display: block;
		opacity: 0.5;
		position: absolute;
		top: 50px;
		left: 35px;
		width: 60px;
		height: 10px;
		transform: rotate(-45deg);
	}

	// &::after {
	// 	content: '';
	// 	width: 300px;
	// 	height: 300px;
	// 	border-radius: 50%;
	// 	display: block;
	// 	position: absolute;
	// 	top: -10px;
	// 	left: -10px;
	// 	border: 1px solid #e4e7ed;
	// 	box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.8) inset;
	// 	opacity: 0.5;
	// }

	// &-text {
	// 	font-size: 18px;
	// 	color: #909399;
	// }

	&-num {
		font-size: 64px;
		color: #303133;
		margin-top: 20px;
		position: relative;

		i {
			font-size: 20px;
			align-self: flex-start;
			position: absolute;
			right: -20px;
			top: 0px;
		}
	}

	&-icon {
		font-size: 24px;
		margin-top: 20px;

		@include flex-center();

		i {
			width: 30px;
			height: 30px;
			border-radius: 50%;
			line-height: 30px;
			text-align: center;
			color: #c0c4cc;
			display: block;
			margin: 0 10px;
			opacity: 0.2;
		}
	}
	.active {
		color: #303133;
		opacity: 1;
	}

	&-mini {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		position: absolute;
		bottom: 30px;
		left: 40px;
		box-shadow: 0px 0px 2px rgba(255, 255, 255, 0.6) inset,
			-1px 1px 2px -1px rgba(0, 204, 255, 0.8);
		transform: skew(0deg, 2deg);
		animation: bubbleMini 8s linear infinite;
	}

	&-mini-2 {
		width: 8px;
		height: 8px;
		bottom: 10px;
		left: 80px;
		animation: bubbleMini 15s linear infinite;
	}

	&-mini-3 {
		width: 6px;
		height: 6px;
		bottom: 20px;
		left: 180px;
		animation: bubbleMini 15s linear infinite;
	}

	@keyframes bubbleMini {
		0% {
			transform: translate(0px, 0px);
			opacity: 0;
			border-color: rgba(255, 255, 255, 0.2);
		}
		10% {
			transform: translate(0px, 0px);
			opacity: 1;
		}
		30% {
			transform: translate(-1px, -30px);
		}
		50% {
			transform: translate(1px, -70px);
		}
		75% {
			transform: translate(-1px, -120px) scale(1.2);
		}
		98% {
			opacity: 1;
			border-color: rgba(255, 255, 255, 0.35);
		}
		100% {
			transform: translate(0px, -180px) scale(1.4);
			opacity: 0;
			border-color: rgba(255, 255, 255, 0.2);
		}
	}
}
</style>
