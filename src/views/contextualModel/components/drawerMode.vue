<template>
    <el-scrollbar class="drawer-mode"
                  style="height:100%">
        <div class="drawer-mode-title">
            情景模式
        </div>
        <el-form class="drawer-mode-form"
                 :model="data"
                 :rules="rules"
                 ref="Form"
                 label-width="100px"
                 label-position="top">
            <el-form-item label="模式名称"
                          prop="name">
                <el-input placeholder="模式名称"
                          v-model="data.name"
                          :maxlength="8"
                          :minlength="2"
                          clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="模式类型"
                          prop="timeType">
                <el-radio-group v-model="data.timeType">
                    <el-radio-button :label="0">
                        不定时
                    </el-radio-button>
                    <el-radio-button :label="1">
                        执行一次
                    </el-radio-button>
                    <el-radio-button :label="2">
                        每周执行
                    </el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="data.timeType === 1"
                          label="定时时间"
                          prop="date">
                <el-date-picker v-model="data.date"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item v-if="data.timeType === 2"
                          label="定时时间"
                          prop="time">
                <el-time-picker v-model="data.time"
                                format="HH:mm"
                                placeholder="任意时间点">
                </el-time-picker>
                <ul class="week">
                    <li v-for="(item, index) in weeks"
                        :key="index"
                        :class="{active: data.week.includes(item.value)}"
                        @click="selectWeek(item.value)">
                        {{ item.label }}
                    </li>
                </ul>
            </el-form-item>
        </el-form>

        <div class="drawer-mode-btn">
            <el-button type="primary"
                       plain
                       @click="onSubmit('Form')">
                确定
            </el-button>
            <el-button plain
                       @click="onReset">
                重置
            </el-button>
        </div>

    </el-scrollbar>
</template>

<script>
import { setMode, updateMode } from '@/api/device';
import { WEEKS, RULES } from '../config';

export default {
	name: 'DrawerMode',
	data() {
		return {
			data: this.modeData,
			weeks: WEEKS,
			rules: RULES,
		};
	},

	methods: {
		selectWeek(value) {
			const index = this.data.week.findIndex(el => el === value);
			if (index !== -1) {
				this.data.week.splice(index, 1);
			} else {
				this.data.week.push(value);
			}
		},

		// 提交
		onSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.data.timeType === 2 && !this.data.week.length) {
						this.$message({
							showClose: true,
							message: '请选择时间',
							type: 'warning',
							center: true,
						});
						return;
					}
					let data = {
						name: this.data.name,
						timeType: this.data.timeType,
						time: this.data.time,
						date: this.data.week,
					};
					if (this.data.timeType === 1) {
						data.time = this.data.date;
					}

					if (this.data.modeId) {
						data.modeId = this.data.modeId;
						this.updateModeFn(data);
					} else {
						this.setModeFn(data);
					}
				}
			});
		},

		// 重置
		onReset() {
			this.hour = 0;
			this.minute = 0;
			this.dataTasks = [];
		},

		// 添加封装
		setModeFn(data) {
			this.loading = true;
			setMode(data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('getMode');
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				})
				.then(() => {
					this.loading = false;
				});
		},

		// 更新封装
		updateModeFn(data) {
			this.loading = true;
			updateMode(data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('getMode');
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				})
				.then(() => {
					this.loading = false;
				});
		},
	},

	props: {
		modeData: {
			type: Object,
		},
	},
};
</script>

<style lang="scss">
.drawer-mode {
	&-title {
		padding-top: 20px;
		text-align: center;
		line-height: 60px;
		font-size: 20px;
	}

	&-form {
		padding: 20px;

		.week {
			height: 60px;
			margin-top: 20px;
			@include flex-center();
			li {
				flex: 1;
				text-align: center;
				user-select: none;
				cursor: pointer;
			}

			li.active {
				color: #fff;
				background-color: #409eff;
			}
		}
	}

	&-button {
		margin: 10px 20px;
		@include flex-center();
	}

	&-content {
		height: 320px;
	}

	&-btn {
		padding-top: 30px;
		@include flex-center();
	}
}
</style>
