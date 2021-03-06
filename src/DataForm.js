import React, { useState } from 'react'
import { Form, Select, Input, Button, notification } from 'antd'
import axios from 'axios'
import { get, omit } from 'lodash'
import { categories, whWords } from './shared'
import Spin from './Spin'

const { Option } = Select
const { Item: FormItem } = Form
const { TextArea } = Input

const DataForm = (props) => {
  const {
    form: { getFieldDecorator },
    db,
    mode,
    closeModal,
    setTempData,
  } = props

  const [loading, setLoading] = useState(false)
  const [paragraphLoading, setParagraphLoading] = useState(false)
  const [questionLoading, setQuestionLoading] = useState(false)
  const [answerLoading, setAnswerLoading] = useState(false)
  const [articleIdLoading, setArticleIdLoading] = useState(false)

  const handleCreate = (e) => {
    const { form: { validateFields } } = props
    e.preventDefault()
    validateFields(async (err, values) => {
      if (err) return
      const categoryId = categories.findIndex((category) => category === values.category)
      const whId = whWords.findIndex((whWord) => whWord === values.wh)
      try {
        setLoading(true)
        const data = {
          ...values,
          categoryId,
          whId,
        }
        await db.collection('dataset').add(data)
        setTempData(data)
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

  const handleEdit = (e) => {
    const { form: { validateFieldsAndScroll } } = props
    e.preventDefault()
    validateFieldsAndScroll(async (err, values) => {
      if (err) return
      const categoryId = categories.findIndex((category) => category === values.category)
      const whId = whWords.findIndex((whWord) => whWord === values.wh)
      const { id } = values
      const data = omit(values, 'id')
      try {
        setLoading(true)
        const dataRef = db.collection('dataset').doc(id)
        await dataRef.update({
          ...data,
          categoryId,
          whId,
        })
        notification['success']({
          message: 'Data edited successfully.',
        });
      } catch (e) {
        console.error(e)
        notification['error']({
          message: 'Something went wrong, please try again.',
        });
      } finally {
        setLoading(false)
        closeModal()
      }
    })
  }

  const onBlur = (fieldName, setLoading) => async ({ target: { value } }) => {
    if (!value) return
    try {
      const { form: { setFieldsValue, getFieldValue } } = props
      const prevValue = getFieldValue(fieldName) || ''
      if (prevValue.split(',').join('') === value) return
      setLoading(true)
      const res = await axios.post(`https://py-thai-tokenizer.herokuapp.com/icu`, {
        text: value
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      const { data: { tokens } } = res
      setFieldsValue({ [fieldName]: tokens })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const onBlurTitle = (fieldName, setLoading) => async ({ target: { value } }) => {
    if (!value) return
    try {
      const { form: { setFieldsValue, getFieldValue } } = props
      const prevValue = getFieldValue(fieldName) || ''
      if (prevValue.split(',').join('') === value) return
      setLoading(true)
      const res = await axios.post(`https://py-thai-tokenizer.herokuapp.com/wiki`, {
        title: value
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      const { data: { id } } = res
      setFieldsValue({ [fieldName]: id })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resizeTextarea = e => {
    const textarea = e.target
    textarea.style.height = ""
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px"
  }

  getFieldDecorator('id')

  return (
    <Form>
      <FormItem colon={false} label={<span>Article ID {articleIdLoading && <Spin />}</span>}>
        {getFieldDecorator('articleId', {
          rules: [{ required: true }],
        })(<Input disabled />)}
      </FormItem>
      <FormItem colon={false} label="Article">
        {getFieldDecorator('article', {
          rules: [{ required: true }],
        })(<Input onBlur={onBlurTitle('articleId', setArticleIdLoading)} />)}
      </FormItem>
      <FormItem colon={false} label="Category">
        {getFieldDecorator('category', {
          initialValue: 'Science',
          rules: [{ required: true }],
        })(<Select>
          {categories.map((category, index) => <Option value={category} key={index}>{category}</Option>)}
        </Select>)}
      </FormItem>
      <FormItem colon={false} label="Paragraph">
        {getFieldDecorator('paragraph', {
          rules: [{ required: true }],
        })(<TextArea onInput={resizeTextarea} onBlur={onBlur('paragraphTokens', setParagraphLoading)} />)}
      </FormItem>
      <FormItem colon={false} label={<span>Paragraph Tokens {paragraphLoading && <Spin />}</span>}>
        {getFieldDecorator('paragraphTokens', {
          rules: [{ required: true }],
        })(<TextArea />)}
      </FormItem>
      <FormItem colon={false} label="WH Word">
        {getFieldDecorator('wh', {
          initialValue: 'Who',
          rules: [{ required: true }],
        })(<Select>
          {whWords.map((whWord, index) => (<Option value={whWord} key={index}>{whWord}</Option>))}
        </Select>)}
      </FormItem>
      <FormItem colon={false} label="Question">
        {getFieldDecorator('question', {
          rules: [{ required: true }],
        })(<Input onBlur={onBlur('questionTokens', setQuestionLoading)} />)}
      </FormItem>
      <FormItem colon={false} label={<span>Question Tokens {questionLoading && <Spin />}</span>}>
        {getFieldDecorator('questionTokens', {
          rules: [{ required: true }],
        })(<Input />)}
      </FormItem>
      <FormItem colon={false} label="Answer">
        {getFieldDecorator('answer', {
          rules: [{ required: true }],
        })(<Input onBlur={onBlur('answerTokens', setAnswerLoading)} />)}
      </FormItem>
      <FormItem colon={false} label={<span>Answer Tokens {answerLoading && <Spin />}</span>}>
        {getFieldDecorator('answerTokens', {
          rules: [{ required: true }],
        })(<Input />)}
      </FormItem>
      {mode === 'create' && <FormItem style={{ textAlign: 'center' }}>
        <Button
          onClick={handleCreate}
          style={{ width: 100, height: 40 }}
          type="primary"
          loading={loading}
        >Add</Button>
      </FormItem>}
      {mode === 'edit' && <FormItem style={{ textAlign: 'center' }}>
        <Button
          onClick={handleEdit}
          style={{ width: 100, height: 40 }}
          type="primary"
          loading={loading}
        >Edit</Button>
      </FormItem>}
    </Form>
  )
}

DataForm.defaultProps = {
  mode: 'create',
  closeModal: () => {},
}

export default Form.create({
  mapPropsToFields: ({ data }) => ({
    id: Form.createFormField({ value: get(data, 'id', '') }),
    articleId: Form.createFormField({ value: get(data, 'articleId', '') }),
    article: Form.createFormField({ value: get(data, 'article', '')}),
    category: Form.createFormField({ value: get(data, 'category', 'Science')}),
    paragraph: Form.createFormField({ value: get(data, 'paragraph', '')}),
    paragraphTokens: Form.createFormField({ value: get(data, 'paragraphTokens', '')}),
    wh: Form.createFormField({ value: get(data, 'wh', 'Who')}),
    question: Form.createFormField({ value: get(data, 'question', '')}),
    questionTokens: Form.createFormField({ value: get(data, 'questionTokens', '')}),
    answer: Form.createFormField({ value: get(data, 'answer', '') }),
    answerTokens: Form.createFormField({ value: get(data, 'answerTokens', '') }),
  })
})(DataForm)
