import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception500 = (props) => {
  if (props.location.query.url) {
    window.history.replaceState({}, null, props.location.query.url);
  }
  return (
    <Exception
      type="500"
      desc={formatMessage({ id: 'app.exception.description.500' })}
      linkElement={Link}
      backText={formatMessage({ id: 'app.exception.back' })}
    />
  )
};

export default Exception500;
