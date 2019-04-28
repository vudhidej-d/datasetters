import React, { useState } from 'react'
import { Table, Button, Modal, notification } from 'antd'
import { categories, whWords } from './shared'
import DataForm from './DataForm'

const confirm = Modal.confirm

const DataTable = ({ dataSource, loading, db }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [data, setData] = useState({})

  const confirmDelete = (id) => () => {
    confirm({
      title: 'Do you want to delete these data?',
      onOk: async () => {
        try {
          await db.collection("dataset").doc(id).delete()
          notification['success']({
            message: 'Data deleted successfully.',
          });
        } catch (e) {
          console.error(e)
          notification['error']({
            message: 'Something went wrong, please try again.',
          });
        }
      },
      onCancel: () => {},
    })
  }
  
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
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, { id }) => <Button icon="delete" type="danger" onClick={confirmDelete(id)} />,
  }];

  return (
    <div>
      <Modal
        destroyOnClose
        centered
        bodyStyle={{ maxHeight: 650, overflowY: 'scroll' }}
        visible={modalVisible}
        footer={null}
        onCancel={() => { setModalVisible(false) }}
      >
        <DataForm db={db} mode="edit" data={data} closeModal={() => { setModalVisible(false) }} />
      </Modal>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 8 }}
        loading={loading}
        onRow={(record) => ({
          onDoubleClick: () => {
            setData(record)
            setModalVisible(true)
          }
        })}
      />
    </div>
  )
}

export default DataTable
