import React, { useState, Fragment } from 'react';
import { useLocation, NavLink  } from 'react-router-dom';
import {
  EuiText,
  EuiButton,
  EuiImage,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
  EuiPageTemplateProps,
  EuiLink,
  EuiButtonEmpty 
} from '@elastic/eui';

import sideNavSvg from '../logo.svg';
import contentSvg from '../logo.svg';

const panelled = undefined;
const restrictWidth = false;
const bottomBorder = "extended";

function calcBtnTextByLocation(location) {
}

export default (props) => {
const [showSidebar, setShowSidebar] = useState(false);
  const currentLocation = useLocation();
  const onClickLink = (e) => {
    console.log(e)
  }

  return (
    <EuiPageTemplate
      panelled={panelled}
      restrictWidth={restrictWidth}
      bottomBorder={bottomBorder}
      offset={0}
      grow={false}
    >
      {showSidebar && (<EuiPageTemplate.Sidebar>
        <EuiImage size={'fullWidth'} alt="Меню (в разработке)" url={sideNavSvg} />
      </EuiPageTemplate.Sidebar>)}
      <EuiPageTemplate.Header
        iconType="package"
        pageTitle="Список дел"
        rightSideItems={[
          <NavLink to="/">Домой</NavLink  >,
          <NavLink to="/create-lesson">Создать урок</NavLink  >,
          <NavLink to="/lessons">Список уроков</NavLink  >
        ]}
        tabs={[]}
        description="День прошел не зря"
      />
      <EuiPageTemplate.Section>
        {props.children}
        {/* <EuiImage size={'fullWidth'} alt="Fake paragraph" url={contentSvg} /> */}
      </EuiPageTemplate.Section>
      <EuiPageTemplate.BottomBar paddingSize="s">
        <EuiFlexGroup
          alignItems="center"
          justifyContent="spaceBetween"
          responsive={false}
        >
          {/* <EuiFlexItem grow={false}>
            <EuiText size="s">
              <p>Bottom text</p>
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              color="text"
              onClick={() => setShowSidebar(x => !x)}
              isSelected={showSidebar}
            >
              Toggle Sidebar
            </EuiButton>
          </EuiFlexItem> */}
        </EuiFlexGroup>
      </EuiPageTemplate.BottomBar>
    </EuiPageTemplate>
  );
};