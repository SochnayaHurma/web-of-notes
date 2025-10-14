import React from "react";
import { useParams } from "react-router-dom";
import { EuiPanel, EuiTitle, EuiSpacer,  } from "@elastic/eui";

import MarkdownView from "./MarkdownView.tsx";
import TagsView from "./TagsView.tsx";


interface LessonPageProps  {

};


function LessonPage (props: LessonPageProps) {
    const {lessonId} = useParams(); 
    return (
        <EuiPanel>
            <EuiTitle><h1>Урок номеер {lessonId}</h1></EuiTitle>
            <EuiSpacer/>
            <EuiTitle><h2>Тема такая-то</h2></EuiTitle>
            <EuiSpacer/>
            <TagsView/>
            <MarkdownView/>
        </EuiPanel>
    )
}

export default LessonPage;