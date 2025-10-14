import React, { useState, FC } from 'react';
import {
  EuiBadge,
  EuiFlexItem,
  EuiFlexGroup,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

const customBadges = [
  '#DDD',
  '#AAA',
  '#666',
  '#333',
  '#BADA55',
  '#FCF7BC',
  '#FEA27F',
  '#FFA500',
  '#0000FF',
];
type Tag = {
    id: number,
    title: string
};
interface TagsViewProps {
    tags: Tag[];
};

async function getLessonInfo(lessonId: number) {
    const response = await fetch("http://localhost:8000");
    if (!response.ok) {
        return
    }
    const json = response.json();
    return json;
}  

export default ({tags}: FC<TagsViewProps>)  => {
  const [isDisabled, setDisabled] = useState(false);

  return (
    <>
      <EuiTitle size="xs">
        <h3>Custom color examples</h3>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiFlexGroup
        wrap
        responsive={false}
        gutterSize="xs"
        style={{ maxWidth: '300px' }}
      >
        {customBadges.map((badge) => (
          <EuiFlexItem grow={false} key={badge}>
            <EuiBadge color={badge}>{badge}</EuiBadge>
          </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </>
  );
};