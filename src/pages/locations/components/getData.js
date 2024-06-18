import { useState } from "react";

export default () => {
  const [datas, setDatas] = useState([]);

  function getApi() {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/locations")
      .then((res) => res.json())
      .then((data) => setDatas(data.data));
  }
  return{
    datas ,
    getApi
  }
};
