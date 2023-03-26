/*

import UploadPlus from '@/components/UploadPlus';
import type { UploadOptions } from '@/components/UploadPlus';

<UploadPlus options={uploadOptions}>上传</UploadPlus>

const uploadOptions = useMemo<UploadOptions>(() => {
  return {
    action: config.domain + '',
    headers: {},
    data: {},
    beforeUpload(file) {},
    onSuccess(resData) {},
    onFail(err) {},
  };
}, []);

*/

import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import type { FC, ReactNode } from 'react';

import type { UploadProps } from 'antd';
import { message, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export type UploadOptions<T = any> = UploadProps & {
  onChange?: (info: any) => void;
  onSuccess?: (data: T) => void;
  onFail?: (err: any) => void;
};

const Comp: FC<{
  children: ReactNode | ReactNode[];
  options: UploadOptions;
}> = memo((props) => {
  const { children, options } = props;
  const { onChange, onSuccess, onFail, ...fieldProps } = options;

  const _onChange = useCallback(
    (info) => {
      onChange?.(info);

      const { file } = info;
      const { name, status, response: res } = file;
      if (status !== 'done') return;

      if (res.code === 0 || res.code === 200) {
        message.success(`上传 ${name} 成功`);
        onSuccess?.(res.data);
      } else {
        message.error(res.msg || res.message || `上传 ${name} 失败`);
        onFail?.(res);
      }
    },
    [onChange, onSuccess, onFail],
  );

  return (
    <Upload listType="text" maxCount={1} onChange={_onChange} {...fieldProps}>
      <Button icon={<UploadOutlined />}>{children}</Button>
    </Upload>
  );
});

export default Comp;
