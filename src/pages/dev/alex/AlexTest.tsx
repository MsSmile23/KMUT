/* eslint-disable */
import { FC, useEffect, useLayoutEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'

import { Button, Typography } from 'antd'
// import { FaBeer } from "@react-icons/all-files/fa/FaBeer";


import { ECPage422 } from '@shared/ui/ECUIKit/errors/ECPage422/ECPage422'
import { useLayoutSettingsStore } from '@shared/stores/settingsLayout'
import { ECPage418 } from '@shared/ui/ECUIKit/errors/ECPage418/ECPage418'
import WebAppAttribute from '@entities/attributes/WebAppAttribute/WebAppAttribute'
import { getMediaFilesById } from '@shared/api/MediaFiles/Models/getMediaFilesById/getMediaFilesById'

import React, {  useMemo } from 'react';
import { Select, Spin } from 'antd';
import VirtualList from 'rc-virtual-list';
const { Option } = Select;
const { Text } = Typography

const AlexTest: FC = () => {
    const options = Array.from({ length: 60000 }, (_, i) => ({
        id: i + 1,
        name: `Object ${i + 1}`,
        surname: 'лох'
      }));
    const [value, setValue] = useState(
        `[{"wam_request_url":"Google","wam_allowed_http_codes":"","wam_processing_rules":null,"wam_request_method":"HEAD","wam_request_body_type":null,"wam_request_body":null,"wam_request_timeout":"","wam_request_follow_redirects":null,"wam_request_ssl_verifyhost":null,"wam_request_ssl_cert":null,"wam_request_ssl_cacert":null,"wam_request_ssl_key":null,"wam_request_ssl_key_pass":null,"wam_request_auth_method":null,"wam_request_auth_user":"","wam_request_auth_password":null,"wam_request_proxy":"","wam_request_proxy_ssl_verifyhost":null,"wam_request_proxy_ssl_cert":null,"wam_request_proxy_ssl_cacert":null,"wam_request_proxy_ssl_key":null,"wam_request_proxy_ssl_key_pass":null,"wam_request_proxy_auth_method":null,"wam_request_proxy_auth_user":"","wam_request_proxy_auth_password":null}]`)
        const { setFullScreen, fullScreen } = useLayoutSettingsStore()

        useEffect(() => {
       
                setFullScreen(true)
            
        }, [])
   

        const [searchValue, setSearchValue] = useState('');
        const [loading, setLoading] = useState(false);
      
        const filteredOptions = useMemo(() => {
          if (!searchValue) return options;
          return options.filter(option =>
            option.name.toLowerCase().includes(searchValue.toLowerCase())
          );
        }, [searchValue, options]);
      
        const handleSearch = value => {
          setLoading(true);
          setSearchValue(value);
          setLoading(false);
        };
      
        const renderOption = (item, index, props) => {
          return (
            <Option key={item.id} value={item.id} style={props.style}>
              {item.name}
            </Option>
          );
        };
      
        return (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Выберите значение"
            onSearch={handleSearch}
            filterOption={false}
            notFoundContent={loading ? <Spin size="small" /> : null}
            dropdownRender={menu => (
              <div>
                <VirtualList
                  data={filteredOptions}
                  height={1}
                  itemHeight={35}
                  itemKey="id"
                >
                  {renderOption}
                </VirtualList>
                {menu}
              </div>
            )}
          >
            {filteredOptions.map(option => (
              <Option key={option.id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
        );
      };

export default AlexTest
