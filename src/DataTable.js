import React from 'react'
import { Table } from 'antd'
import { categories, whWords } from './shared'

const columns = [{
  title: 'Article ID',
  dataIndex: 'articleId',
  key: 'articleId',
}, {
  title: 'Article',
  dataIndex: 'article',
  key: 'article',
}, {
  title: 'Category',
  dataIndex: 'category',
  key: 'category',
  filters: categories.map((category) => ({ text: category, value: category })),
  onFilter: (value, record) => record.category.indexOf(value) === 0,
}, {
  title: 'Paragraph',
  dataIndex: 'paragraph',
  key: 'paragraph',
}, {
  title: 'WH Word',
  dataIndex: 'wh',
  key: 'wh',
  filters: whWords.map((whWord) => ({ text: whWord, value: whWord })),
  onFilter: (value, record) => record.wh.indexOf(value) === 0,
}, {
  title: 'Question',
  dataIndex: 'question',
  key: 'question',
}, {
  title: 'Answer',
  dataIndex: 'answer',
  key: 'answer',
}];

const DataTable = ({ dataSource, loading }) => {
  return (
    <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 8 }} loading={loading} />
  )
}

export default DataTable
