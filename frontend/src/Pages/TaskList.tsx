import { JSX, useState } from "react";

import { 
    EuiTabbedContent,
    EuiTabbedContentTab,
    EuiTabbedContentProps,
    EuiSpacer,
 } from "@elastic/eui";
import TaskTable from "../Components/TaskTable.tsx";

interface TaskTab {
    id: number,
    title: string,
    content?: JSX.Element
}
const tabs: EuiTabbedContentProps['tabs'] = [
    {
      id: "1",
      name: 'Все',
      content: (
        <>
            <EuiSpacer/>
            <TaskTable key={"1"} status={"Все"}/>
        </>
      )
    },
    {
      id: "2",
      name: 'Назначенные',
      content: (
        <>
            <EuiSpacer/>
            <TaskTable key={"2"} status={"Назначенные"}/>
        </>
      )
    },
    {
      id: "3",
      name: 'Завершенные',
      content: (
        <>
            <EuiSpacer/>
            <TaskTable key={"3"} status={"Завершенные"}/>
        </>
      )
    },
  ];

export default function() {

const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const onTabClick = (selectedTab: EuiTabbedContentTab) => {
    setSelectedTab(selectedTab);
    return selectedTab
  };
  return (
    <>
    <EuiTabbedContent 
        tabs={tabs} 
        initialSelectedTab={selectedTab}
        selectedTab={selectedTab} 
        onTabClick={onTabClick}/>
    </>
  )
}
