import React from "react";
import { connect } from "dva";
import Modal from "components/Modal";
import { Form, DatePicker } from "antd";
import moment from 'moment';

const FormItem = Form.Item;

const LogSearchValue = ({ analysisDetails, dispatch, form }) => {

	const { visible3, record } = analysisDetails;
	const { getFieldDecorator } = form;

	let begin = record.beginStr;
	let end = record.endStr ? record.endStr : moment().format("YYYY-MM-DD HH:mm:ss");

	const handleSubmit = (e) => {
		e.preventDefault();

		form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			const date = fieldsValue['date'].format('YYYYMMDD');
			const values = {
				date,
				name: record.name,
				group: "default"
			};

			dispatch({
				type: "analysisDetails/queryTransLog",
				payload: {
					...values
				}
			})
		});
	}

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 8 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 },
		},
	};

	const config = {
		rules: [{ type: 'object', required: true, message: '请选择想要查看的日期！' }],
	};

	const onCancel = () => {
		dispatch({
			type: "analysisDetails/save",
			payload: { visible3: false }
		})
	}

	const disabledDate = (current) => {
		const dateFormat = 'YYYY/MM/DD';
		return !(moment(begin, dateFormat).startOf('day') <= current && current <= moment(end, dateFormat).endOf('day'));
	}

	return (
		<Modal
			title="请选择需查看的日志时间"
			visible={visible3}
			zIndex={1020}
			width={600}
			onCancel={onCancel}
			onOk={handleSubmit}
		>
			<Form>
				<FormItem
					{...formItemLayout}
					label="开始时间"
				>
					<span className="ant-form-text">{begin}</span>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="结束时间"
				>
					<span className="ant-form-text">{end ? end : "至今还在运行"}</span>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="查看的日志时间"
				>
					{getFieldDecorator('date', config)(
						<DatePicker disabledDate={disabledDate} format="YYYY-MM-DD" />
					)}
				</FormItem>
			</Form>
		</Modal>
	)
}

export default connect(({ analysisDetails }) => ({
	analysisDetails
}))(Form.create()(LogSearchValue))