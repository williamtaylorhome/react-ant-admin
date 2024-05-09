import React, { useEffect, useState } from "react";
import { Row, Col, Card, Progress } from "antd";
import { getVisitorList, getVisitorData } from "@/api";
import { Line as LineEchart } from "@/components/echarts";
import MyTable from "@/components/table";
import MyPagination from "@/components/pagination";
import "./index.less";

const getOpt = () => ({
  xAxis: {
    type: "category",
    boundaryGap: false,
    show: false,
  },
  yAxis: {
    show: false,
  },
  tooltip: {},
  grid: {
    height: "100%",
    left: "1%",
    right: "1%",
    bottom: "0%",
    top: "0%",
  },
  series: [
    {
      name: "visitor",
      type: "line",
      itemStyle: {
        color: "#975fe4",
      },
      lineStyle: {
        type: "solid",
      },
      data: [],
      smooth: true,
      symbol: "none", //Cancel vertex circle
      areaStyle: {
        color: "#975fe4",
      },
    },
  ],
});
const strokeColor = {
  "0%": "#108ee9",
  "100%": "#87d068",
};
function getPercentage(up, down) {
  if (!down) return 0;
  return Number(((up / down) * 100).toFixed(2));
}

const echartStyle = {
  height: 50,
};
const getTableTitle = () => {
  return (
    <Row justify="space-between" align="center" gutter={80}>
      <Col style={{ lineHeight: "32px" }}>statistics</Col>
    </Row>
  );
};
function useVistor() {
  const [tableCol, setCol] = useState([]);
  const [tableData, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [visitorOpt, setVisitor] = useState(getOpt());
  const [dealOpt, setDeal] = useState(getOpt());
  const [sumVisitor, setSumV] = useState(0);
  const [sumDeal, setSumD] = useState(0);
  const [pageInfo, setPage] = useState({ page: 1 });
  useEffect(() => {
    getVisitorData().then((res) => {
      const { status, data } = res;
      if (status === 0 && data) {
        const vOpt = { ...visitorOpt };
        const dOpt = { ...dealOpt };
        vOpt.xAxis.data = data.ips.map((i) => i.time);
        vOpt.series[0].data = data.ips.map((i) => i.value);
        dOpt.xAxis.data = data.deal.map((i) => i.time);
        dOpt.series[0].data = data.deal.map((i) => i.value);
        setDeal(dOpt);
        setVisitor(vOpt);
        setSumV(data.today.ips);
        setSumD(data.today.deal);
      }
    });
    // Eslint disable next line
  }, []);

  const getList = (data) => {
    setPage(data);
    getVisitorList(data).then((res) => {
      const { status, data } = res;
      if (status === 0 && data) {
        let list = data.list || [];
        setData(list);
        setCol(data.mapKey);
        setTotal(data.total);
      }
    });
  };
  return {
    visitorOpt,
    dealOpt,
    sumVisitor,
    sumDeal,
    tableData,
    tableCol,
    getList,
    total,
    pageInfo,
  };
}

export default function Vistor() {
  const {
    visitorOpt,
    dealOpt,
    sumVisitor,
    sumDeal,
    tableData,
    tableCol,
    getList,
    total,
    pageInfo,
  } = useVistor();
  return (
    <div className="vistor-container">
      <Row gutter={[20, 20]}>
        <Col span={6}>
          <Card className="cards">
            <p className="title">Views</p>
            <p className="num">
              {visitorOpt.series[0].data.reduce((a, c) => a + c, 0)}
            </p>
            <div className="echart">
              <LineEchart option={visitorOpt} style={echartStyle} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="cards">
            <p className="title">Processing times</p>
            <p className="num">
              {dealOpt.series[0].data.reduce((a, c) => a + c, 0)}
            </p>
            <div className="echart">
              <LineEchart option={dealOpt} style={echartStyle} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="cards">
            <p className="title">Visit today</p>
            <p className="num">{sumVisitor}</p>
            <div>
              <p>Account for all:</p>
              <Progress
                strokeColor={strokeColor}
                percent={getPercentage(
                  sumVisitor,
                  visitorOpt.series[0].data.reduce((a, c) => a + c, 0)
                )}
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="cards">
            <p className="title">Handled today</p>
            <p className="num">{sumDeal}</p>
            <div>
              <p>Account for all:</p>
              <Progress
                strokeColor={strokeColor}
                percent={getPercentage(
                  sumDeal,
                  dealOpt.series[0].data.reduce((a, c) => a + c, 0)
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <MyTable
        title={getTableTitle}
        dataSource={tableData}
        columns={tableCol}
        rowKey="s_id"
        saveKey="vistorTb"
        pagination={false}
      />
      <MyPagination
        page={pageInfo.page}
        change={getList}
        immediately={getList}
        total={total}
      />
    </div>
  );
}
Vistor.route = {
  path: "/statistics/visitor",
};
