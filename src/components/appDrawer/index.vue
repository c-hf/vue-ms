<template>
    <transition name="show">
        <div class="drawer-wrap"
             v-show="show">
            <transition name="show">
                <div class="drawer-mask"
                     v-show="show"
                     @click="updateShow">
                </div>
            </transition>
            <transition name="show-content">
                <div class="drawer-content"
                     v-show="show"
                     :style="{width: `${width}px`}">
                    <slot>
                    </slot>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
export default {
	name: 'AppDrawer',
	data() {
		return {};
	},

	methods: {
		updateShow() {
			this.$emit('update:show', false);
		},
	},

	props: {
		width: {
			type: Number,
			default: 480,
		},

		show: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss" scoped>
.drawer-wrap {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 2000;
	overflow: hidden;

	.drawer-mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0.5;
		background: #000;
		z-index: 2100;
	}

	.drawer-content {
		position: absolute;
		right: 0;
		top: 0;
		width: 400px;
		height: 100%;
		z-index: 2200;
		background-color: #fff;
		overflow: hidden;
	}
}

.show-enter-active,
.show-leave-active {
	transition: opacity 0.3s;
}
.show-enter,
.show-leave-to {
	opacity: 0;
}

.show-content-enter-active,
.show-content-leave-active {
	transition: all 0.4s;
}
.show-content-enter,
.show-content-leave-to {
	transform: translateX(400px);
}
</style>

