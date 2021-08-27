import { useState, useEffect } from "react";
import { Layout, Image, Form, Select, InputNumber, Typography, Card, Modal, Tooltip, Button, List, Avatar, Result } from "antd";
import Icon, { CopyrightCircleOutlined, GlobalOutlined, LoadingOutlined } from "@ant-design/icons";

import countries from "./countries.json";
import logo from "./icon128.png";

const App = () => {
  const { Header, Footer, Content } = Layout;
  const [form] = Form.useForm();
  const HeartSvg = () => (
    <svg width='1em' height='1em' fill='currentColor' viewBox='0 0 1024 1024'>
      <path d='M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z' />
    </svg>
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [state, setState] = useState({ defaultFrom: "", defaultTo: "", currencies: [], amount: 0 });
  const { defaultFrom, defaultTo, currencies, amount } = state;

  const getCurrency = (country) => country.currencies[0].code;

  const getCountry = (from) => {
    return countries.reduce((country, c) => {
      if (country) return country;
      if (c.alpha2Code === from) return c;
      return country;
    }, null);
  };

  const onValuesChange = ({ from, to, amount }) => {
    if (from) {
      localStorage.from = from;

      const country = getCountry(from);
      getCurrencies(getCurrency(country), (currencies) => {
        localStorage.currencies = JSON.stringify(currencies);
        localStorage.last_updated_at = currencies.time_last_update_unix * 1000;
        setState({ ...state, defaultFrom: from, currencies });
      });
    }

    if (to) {
      localStorage.to = to;
      setState({ ...state, defaultTo: to });
    }
    if (amount) setState({ ...state, amount });
  };

  const getCurrencies = (base, callback = function () {}) => {
    fetch(`https://v6.exchangerate-api.com/v6/945779b31097a0b6d8d613e2/latest/${base}`)
      .then((r) => r.json())
      .then(callback);
  };

  useEffect(() => {
    const getDate = (timeStamp) => new Date(parseInt(timeStamp)).getDate();

    let { from, to, currencies, last_updated_at } = localStorage;

    if (!from) localStorage.from = from = "US";
    if (!to) localStorage.to = to = "IN";

    if (currencies && last_updated_at && getDate(last_updated_at) === getDate(new Date().getTime())) {
      setState({ ...state, defaultFrom: from, defaultTo: to, currencies: JSON.parse(currencies) });
    } else {
      getCurrencies("USD", (currencies) => {
        localStorage.currencies = JSON.stringify(currencies);
        localStorage.last_updated_at = currencies.time_last_update_unix * 1000;
        setState({ ...state, defaultFrom: from, defaultTo: to, currencies });
      });
    }
  }, [defaultFrom, defaultTo]);

  if (!defaultTo || !defaultFrom || currencies.length === 0) {
    return <Result status='404' title={<LoadingOutlined />} subTitle='Please wait...' />;
  }

  const fromC = getCountry(defaultFrom);
  const toC = getCountry(defaultTo);
  const toCsymbol = getCurrency(toC);

  return (
    <Layout>
      <Header className='flex-item'>
        <div className='flex-item'>
          <Image src={logo} preview={false} />
          <strong className='ml-1 font-1_5 italic'>Currency Converter</strong>
        </div>
        <Tooltip title='Suported Currencies'>
          <Button type='primary' shape='circle' icon={<GlobalOutlined />} onClick={() => setIsModalVisible(true)} />
        </Tooltip>
      </Header>

      <Content className='p-1'>
        <Form form={form} layout='vertical' onValuesChange={onValuesChange} initialValues={{ from: defaultFrom, to: defaultTo }}>
          <Form.Item label='Amount' name='amount' rules={[{ required: true, message: "Please enter the amount" }]}>
            <InputNumber placeholder='Enter the amount' className='w-100' size='large' autoFocus />
          </Form.Item>
          <Form.Item label='From' name='from' rules={[{ required: true, message: "Please select the currency" }]}>
            <Select showSearch allowClear size='large' placeholder='Please select the currency'>
              {countries.map((c) => (
                <Select.Option key={c.alpha2Code} value={c.alpha2Code}>
                  <div className='d-flex align-center'>
                    <Image src={c.flag} preview={false} className='flag' />{" "}
                    <span className='ml-2'>
                      {c.name} ({c.currencies[0].code})
                    </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='To' name='to' rules={[{ required: true, message: "Please select the currency" }]}>
            <Select showSearch allowClear size='large' placeholder='Please select the currency'>
              {countries.map((c) => (
                <Select.Option key={c.alpha2Code} value={c.alpha2Code}>
                  <div className='d-flex align-center'>
                    <Image src={c.flag} preview={false} className='flag' />{" "}
                    <span className='ml-2'>
                      {c.name} ({c.currencies[0].code})
                    </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <Card
          className='mb-2'
          style={{ border: "1px solid #2196f3" }}
          actions={[<strong>Last Updated on: {currencies.time_last_update_utc.split(" 00")[0]}</strong>]}
          title={`Conversion Rate: 1${getCurrency(fromC)} = ${currencies.conversion_rates[toCsymbol]} ${toCsymbol}`}
        >
          <Typography.Text strong>
            Converted Amount: {amount ? amount * currencies.conversion_rates[toCsymbol] : 0} {toCsymbol}
          </Typography.Text>
        </Card>

        <Typography.Text type='danger' italic>
          Note: It will keep converting the amount as you Type.
        </Typography.Text>
      </Content>

      <Footer className='flex-item'>
        <span className='flex-item'>
          <CopyrightCircleOutlined />{" "}
          <a href='https://www.tcmhack.in' className='text-white ml-1 mr-1' target='_blank' rel='noopener noreferrer'>
            WWW.TCMHACK.IN
          </a>
        </span>
        <span className='flex-item'>
          Made with <Icon component={HeartSvg} style={{ color: "#eb2f96" }} className='ml-1 mr-1' /> at Jaipur, Rajasthan (India){" "}
        </span>
      </Footer>

      <Modal title='All Supported Currencies' visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        <Typography.Text>We support almost all the commonly circulating world currencies listed below.</Typography.Text>
        <List
          size='small'
          itemLayout='horizontal'
          dataSource={countries}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta avatar={<Avatar src={item.flag} />} title={`${item.name} (${item.currencies[0].code})`} />
            </List.Item>
          )}
        />
      </Modal>
    </Layout>
  );
};

export default App;
