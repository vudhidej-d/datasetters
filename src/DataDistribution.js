import React from 'react'
import { Tabs, Progress } from 'antd'

import { whWords, categories } from "./shared";

const { TabPane } = Tabs

const ProgressTab = (props) => {
    const { values } = props
    return (
          <div style={{ padding: '20px 30px' }}>
            <div>{whWords[0]}: <Progress percent={values[0]} /></div>
            <div>{whWords[1]}: <Progress percent={values[1]} /></div>
            <div>{whWords[2]}: <Progress percent={values[2]} /></div>
            <div>{whWords[3]}: <Progress percent={values[3]} /></div>
            <div>{whWords[4]}: <Progress percent={values[4]} /></div>
          </div>
    )
}

const DataDistribution = (props) => {

    const {dataset} = props

    const whNum = dataset.reduce((acc, cur, i) => {
        if (!acc[cur.categoryId]) {
            acc[cur.categoryId] = [0, 0, 0, 0, 0]
        }
        acc[cur.categoryId][cur.whId] = acc[cur.categoryId][cur.whId] + 1
        console.log(i+": "+acc+ "_" + cur.whId)
        return acc
    }, {})

    whNum['all'] = Object.keys(whNum).reduce((acc, cur, i) => {
        for (let index = 0; index < 5; index++) {
            acc[index] = acc[index] + whNum[cur][index]
        }
        return acc
    }, [0, 0, 0, 0, 0])
    console.log(whNum)
    const progressTab = Object.keys(whNum).map((key, i) => {
        let values = whNum[key]
        const sumV = values.reduce((p, c, i) => {
            return p + c
        }, 0)
        values = values.map(v => v/sumV*100)
        let name = key
        if (key !== 'all') {
            name = categories[key]
        }
        return (
            <TabPane tab={<span>{name}</span>} key={i}>
                <ProgressTab values={values} />
            </TabPane>
        )
    })
    return (
        <Tabs defaultActiveKey="1">
            {progressTab}
        </Tabs>
    )
}

export default DataDistribution