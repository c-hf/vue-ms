<template>

    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 520 520">
        <g>
            <circle r="200"
                    cy="260"
                    cx="260"
                    fill="none"
                    stroke="#909399"
                    stroke-miterlimit="10"
                    stroke-width="1"
                    opacity="0.5" />
            <path d="M 260 100 a 160 160 0 1 1 0 320 a 160 160 0 1 1 0 -320"
                  stroke-linecap="round"
                  stroke="#fff"
                  stroke-width="10"
                  fill="none"></path>
            <!-- <circle r="160"
                        cy="260"
                        cx="260"
                        fill="none"
                        stroke="#409EFF"
                        stroke-miterlimit="10"
                        opacity="0.8" /> -->
            <g ref="dial-markers"
               fill="#909399">
                <rect x="260"
                      y="50"
                      width="2"
                      height="10"
                      class="dial-marker"
                      :class="{ active: percentage === 30 }" />
                <rect x="260"
                      y="50"
                      width="2"
                      height="10"
                      class="dial-marker"
                      :class="{ active: percentage >= 28 }" />
                <rect x="260"
                      y="50"
                      width="2"
                      height="10"
                      class="dial-marker"
                      :class="{ active: percentage >= 26 }" />
                <rect x="260"
                      y="50"
                      width="2"
                      height="10"
                      class="dial-marker"
                      :class="{ active: percentage >= 24 }" />
                <rect x="260"
                      y="50"
                      width="2"
                      height="10"
                      class="dial-marker"
                      :class="{ active: percentage >= 22 }" />
                <rect x="260"
                      y="50"
                      width="2"
                      height="10"
                      class="dial-marker"
                      :class="{ active: percentage >= 20 }" />
                <rect x="260"
                      y="50"
                      width="2"
                      height="10"
                      class="dial-marker"
                      :class="{ active: percentage >= 18 }" />
                <rect x="260"
                      y="50"
                      width="2"
                      height="10"
                      class="dial-marker"
                      :class="{ active: percentage >= 16 }" />
            </g>
        </g>
        <g ref="drag"
           class="dial-drag">
            <circle r="30"
                    cy="60"
                    cx="260"
                    fill="#fff"
                    stroke="#fff"
                    stroke-miterlimit="10"
                    stroke-width="2" />
        </g>
    </svg>

</template>

<script>
export default {
	name: 'Dashboard',
	data() {
		return {
			dashoffset: 534.07,
			drag: {},
			minRotation: -30,
			maxRotation: 180,
			rotationSnap: 180 / 14,
			percentage: 16,
		};
	},

	methods: {
		dragUpdate() {
			let val = this.drag._gsTransform.rotation;
			let percentage = Math.round((218 + 7 * val) / 105);
			this.percentage = percentage + 16;
			let Num = 540 * ((14 - percentage) / 14);
			if (Num > 530) {
				Num = 530;
			}
			this.dashoffset = Num;
			// $perc.text(percentage);
			// this.$TweenMax.set(this.trackPerc, {
			// 	drawSVG: '0% ' + ((val / 180) * 100) / 2 + '%',
			// });
			// $saving.text(
			// 	savings.toLocaleString('en', {
			// 		maximumSignificantDigits: 21,
			// 	})
			// ); // change! Locale not massively compatible yet especially on mobile
		},
		//dial-text
		setDialtext() {},

		setDialMarkers() {
			this.$TweenMax.staggerTo(
				this.$refs['dial-markers'].querySelectorAll('rect'),
				0.8,
				{
					cycle: {
						rotation: function(i) {
							return 180 - 30 * i;
						},
					},
					/* global Power2 */
					ease: Power2.easeOut,
				},
				0.1
			);
		},
	},

	props: {},

	mounted() {
		this.drag = this.$refs.drag;
		this.dialMarkers = this.$refs['dial-markers'].querySelectorAll('rect');
		this.$TweenMax.set(this.dialMarkers, {
			transformOrigin: '50% 210',
			rotation: -30,
		});
		this.setDialMarkers();
		this.$TweenMax.set(this.drag, {
			transformOrigin: '50%, 230',
			rotation: -30,
		});

		this.$Draggable.create(this.drag, {
			type: 'rotation',
			throwProps: true,
			bounds: {
				maxRotation: this.maxRotation,
				minRotation: this.minRotation,
			},
			snap: endValue => {
				return (
					Math.round(endValue / this.rotationSnap) * this.rotationSnap
				);
			},
			onDrag: this.dragUpdate,
			onThrowUpdate: this.dragUpdate,
		});
	},
};
</script>

<style lang="scss" scoped>
.dial {
	position: relative;
	z-index: 5;
	.active {
		fill: #909399;
	}

	&-content {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		text-align: center;
		font-size: 48px;
		margin: -50%;
		transform: translateY(-50%);
		z-index: 3;
	}
}

.dial-drag {
	position: relative;
}

// .dial-text {

// }
</style>

