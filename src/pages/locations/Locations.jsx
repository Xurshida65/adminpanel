import { useEffect } from "react";
import getData from "./components/getData";
import { Button, Table } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

function Locations() {
  const { datas, getApi } = getData();
  useEffect(() => {
    getApi();
  }, []);
  const col = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>


        <div className="flex gap-2">
          <Button danger >
            <DeleteFilled />
          </Button>
          <Button type="primary">
            <EditFilled />
          </Button>
        </div>
        </div>
      ),
    },
  ];
  console.log(datas);
  return (
    <>
      <Table dataSource={datas} columns={col} />
    </>
  );
}

export default Locations;
