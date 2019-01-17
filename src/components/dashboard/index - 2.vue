<template>
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 520 520"
         class="results__dial">
        <g class="results__dial-circles">
            <g transform="rotate(-90 260 264)">
                <circle class="results__dial-outer"
                        cx="260"
                        cy="264"
                        r="200"
                        fill="none"
                        stroke="#64d3de"
                        stroke-miterlimit="10"
                        opacity="0.6" />
            </g>
            <g transform="rotate(-90 260 264)">
                <circle class="results__dial-track"
                        cx="260"
                        cy="264"
                        r="178"
                        fill="none"
                        stroke="#50afb8"
                        stroke-miterlimit="10"
                        stroke-width="8" />
            </g>
            <g transform="rotate(-90 260 264)">
                <circle class="results__dial-track-perc"
                        ref="trackPerc"
                        cx="260"
                        cy="264"
                        r="178"
                        fill="none"
                        stroke="#fff"
                        stroke-miterlimit="10"
                        stroke-width="8" />
            </g>
        </g>
        <g class="results__dial-markers"
           fill="#64d3de">
            <rect class="results__dial-marker"
                  x="260"
                  y="55"
                  width="1"
                  height="9" />
            <rect class="results__dial-marker"
                  x="260"
                  y="55"
                  width="1"
                  height="9" />
            <rect class="results__dial-marker"
                  x="260"
                  y="55"
                  width="1"
                  height="9" />
            <rect class="results__dial-marker"
                  x="260"
                  y="55"
                  width="1"
                  height="9" />
            <rect class="results__dial-marker"
                  x="260"
                  y="55"
                  width="1"
                  height="9" />
            <rect class="results__dial-marker"
                  x="260"
                  y="55"
                  width="1"
                  height="9" />
        </g>
        <g class="results__dial-percent-text"
           fill="#64d3de"
           font-size="18">
            <text x="255"
                  y="43.99">0%</text>
            <text x="388"
                  y="86.99">10%</text>
            <text x="471"
                  y="199.99">20%</text>
            <text x="470"
                  y="340.99">30%</text>
            <text x="381"
                  y="454.99">40%</text>
            <text x="250"
                  y="495.99">50%</text>
        </g>
        <!-- <g class="">
            <text class="results__dial-perc-text results__text" x="272" y="203.98" fill="#fff">
                <tspan class="results__dial-perc" text-anchor="start">0</tspan>
                <tspan baseline-shift="super">%</tspan>
            </text>
            <text class="results__dial-effect results__text" x="154.43" y="236.67" font-size="16" fill="#64d3de">INCREASE IN HAND HYGIENE
                <tspan x="175" dy="24">EFFECTIVENESS SAVES:</tspan>
            </text>
            <text class="results__dial-results results__text" text-anchor="middle" x="250" y="318" fill="#64d3de">
                <tspan baseline-shift="super">$</tspan>
                <tspan fill="#fff" class="results__dial-saving">0</tspan>
            </text>
        </g> -->
        <g class="results__dial-drag"
           ref="drag"
           fill="#fff">
            <g class="results__dial-drag-inner">
                <circle class="results__dial-drag-hit"
                        cx="260"
                        cy="35"
                        r="30"
                        fill="white"
                        opacity="0" />
                <circle class="results__dial-drag-pad"
                        cx="260"
                        cy="35"
                        r="20" />
                <g class="results__dial-drag-arrows"
                   fill="#092a30">
                    <polygon points="266.73 38.66 266 37.96 268.55 35.48 266 33.01 266.73 32.3 270 35.48 266.73 38.66" />
                    <polygon points="253.27 38.66 254 37.96 251.45 35.48 254 33.01 253.27 32.3 250 35.48 253.27 38.66" />
                    <rect x="251"
                          y="35"
                          width="18"
                          height="1" />
                </g>
            </g>
            <rect class="results__dial-drag-line"
                  x="260"
                  y="55"
                  width="1"
                  height="35" />
        </g>
    </svg>
</template>

<script>
export default {
	name: 'Dashboard',
	data() {
		return {
			trackPerc: {},
			drag: {},
			maxRotation: 179.6,
			// maxRotation: 360,
			rotationSnap: 360 / 100, // snap to 1% increments
		};
	},

	methods: {
		dragUpdate() {
			let val = this.drag._gsTransform.rotation;
			let percentage = Math.round(((val / 180) * 100) / 2);

			if (percentage > 50) {
				percentage = 50;
			} else if (percentage < 0) {
				percentage = '0';
			}
			// $perc.text(percentage);
			this.$TweenMax.set(this.trackPerc, {
				drawSVG: '0% ' + ((val / 180) * 100) / 2 + '%',
			});
			// $saving.text(
			// 	savings.toLocaleString('en', {
			// 		maximumSignificantDigits: 21,
			// 	})
			// ); // change! Locale not massively compatible yet especially on mobile
		},
	},

	mounted() {
		this.trackPerc = this.$refs.trackPerc;

		this.drag = this.$refs.drag;
		this.$TweenMax.set(this.drag, {
			transformOrigin: '50%, 259', // set rotationY to the center of the dial
			rotation: 0,
		});

		this.$Draggable.create(this.drag, {
			type: 'rotation',
			// throwProps: true,
			bounds: {
				maxRotation: this.maxRotation,
				minRotation: 0,
			},
			// snap: function(endValue) {
			// 	console.log(endValue);
			// 	return (
			// 		Math.round(endValue / this.rotationSnap) * this.rotationSnap
			// 	);
			// },
			onDrag: this.dragUpdate,
			// onThrowUpdate: this.dragUpdate,
		});
	},
};
</script>

<style lang="scss" scoped>
</style>
