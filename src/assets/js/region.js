import { getCityInfo, getDistrictInfo } from '@/api/user';

export default {
	// 查找市
	async getCityInfoFn(regionOptions, region) {
		const provinceindex = regionOptions.findIndex(el => {
			return el.value === region[0];
		});
		if (regionOptions[provinceindex].children.length) {
			return;
		}

		await getCityInfo({ adcode: region[0] }).then(resData => {
			regionOptions[provinceindex].children = resData;
		});

		return [regionOptions, provinceindex];
	},

	// 查找县/区
	async getDistrictInfoFn(regionOptions, provinceindex, region) {
		provinceindex = regionOptions.findIndex(el => {
			return el.value === region[0];
		});
		const cityindex = regionOptions[provinceindex].children.findIndex(
			el => {
				return el.value === region[1];
			}
		);

		if (regionOptions[provinceindex].children[cityindex].children.length) {
			return;
		}
		await getDistrictInfo({ adcode: region[1] }).then(resData => {
			regionOptions[provinceindex].children[cityindex].children = resData;
		});

		return [regionOptions, provinceindex, cityindex];
	},
};
