import React from 'react'
import { Tabs, Progress } from 'antd'

import { whWords, categories } from "./shared";

const { TabPane } = Tabs

const ProgressTab = (props) => {
    const { values, numbers } = props
    return (
          <div style={{ padding: '20px 30px' }}>
            <div>
                {whWords[0]}: ({`${numbers[0]}`})
                <Progress percent={values[0]} status={'active'} format={percent => `${percent.toFixed(2)} %`} />
            </div>
            <div>
                {whWords[1]}: ({`${numbers[1]}`}) 
                <Progress percent={values[1]} status={'active'} format={percent => `${percent.toFixed(2)} %`} />
                </div>
            <div>
                {whWords[2]}: ({`${numbers[2]}`}) 
                <Progress percent={values[2]} status={'active'} format={percent => `${percent.toFixed(2)} %`} />
                </div>
            <div>
                {whWords[3]}: ({`${numbers[3]}`}) 
                <Progress percent={values[3]} status={'active'} format={percent => `${percent.toFixed(2)} %`} />
                </div>
            <div>
                {whWords[4]}: ({`${numbers[4]}`}) 
                <Progress percent={values[4]} status={'active'} format={percent => `${percent.toFixed(2)} %`} />
                </div>
          </div>
    )
}

const DataDistribution = (props) => {

    const {dataset} = props
    
    const whNum = dataset.reduce((acc, cur, i) => {
        if (!acc[cur.categoryId+1]) {
            acc[cur.categoryId+1] = [0, 0, 0, 0, 0]
        }
        acc[cur.categoryId+1][cur.whId] = acc[cur.categoryId+1][cur.whId] + 1
        return acc
    }, {})

    whNum[0] = Object.keys(whNum).reduce((acc, cur, i) => {
        for (let index = 0; index < 5; index++) {
            acc[index] = acc[index] + whNum[cur][index]
        }
        return acc
    }, [0, 0, 0, 0, 0])
    
    const progressTab = Object.keys(whNum).map((key, i) => {
        let values = whNum[key]
        const sumV = values.reduce((p, c, i) => {
            return p + c
        }, 0)
        values = values.map(v => v/sumV*100)
        let name = "No Name"
        if (key === '0') {
            name = 'All'
        } else {
            name = categories[key-1]
        }

        name = `${name} (${sumV})`
        
        return (
            <TabPane tab={<span>{name}</span>} key={i}>
                <ProgressTab values={values} numbers={whNum[key]} />
            </TabPane>
        )
    })
    return (
        <Tabs defaultActiveKey="0">
            {progressTab}
        </Tabs>
    )
}

export default DataDistribution