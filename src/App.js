import logo from "./icon128.png";
import { useState, useEffect } from "react";
import {
  SwapOutlined,
  CloseOutlined,
  DollarOutlined,
  GlobalOutlined,
  LoadingOutlined,
  CopyrightCircleOutlined,
} from "@ant-design/icons";
import { Layout, Image, Form, Select, InputNumber, Typography, Card, Modal, Tooltip, Button, List, Avatar, Result } from "antd";

const { Text, Link, Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function App() {
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

    if ((!from && !to && !amount) || amount) setState({ ...state, amount: amount || 0 });
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

  const toC = getCountry(defaultTo);
  const toCsymbol = getCurrency(toC);
  const fromC = getCountry(defaultFrom);

  return (
    <Layout className='bg-white'>
      <Header className='flex-item space-between'>
        <div className='flex-item gap-1'>
          <Image src={logo} preview={false} height={42} rootClassName='flex-item' />
          <Text strong className='font-1_5'>
            Currency Converter
          </Text>
        </div>
        <div className='flex-item'>
          <Tooltip title='Suported Currencies'>
            <Button type='text' icon={<GlobalOutlined />} onClick={() => setIsModalVisible(true)} />
          </Tooltip>
          <Tooltip title='Close'>
            <Button type='text' icon={<CloseOutlined />} onClick={() => window?.close()} />
          </Tooltip>
        </div>
      </Header>

      <Content className='p-8px bg-white'>
        <Card actions={[<Text className='fw-500 fs-12px'>Last Updated on: {currencies.time_last_update_utc.split(" 00")[0]}</Text>]}>
          <Form
            form={form}
            size='large'
            layout='vertical'
            requiredMark={false}
            onValuesChange={onValuesChange}
            initialValues={{ from: defaultFrom, to: defaultTo }}
          >
            <Form.Item label='Amount' name='amount' className='mb-2'>
              <InputNumber
                autoFocus
                className='w-100'
                placeholder='Enter the amount'
                prefix={<DollarOutlined className='fs-22px' />}
              />
            </Form.Item>

            <div className='flex-item gap-1 mb-2'>
              <Form.Item label='From' name='from' className='flex-1 m-0'>
                <Select
                  showSearch
                  allowClear
                  optionFilterProp='label'
                  placeholder='Select country...'
                  filterOption={(input, option) => {
                    const optionText = option?.children?.props?.children[1]?.props?.children?.join("");
                    return (optionText ?? "").toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {countries.map(({ cca2, flags, name, ...c }) => (
                    <Select.Option key={cca2} value={cca2}>
                      <div className='flex-item gap-1'>
                        {(flags?.svg || flags?.png) && (
                          <Image src={flags?.svg || flags?.png} preview={false} className='flag' width={24} />
                        )}
                        <Text style={{ width: "calc(100%  - 24px - 0.5rem)" }} ellipsis={{ tooltip: true }}>
                          {name?.common} ({getCurrency(c)})
                        </Text>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <SwapOutlined style={{ fontSize: 18, paddingTop: 30 }} />
              <Form.Item label='To' name='to' className='flex-1 m-0'>
                <Select
                  showSearch
                  allowClear
                  optionFilterProp='label'
                  placeholder='Select country...'
                  filterOption={(input, option) => {
                    const optionText = option?.children?.props?.children[1]?.props?.children?.join("");
                    return (optionText ?? "").toLowerCase().includes(input.toLowerCase());
                  }}
                >
                  {countries.map(({ cca2, flags, name, ...c }) => (
                    <Select.Option key={cca2} value={cca2}>
                      <div className='flex-item gap-1'>
                        {(flags?.svg || flags?.png) && (
                          <Image src={flags?.svg || flags?.png} preview={false} className='flag' width={24} />
                        )}
                        <Text style={{ width: "calc(100%  - 24px - 0.5rem)" }} ellipsis={{ tooltip: true }}>
                          {name?.common} ({getCurrency(c)})
                        </Text>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <Text strong className='m-0'>
              Exchange rate: 1 {getCurrency(fromC)} = {Number(currencies?.conversion_rates[toCsymbol]?.toFixed(2))} {toCsymbol}
            </Text>

            <Title level={2} type='success' className='mt-2 m-0'>
              Result: {Number((amount >= 0 ? amount * currencies.conversion_rates[toCsymbol] : 0)?.toFixed(2))} {toCsymbol}
            </Title>
          </Form>
        </Card>
      </Content>

      <Footer className='flex-item gap-1 fw-500 space-between'>
        <div className='flex-item gap-1'>
          <CopyrightCircleOutlined /> {new Date().getFullYear()} Designed & Developed by
          <Link href='https://www.tcmhack.in' target='_blank'>
            TCMHACK
          </Link>
        </div>

        <Link target='_blank' href={`https://chromewebstore.google.com/detail/${window?.chrome?.runtime?.id}/support`}>
          Support
        </Link>
      </Footer>

      <Modal
        centered
        width='100%'
        open={isModalVisible}
        title='All Supported Currencies'
        styles={{ content: { padding: 0 } }}
        onCancel={() => setIsModalVisible(false)}
        footer={<Text className='fw-500'>We support nearly all commonly used world currencies.</Text>}
      >
        <List
          size='small'
          itemLayout='horizontal'
          dataSource={countries}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar size='small' src={item.flags.svg} />}
                title={`${item.name.common} (${getCurrency(item)})`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Layout>
  );
}
