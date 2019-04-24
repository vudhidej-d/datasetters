import React, { useState } from 'react'
import { Form, Select, Input, Button, notification } from 'antd'
import { categories, whWords } from './shared'

const { Option } = Select
const { Item: FormItem } = Form
const { TextArea } = Input

const DataCreateForm = (props) => {
  const {
    form: { getFieldDecorator },
    db,
  } = props

  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    const { form: { validateFields } } = props
    e.preventDefault()
    validateFields(async (err, values) => {
      if (err) return
      const categoryId = categories.findIndex((category) => category === values.category)
      const whId = whWords.findIndex((whWord) => whWord === values.wh)
      try {
        setLoading(true)
        await db.collection("dataset").add({
          ...values,
          categoryId,
          whId,
        })
        notification['success']({
          message: 'Data added successfully.',
        });
      } catch (e) {
        console.error(e)
        notification['error']({
          message: 'Something went wrong, please try again.',
        });
      } finally {
        setLoading(false)
      }
    })
  }

  const resizeTextarea = e => {
    const textarea = e.target
    textarea.style.height = ""
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px"
  }

  return (
    <Form>
      <FormItem label="Article ID">
        {getFieldDecorator('articleId', {
          rules: [{ required: true }],
        })(<Input />)}
      </FormItem>
      <FormItem label="Article">
        {getFieldDecorator('article', {
          rules: [{ required: true }],
        })(<Input />)}
      </FormItem>
      <FormItem label="Category">
        {getFieldDecorator('category', {
          initialValue: 'Science',
          rules: [{ required: true }],
        })(<Select>
          {categories.map((category, index) => <Option value={category} key={index}>{category}</Option>)}
        </Select>)}
      </FormItem>
      <FormItem label="Paragraph">
        {getFieldDecorator('paragraph', {
          rules: [{ required: true }],
        })(<TextArea onInput={resizeTextarea} />)}
      </FormItem>
      <FormItem label="WH Word">
        {getFieldDecorator('wh', {
          initialValue: 'Who',
          rules: [{ required: true }],
        })(<Select>
          {whWords.map((whWord, index) => (<Option value={whWord} key={index}>{whWord}</Option>))}
        </Select>)}
      </FormItem>
      <FormItem label="Question">
        {getFieldDecorator('question', {
          rules: [{ required: true }],
        })(<Input />)}
      </FormItem>
      <FormItem label="Answer">
        {getFieldDecorator('answer', {
          rules: [{ required: true }],
        })(<Input />)}
      </FormItem>
      <FormItem style={{ textAlign: 'center' }}>
        <Button
          onClick={handleSubmit}
          style={{ width: 100, height: 40 }}
          type="primary"
          loading={loading}
        >Add</Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(DataCreateForm)
