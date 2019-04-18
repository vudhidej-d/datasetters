import React from 'react'
import { Form, Select, Input, Button } from 'antd'

const { Item: FormItem } = Form
const { TextArea } = Input

const DataCreateForm = (props) => {
  const { form: { getFieldDecorator } } = props

  const handleSubmit = (e) => {
    const { form: { validateFields } } = props
    e.preventDefault()
    validateFields((err, values) => {
      if (err) return
      console.log(values)
    })
  }

  return (
    <Form>
      <FormItem label="Article ID">
        {getFieldDecorator('articleId')(<Input />)}
      </FormItem>
      <FormItem label="Article">
        {getFieldDecorator('article')(<Input />)}
      </FormItem>
      <FormItem label="Category">
        {getFieldDecorator('category')(<Select />)}
      </FormItem>
      <FormItem label="Paragraph">
        {getFieldDecorator('paragraph')(<TextArea />)}
      </FormItem>
      <FormItem label="WH Word">
        {getFieldDecorator('wh')(<Select />)}
      </FormItem>
      <FormItem label="Question">
        {getFieldDecorator('question')(<Input />)}
      </FormItem>
      <FormItem label="Answer">
        {getFieldDecorator('answer')(<Input />)}
      </FormItem>
      <FormItem style={{ textAlign: 'center' }}>
        <Button
          onClick={handleSubmit}
          style={{ width: 100, height: 40 }}
          type="primary"
        >Submit</Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(DataCreateForm)
