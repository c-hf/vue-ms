<template>
    <div class="emoji shocked">
        <figure class="face">
            <span class="eyes">
                <span class="eye"></span>
                <span class="eye"></span>
            </span>
            <span class="mouth">
            </span>
        </figure>
    </div>
</template>

<script>
export default {
	name: 'AppEmoji',
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.emoji {
	box-sizing: border-box;
	float: left;
}
.face {
	width: 100px;
	height: 100px;
	position: relative;
	margin: 0 15px 30px 0;
	border-radius: 50%;
	background: #f2dd68;
}

.face:after {
	content: '';
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
	top: -8px;
	left: -8px;
	border-radius: 50%;
	box-shadow: 8px 8px 0 0 rgba(0, 0, 0, 0.07);
}

.eye {
	position: absolute;
	width: 11px;
	height: 11px;
	top: 32px;
	left: 16px;
	z-index: 1;
	border-radius: 50%;
	background: #995710;
}

.eye:last-child {
	left: auto;
	right: 16px;
}

.emoji:hover .eye {
	animation-name: blink;
	animation-iteration-count: infinite;
	animation-duration: 2s;
}

.mouth {
	position: absolute;
	top: 48px;
	left: 0;
	right: 0;
	z-index: 1;
	width: 70px;
	height: 34px;
	margin: 0 auto;
	border-radius: 0 0 70px 70px;
	overflow: hidden;
	background: #995710;
}

.mouth:before,
.mouth:after {
	content: '';
	position: absolute;
	display: block;
}
.shocked {
	.mouth {
		width: 25px;
		height: 25px;
		border-radius: 50%;
	}

	.eye {
		transition: all 0.2s ease-in-out;
	}

	&:hover .eye {
		animation: none;
		transform: scale(1.3, 1.3);
		transition: all 1.5s ease-out;
	}

	&:hover .eye {
		animation: none;
		transform: scale(1.3, 1.3);
		transition: all 1.5s ease-out;
	}
	&:hover .mouth {
		animation-name: wow;
		animation-iteration-count: infinite;
		animation-duration: 2.5s;
	}
}

@keyframes wow {
	70% {
		transform: scale(0.5, 0.5);
	}
	100% {
		transform: scale(1, 1);
	}
}
</style>
