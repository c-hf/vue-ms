<template>
    <el-card class="view-weather"
             v-loading="loading"
             :body-style="{display: 'flex'}">
        <div class="view-weather-header"
             slot="header">
            <span class="view-weather-currentTime">
                <svg-icon iconClass="icon-time" />
                {{ currentTime }}
            </span>
            <span class="view-weather-region">
                <svg-icon iconClass="icon-weizhi" />
                {{ city }}，{{ district }}
            </span>
        </div>
        <div class="view-weather-left">
            <svg-icon class="view-weather-icon"
                      :iconClass="data.icon" />
        </div>
        <div class="view-weather-right">
            <div class="view-weather-weatherInfo">
                <span class="view-weather-temperature">
                    {{data.temperature}}
                    <i class="view-weather-temperature-unit">&#8451;</i>
                </span>
                <span class="view-weather-weather">
                    {{ data.weather }}
                </span>
                <span class="view-weather-humidity">
                    <svg-icon iconClass="icon-shidu" />
                    湿度 {{ data.humidity }} %
                </span>
            </div>
            <span class="view-weather-info">
                <i>
                    <svg-icon iconClass="icon-fengxiang" />
                    风向 {{ data.winddirection }}
                </i>
                <i>
                    <svg-icon iconClass="icon-fengli" />
                    风力 {{data.windpower}}
                </i>
            </span>
            <span class="view-weather-reporttime">
                <svg-icon iconClass="icon-time" />
                发布时间 {{data.reporttime}}
            </span>
        </div>
    </el-card>
</template>

<script>
import { getWeatherInfo } from '@/api/user';
import { WEATHERICON } from '@/config';

export default {
	name: 'ViewWeather',
	data() {
		return {
			currentTime: '',
			weatherIcon: WEATHERICON,
			loading: false,
			data: {
				province: '北京',
				adcode: '110101',
				city: '东城区',
				weather: '未知',
				icon: 'icon-unknown',
				humidity: '0',
				temperature: '0',
				winddirection: '北',
				windpower: '0',
				reporttime: '2018-12-23 18:00:00',
			},
		};
	},

	computed: {
		city() {
			if (this.$store.state.group.region) {
				return this.$store.state.group.region[1].name;
			}
			return '北京';
		},

		district() {
			if (this.$store.state.group.region) {
				this.getWeather(this.$store.state.group.region[2].adcode);
				return this.$store.state.group.region[2].name;
			}
			return '东城区';
		},
	},

	methods: {
		// 获取天气
		getWeather(adcode) {
			const weather = this.$store.state.weather;
			if (!weather.adcode) {
				this.getWeatherInfoFn(adcode);
				return;
			}
			const curTime = new Date().getTime();
			if (curTime - weather.updateTime >= 30 * 60 * 1000) {
				this.getWeatherInfoFn(adcode);
			} else {
				this.data = weather;
			}
		},

		// 获取天气封装
		getWeatherInfoFn(adcode) {
			this.loading = true;
			getWeatherInfo({ city: adcode })
				.then(resData => {
					this.data = resData.lives[0];
					this.data.icon = this.weatherIcon[resData.lives[0].weather];
					const curTime = new Date().getTime();
					this.data.updateTime = curTime;
					this.$store.dispatch('weather', this.data);
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

		// 时间
		dealWithTime(date) {
			let [H, Min, W, time] = [
				date.getHours(),
				date.getMinutes(),
				date.getDay(),
				'',
			];
			const Week = {
				'1': '一',
				'2': '二',
				'3': '三',
				'4': '四',
				'5': '五',
				'6': '六',
				'0': '日',
			};
			W = Week[W];
			if (Min < 10) {
				Min = '0' + Min;
			}
			if (H < 10) {
				H = '0' + H;
			}
			time = `星期${W}，${H} : ${Min}`;
			return time;
		},
	},

	mounted() {
		// 页面加载完后显示当前时间
		this.currentTime = this.dealWithTime(new Date());

		// 定时器
		this.timer = setInterval(() => {
			this.currentTime = this.dealWithTime(new Date()); // 修改数据date
		}, 1000);
	},

	destroyed() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	},
};
</script>

<style lang="scss" scoped>
.view-weather {
	margin-bottom: 20px;

	&-header {
		height: 23px;
		@include flex-between();
	}
	&-left {
		width: 40%;
		height: 180px;
		@include flex-center();
	}
	&-right {
		width: 60%;
		height: 180px;
		padding-left: 20px;
		@include flex-center(column);
		align-items: baseline;
	}

	&-icon {
		width: 120px;
		height: 120px;
	}

	&-weatherInfo {
		width: 80%;
		@include flex-between();

		&-icon {
			align-items: center;
			font-size: 24px;
		}
	}

	&-temperature {
		display: flex;
		font-size: 50px;
		&-unit {
			margin-left: 5px;
			align-items: flex-start;
			font-size: 18px;
		}
	}

	&-weather {
		font-size: 18px;
	}

	&-humidity {
		font-size: 18px;
	}

	&-info {
		width: 100%;
		color: #909399;
		margin-top: 20px;

		@include flex-start();

		i:nth-last-of-type(1) {
			margin-left: 10%;
		}
	}

	&-reporttime {
		width: 100%;
		color: #909399;
		margin-top: 20px;
	}
}
</style>
