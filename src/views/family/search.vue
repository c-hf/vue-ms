<template>
    <div class="search">
        <div class="user"
             v-for="(item, index) in userList"
             :key="index">
            <span class="user-avatar">
                <img :src="item.avatar"
                     :alt="item.nickName">
            </span>
            <span class="user-info">
                <i class="user-info-nickName">
                    {{ item.nickName }}
                </i>
                <i class="user-info-nickName">
                    {{ item.userId }}
                </i>
            </span>
            <div class="user-mask-layer">
            </div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'Search',
	data() {
		return {};
	},
	props: {
		userList: {
			type: Array,
		},
	},
};
</script>

<style lang="scss" scoped>
.search {
	.user {
		height: 60px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: start;
		position: relative;
		cursor: pointer;

		// 遮罩
		&:hover .user-mask-layer {
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
				height: 100%;
				width: 100%;
				border-radius: 50%;
			}
		}

		&-info {
			width: 50%;
			text-align: left;
			margin-left: 5%;
			position: relative;
			z-index: 15;

			&-nickName {
				font-size: 16px;
			}
			&-intro {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-left: 14px;
				font-size: 10px;
				color: #99a9bf;
			}
		}
	}
}
</style>
