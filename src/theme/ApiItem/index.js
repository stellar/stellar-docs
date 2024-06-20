import React from 'react';
import ApiItem from '@theme-original/ApiItem';
import DocItem from '@theme-original/DocItem';

export default function ApiItemWrapper(props) {
  if (
    props.location?.pathname?.includes('api-reference')
  ) {
    return (
      <>
        <ApiItem {...props} />
      </>
    );
  }
  return (
    <>
      <DocItem {...props} />
    </>
  );
}
