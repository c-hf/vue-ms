<template>
    <div class='container'>
        <div class='circle'></div>
        <div class='circle'></div>
        <div class='circle'></div>
        <div class='circle'></div>
        <div class='circle'></div>
    </div>
</template>


<script>
export default {
	name: 'AppLightIntensity',
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.container {
	margin: auto;
	width: 160px;
	height: 160px;
	position: relative;
}
.circle:nth-child(1) {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border-width: 2px;
	border-style: solid;
	border-color: transparent;
	transform-origin: center center;

	position: absolute;
	top: 40px;
	left: 40px;
}
.active:nth-child(1) {
	animation: wave1 1.8s ease-in infinite;
	animation-delay: 0.1s;
}

.circle:nth-child(2) {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border-width: 2px;
	border-style: solid;
	border-color: transparent;
	transform-origin: center center;
	animation: wave2 1.8s ease-in infinite;
	animation-delay: 0.2s;
	position: absolute;
	top: 30px;
	left: 30px;
}

.circle:nth-child(3) {
	width: 60px;
	height: 60px;
	border-radius: 50%;
	border-width: 2px;
	border-style: solid;
	border-color: transparent;
	transform-origin: center center;
	animation: wave3 1.8s ease-in infinite;
	animation-delay: 0.3s;
	position: absolute;
	top: 20px;
	left: 20px;
}
.circle:nth-child(4) {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	border-width: 2px;
	border-style: solid;
	border-color: transparent;
	transform-origin: center center;
	animation: wave4 1.8s ease-in infinite;
	animation-delay: 0.4s;
	position: absolute;
	top: 10px;
	left: 10px;
}
.circle:nth-child(5) {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	border-width: 2px;
	border-style: solid;
	border-color: transparent;
	transform-origin: center center;
	animation: wave5 1.8s ease-in infinite;
	animation-delay: 0.5s;
	position: absolute;
	top: 0px;
	left: 0px;
}
@keyframes wave1 {
	0% {
		transform: scale(1);
	}
	10% {
		transform: scale(1.3);
		border-color: #409eff;
	}
	20% {
		transform: scale(1);
	}
	100% {
		transform: scale(1);
		border-color: transparent;
	}
}
@keyframes wave2 {
	0% {
		transform: scale(1);
	}
	10% {
		transform: scale(1.15);
		border-color: #409eff;
	}
	20% {
		transform: scale(1);
	}
	100% {
		transform: scale(1);
		border-color: transparent;
	}
}
@keyframes wave3 {
	0% {
		transform: scale(1);
	}
	10% {
		transform: scale(1.1);
		border-color: #409eff;
	}
	20% {
		transform: scale(1);
	}
	100% {
		transform: scale(1);
		border-color: transparent;
	}
}
@keyframes wave4 {
	0% {
		transform: scale(1);
	}
	10% {
		transform: scale(1.075);
		border-color: #409eff;
	}
	20% {
		transform: scale(1);
	}
	100% {
		transform: scale(1);
		border-color: transparent;
	}
}
@keyframes wave5 {
	0% {
		transform: scale(1);
	}
	10% {
		transform: scale(1.06);
		border-color: #409eff;
	}
	20% {
		transform: scale(1);
	}
	100% {
		transform: scale(1);
		border-color: transparent;
	}
}
</style>
