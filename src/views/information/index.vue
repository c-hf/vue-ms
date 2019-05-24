<template>
    <el-row class="information">
        <el-col :span="16"
                :md="16"
                :lg="12"
                class="information-col">
            <el-steps :active="active"
                      simple
                      finish-status="success"
                      style="margin: 30px 0;">
                <el-step title="个人信息">
                </el-step>
                <el-step title="创建家庭组">
                </el-step>
                <el-step title="开始使用">
                </el-step>
            </el-steps>

            <el-col :span="16"
                    :offset="6"
                    class="information-card">
                <view-user @next="next"
                           :userData="userData"
                           v-if="active === 0" />
                <view-group @next="next"
                            @prev="prev"
                            v-else-if="active === 1" />
                <view-complete v-else
                               :userData="userData"
                               :groupData="groupData" />
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
import ViewUser from './components/user';
import ViewGroup from './components/group';
import ViewComplete from './components/complete';
import { IMGURL } from '@/config';

export default {
	name: 'Information',
	data() {
		return {
			active: 0,
			userData: {
				avatar: IMGURL,
				sex: '',
				birthday: '',
			},
			groupData: {
				groupName: '',
				region: [],
			},
		};
	},

	methods: {
		prev() {
			if (this.active-- < 0) this.active = 0;
		},

		next(data) {
			if (this.active === 0) {
				this.userData = data;
			} else if (this.active === 1) {
				this.groupData = data;
			}
			if (this.active++ > 2) this.active = 0;
		},
	},

	components: {
		ViewUser,
		ViewGroup,
		ViewComplete,
	},
};
</script>

<style lang="scss">
.information {
	width: 100%;
	min-height: 100%;
	background-color: #f5f7fa;
	@include flex-center();

	.information-col {
		height: 100%;

		.information-card {
			height: 580px;
			width: 500px;
			background-color: #fff;
			border-radius: 6px;
			box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.2);
		}
	}
}
</style>
