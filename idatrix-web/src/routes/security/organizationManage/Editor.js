import { Form, Input,Button, TreeSelect } from 'antd';
import { convertArrayToTree } from '../../../utils/utils';
import { DEFAULT_SUBMIT_DURATION } from 'constants';
import Modal from 'components/Modal';
const FormItem = Form.Item;
const { TextArea } = Input;


const formItemLayout = {
  //标题：span表示长度不是指字符个数，offset表示间距
  labelCol: {
    sm: { span: 6, offset:0 }
  },
  //输入框：xm表示x轴布局
  wrapperCol: {
    sm: { span: 17, offset:0 }
  },
};

function mapTreeList(list) {
  if (!list) return null;
  return list.map(item => {
    const id = String(item.id);
    item.label = item.deptName;
    item.value = id;
    item.key = id;
    item.children = mapTreeList(item.childList);
    return item;
  })
}

class Editor extends React.Component {

  state = {
    confirmLoading: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.props.form.resetFields();
      this.setState({ confirmLoading: false });
    }
  }

  handleOk() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const formData = { ...this.props.data, ...values };
       /* this.setState({ confirmLoading: true });*/
        setTimeout(() => {
          try {
            this.setState({ confirmLoading: false })
          } catch (err) {}
        }, DEFAULT_SUBMIT_DURATION);
        this.props.onOk(formData);
      }
    });
  }

  handleCancel() {
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, selectData } = this.props;
    // const treeData = mapTreeList(convertArrayToTree(selectData, ''));
    console.log(data,"数据");
    return (<Modal
      title={this.props.title}
      visible={this.props.visible}
      onOk={this.handleOk.bind(this)}
      onCancel={this.handleCancel.bind(this)}
      maskClosable={false}
      width={600}
      confirmLoading={this.state.confirmLoading}
    >
      <Form>
        <FormItem
          label="组织机构名称："
          {...formItemLayout}
        >
          {getFieldDecorator('deptName', {
            initialValue: data.deptName,
            rules: [{ required: true, message: '请填写组织机构名称' },{  message: '只能允许中文、数字、字母和下划线作为组织机构名称' ,pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/}],
          })(
            <Input maxLength="50" spellCheck={false}/>
          )}
        </FormItem>
        <FormItem
          label="组织机构代码："
          {...formItemLayout}
        >
          {getFieldDecorator('deptCode', {
            initialValue: data.deptCode,
            rules: [{ required: true, message: '请填写组织机构代码' },{pattern:/^[0-9]+$/,message: '只能数字作为组织机构代码' ,}],
          })(
            <Input maxLength="50" spellCheck={false}/>
          )}
        </FormItem>
         <FormItem
          label="统一社会信用代码"
          {...formItemLayout}
        >
          {getFieldDecorator('unifiedCreditCode', {
            initialValue: data.unifiedCreditCode,
            rules: [{ required: true, message: '请填写统一社会信用代码' },{pattern:/^[0-9a-zA-Z]+$/,message: '只能数字与字母作为统一社会信用代码' ,}],
          })(
            <Input maxLength="50" spellCheck={false}/>
          )}
        </FormItem>

        {/*<FormItem
          label="上级组织机构："
          {...formItemLayout}
        >
          {getFieldDecorator('parentId', {
            initialValue: data.parentId,
            rules: [{ required: true, message: '请选择上级组织机构！' }],
          })(
            <TreeSelect
              placeholder="请选择组织机构"
              treeData={treeData}
              onChange={this.handleSelectChange}
            />
          )}
        </FormItem>*/}

        <FormItem
          label="描述："
          {...formItemLayout}
        >
          {getFieldDecorator('remark', {
            initialValue: data.remark,
          })(
            <TextArea rows={4} maxLength="100" type="textarea"  spellCheck={false}/>
          )}
        </FormItem>
      </Form>
    </Modal>);
  }
}

export default Form.create()(Editor);
