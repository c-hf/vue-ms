<template>
    <div class="view-message-list">
        <el-table class="view-message-list-table"
                  :data="messages"
                  empty-text="暂无消息"
                  highlight-current-row
                  ref="multipleTable"
                  tooltip-effect="dark"
                  :cell-style="cellStyle"
                  @selection-change="selectChange"
                  @expand-change="expandChange">
            <el-table-column type="selection"
                             width="30">
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <view-group-message v-if="props.row.message.category === 'GROUP'"
                                        :messageData="props.row.message" />
                </template>
            </el-table-column>
            <el-table-column label=""
                             width="40">
                <template slot-scope="scope">
                    <svg-icon v-if="scope.row.message.type === 'WARN'"
                              iconClass="icon-jinggao" />
                    <i v-else></i>
                </template>
            </el-table-column>
            <el-table-column label="消息内容"
                             width="">
                <template slot-scope="scope">
                    {{ scope.row.message.title }}
                </template>
            </el-table-column>
            <el-table-column class="color"
                             :show-overflow-tooltip="true"
                             label="接收时间"
                             width="200">
                <template slot-scope="scope">
                    {{ new Date(scope.row.message.createTime).toLocaleString('zh-CN', { hour12: false }) }}
                </template>
            </el-table-column>
            <el-table-column class="color"
                             :show-overflow-tooltip="true"
                             label="消息类型"
                             width="200">
                <template slot-scope="scope">
                    {{ categoryName[scope.row.message.category] }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import ViewGroupMessage from './viewGroupMessage';

export default {
	name: 'ViewMessageList',
	data() {
		return {
			categoryName: {
				GROUP: '家庭组',
				DEVICE: '设备消息',
			},
		};
	},

	methods: {
		// 单元格样式设置
		cellStyle({ row, columnIndex }) {
			if (columnIndex === 4 || columnIndex === 5) {
				return 'color:#909399;';
			}

			if (columnIndex === 3 && row.status === 'READ') {
				return 'color:#C0C4CC;';
			}
		},

		// 多选
		selectChange(selection) {
			const selectMessages = [];
			selection.forEach(el => {
				selectMessages.push({
					messageId: el.messageId,
					status: el.status,
				});
			});
			if (selection.length) {
				this.$emit('selectChange', selectMessages, false);
			} else {
				this.$emit('selectChange', selectMessages, true);
			}
		},

		// 展开详情页标记已读
		expandChange(row) {
			if (row.status === 'UNREAD') {
				row.status = 'READ';
				this.$emit('updateMessageStatus', [row.messageId]);
			}
		},
	},

	components: {
		ViewGroupMessage,
	},

	props: {
		messages: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.view-message-list {
	&-table {
		min-height: 400px;
		min-height: calc(100vh - 400px);
	}
}
</style>
