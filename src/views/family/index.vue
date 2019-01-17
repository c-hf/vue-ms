<template>
    <el-card class="family"
             shadow="never">
        <el-row :gutter="24">
            <el-col :span="18"
                    :md="16"
                    :lg="18"
                    class="family-left">
                <el-col :span="24">
                    <info-card />
                </el-col>
                <el-col :span="24">
                    <rooms-info />
                </el-col>
            </el-col>
            <el-col :span="6"
                    :md="8"
                    :lg="6"
                    class="family-right">
                <member @addMember="addMember" />
            </el-col>
        </el-row>

    </el-card>
</template>

<script>
import Member from './member';
import InfoCard from './infoCard';
import RoomsInfo from './roomsInfo';

export default {
	name: 'Family',
	data() {
		return {};
	},
	methods: {
		addMember() {},
	},
	components: {
		Member,
		InfoCard,
		RoomsInfo,
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';
.family {
	background-color: inherit;

	.el-form {
		display: flex;
		padding: 0 20px;

		&-item:nth-of-type(1) {
			width: 400px;
		}

		&-item:nth-of-type(2) {
			width: 80px;
			margin-left: 20px;
		}
	}

	.search-result {
		padding: 0 20px;

		&-title {
			display: block;
			width: 100%;
			padding-bottom: 20px;
		}
	}

	.user {
		height: 60px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: start;
		position: relative;
		cursor: pointer;

		// 遮罩
		&:hover .member-mask-layer {
			width: 100%;
			height: 100%;
			background: #000;
			opacity: 0.1;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 12;
		}
		&-avatar {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			display: block;
			position: relative;
			z-index: 15;

			img {
				border-radius: 50%;
			}
		}

		&-info {
			width: 60%;
			text-align: left;
			margin-left: 5%;
			position: relative;
			z-index: 15;

			&-nickName {
				font-size: 16px;
			}
			&-id {
				margin-left: 10px;
				color: #99a9bf;
			}
		}
		&-btn {
			position: absolute;
			right: 20px;
			z-index: 15;
		}
	}
}
</style>
