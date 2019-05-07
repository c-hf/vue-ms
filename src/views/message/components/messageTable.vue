<template>
    <div class="view-message-table">
        <el-table :data="messages"
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
                    <group-message v-if="props.row.message.category === 'GROUP'"
                                   :messageData="props.row.message"
                                   @refreshMessage="refreshMessage"
                                   @setLoading="setLoading" />
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
import GroupMessage from './groupMessage';

export default {
	name: 'ViewMessageTable',
	data() {
		return {
			categoryName: {
				GROUP: '家庭组',
				DEVICE: '设备消息',
			},
			expandRowKeys: [],
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

		refreshMessage() {
			this.$emit('refreshMessage');
		},

		setLoading(value) {
			this.$emit('setLoading', value);
		},
	},

	components: {
		GroupMessage,
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
.view-message-table {
	// min-height: 360px;
	flex: 1;
}
</style>
