import { useState, useEffect } from "react";
import { CopyrightCircleOutlined, GlobalOutlined, LoadingOutlined, HeartFilled } from "@ant-design/icons";
import { Layout, Image, Form, Select, InputNumber, Typography, Card, Modal, Tooltip, Button, List, Avatar, Result } from "antd";
import logo from "./icon128.png";

const App = () => {
  const { Header, Footer, Content } = Layout;
  const [form] = Form.useForm();
  const [countries, setCountries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [state, setState] = useState({ defaultFrom: "", defaultTo: "", currencies: [], amount: 0 });
  const { defaultFrom, defaultTo, currencies, amount } = state;

  const getCurrency = (country) => (country.currencies ? Object.keys(country.currencies)[0] : "--");

  const getCountry = (from) => {
    return countries.reduce((country, c) => {
      if (country) return country;
      if (c.cca2 === from) return c;
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
    fetch("https://restcountries.com/v3.1/all")
      .then((j) => j.json())
      .then((countries) => {
        setCountries(countries);

        const getDate = (timeStamp) => new Date(parseInt(timeStamp)).getDate();

        let { from, to, currencies, last_updated_at } = localStorage;

        if (!from) localStorage.from = from = "US";
        if (!to) localStorage.to = to = "IN";

        if (currencies && last_updated_at && getDate(last_updated_at) === getDate(new Date().getTime())) {
          setState((state) => ({ ...state, defaultFrom: from, defaultTo: to, currencies: JSON.parse(currencies) }));
        } else {
          getCurrencies("USD", (currencies) => {
            localStorage.currencies = JSON.stringify(currencies);
            localStorage.last_updated_at = currencies.time_last_update_unix * 1000;
            setState((state) => ({ ...state, defaultFrom: from, defaultTo: to, currencies }));
          });
        }
      });
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
          <strong className='ml-1 font-1_5'>Currency Converter</strong>
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
                <Select.Option key={c.cca2} value={c.cca2}>
                  <div className='d-flex align-center'>
                    <Image src={c.flags.svg} preview={false} className='flag' />{" "}
                    <span className='ml-2'>
                      {c.name.common} ({getCurrency(c)})
                    </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='To' name='to' rules={[{ required: true, message: "Please select the currency" }]}>
            <Select showSearch allowClear size='large' placeholder='Please select the currency'>
              {countries.map((c) => (
                <Select.Option key={c.cca2} value={c.cca2}>
                  <div className='d-flex align-center'>
                    <Image src={c.flags.svg} preview={false} className='flag' />{" "}
                    <span className='ml-2'>
                      {c.name.common} ({getCurrency(c)})
                    </span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <Card
          className='mb-2'
          style={{ border: "1px solid #5370fa" }}
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
          Made with <HeartFilled style={{ color: "#eb2f96" }} className='ml-1 mr-1' /> at Jaipur, Rajasthan (India){" "}
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
              <List.Item.Meta avatar={<Avatar src={item.flags.svg} />} title={`${item.name.common} (${getCurrency(item)})`} />
            </List.Item>
          )}
        />
      </Modal>
    </Layout>
  );
};

export default App;
