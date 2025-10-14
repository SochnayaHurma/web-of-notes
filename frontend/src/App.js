import TaskTable from './Components/TaskTable.tsx';
import {EuiProvider, EuiText, EuiI18n, useEuiI18n,
  EuiI18nConsumer,
  EuiContext
} from '@elastic/eui';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import './App.css';
import Layout from './Components/Layout';
import LessonPage from './Components/LessonPage.tsx';
import TaskList from './Pages/TaskList.tsx';
import FormCreateLesson from './Pages/CreateNote.tsx';
import Toast from './Components/Toast.tsx';
import CallbackProvider from './Components/ContextProvider.tsx';


const euiI18n = {
  mapping: {
    'euiMarkdownEditorToolbar.editor': 'Редактор',
    'euiMarkdownEditorToolbar.previewMarkdown': 'Предпросмотр',
    'euiForm.addressFormErrors': 'Пожалуйста устраните следующие ошибки перед следующей попыткой.',
  },
};

function App() {
  return (
      <BrowserRouter>
          <EuiProvider>
            <EuiContext i18n={euiI18n}>
              <CallbackProvider>
                <Layout showSidebar={false}>
                  <Routes>
                    <Route path="/"/>
                    <Route path="/create-lesson" element={<FormCreateLesson/>}/>
                    <Route path="/lessons" element={<TaskList/>}/>
                    <Route path="/lesson/:lessonId" element={<LessonPage/>}/>
                  </Routes>
                </Layout>
              </CallbackProvider>
              <Toast/>
            </EuiContext>
          </EuiProvider>
      </BrowserRouter>
      )
}

export default App;
