import React, { FormEvent, useState, useEffect } from 'react';
import {
  EuiButton,
  EuiCheckboxGroup,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiFilePicker,
  EuiLink,
  EuiRange,
  EuiSelect,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  useGeneratedHtmlId,
} from '@elastic/eui';
import { useNavigate } from 'react-router-dom';

import TextAreaEditor from '../Components/Form/TextAreaEditor.tsx';
import BadgetCombobox from '../Components/Form/BadgetCombobox.jsx';
import Combobox, { Option as SubjectOption } from '../Components/Form/Combobox.tsx';
import { addToast } from '../Components/Toast.tsx';

interface NoteBodyForPost {
  content: string;
  title: string;
  subject_id: number | string;
  tag_ids: string[];
}

interface FormState {
  subject: string;
  title: string;
  tags: string[];
  content: string;
}

interface TagState {
  label: string;
  value: { size: number };
  id: string;
  color: string;
}

interface SubjectResponse {
  id: number;
  title: string;
}

interface TagResponse {
  id: number;
  name: string;
}

interface CreateNoteResponse {
  errors: string[];
  data: any;
}

async function getAllTags(): Promise<TagResponse[]> {
  const response = await fetch('http://localhost:8000/api/v1/tags/')
  return await response.json()
}


async function getAllSubjects(): Promise<SubjectResponse[]> {
  const response = await fetch('http://localhost:8000/api/v1/subjects/');
  return await response.json();
}

async function fetchPostNote(form: NoteBodyForPost): Promise<CreateNoteResponse> {
  const response = await fetch('http://localhost:8000/api/v1/notes/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form)
  })
  console.log(response);
  const data = await response.json();
  console.log(data);
  if (response.status == 201) {
    return { data, errors: [] };
  }
  return { data: null, errors: data.errors }
}


export default () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    subject: '',
    title: '',
    tags: [],
    content: '',
  });
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState<bool>(false);
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);

  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tags, setTags] = useState<TagResponse[]>([]);

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  function onChangeSingleField(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  function onChangeMultipleValuesField(newState: TagState[]) {
    setForm({ ...form, tags: newState.map(el => el.id) })
  }

  function onChangeContentValue(newValue: string) {
    setForm({ ...form, 'content': newValue })
  }

  async function onSubmit(e: FormEvent<HTMLElement>) {
    setLoadingForm(true);
    e.preventDefault();
    addToast({ title: 'Успешно', color: 'success', text: 'Запись успешно создана' });

    const srvData = await fetchPostNote({
      content: form.content,
      title: form.title,
      subject_id: form.subject,
      tag_ids: form.tags
    });
    if (srvData.errors.length) {
      setShowErrors(true);
      setLoadingForm(false);
      setFormErrors(srvData.errors);
    } else {
      setShowErrors(false);
      setFormErrors([]);
      setLoadingForm(false);
      navigate("/lessons");
      return
    }

  }
  useEffect(() => {
    const fetchPageData = async () => {
      const srvTags = await getAllTags();
      if (srvTags) {
        setTags(srvTags);
      }


      const srvSubjects = await getAllSubjects();
      if (srvSubjects) {
        const preparedSubjects = srvSubjects.map(el => ({
          value: el.id,
          text: el.title
        }))
        setSubjects(preparedSubjects);
      }

    }
    fetchPageData();
  }, [])
  const formRowCheckboxItemId__1 = useGeneratedHtmlId({
    prefix: 'formRowCheckboxItem',
    suffix: 'first',
  });
  const formRowCheckboxItemId__2 = useGeneratedHtmlId({
    prefix: 'formRowCheckboxItem',
    suffix: 'second',
  });
  const formRowCheckboxItemId__3 = useGeneratedHtmlId({
    prefix: 'formRowCheckboxItem',
    suffix: 'third',
  });

  const formRowRangeId = useGeneratedHtmlId({ prefix: 'formRowRange' });
  const checkboxes = [
    {
      id: formRowCheckboxItemId__1,
      label: 'Option one',
    },
    {
      id: formRowCheckboxItemId__2,
      label: 'Option two is checked by default',
    },
    {
      id: formRowCheckboxItemId__3,
      label: 'Option three',
    },
  ];
  const [checkboxIdToSelectedMap, setCheckboxIdToSelectedMap] = useState({
    [formRowCheckboxItemId__2]: true,
  });

  const onSwitchChange = () => {
    setIsSwitchChecked(!isSwitchChecked);
  };

  const onCheckboxChange = (optionId: any) => {
    const newCheckboxIdToSelectedMap = {
      ...checkboxIdToSelectedMap,
      ...{
        [optionId]: !checkboxIdToSelectedMap[optionId],
      },
    };

    setCheckboxIdToSelectedMap(newCheckboxIdToSelectedMap);
  };

  return (
    <EuiForm fullWidth={true} component="form" onSubmit={onSubmit} error={formErrors} isInvalid={showErrors}>
      <EuiFormRow label="Занятие" helpText="Как бы ты хотел(а) назвать направление в котором хочешь двигатья?">
        <Combobox options={subjects} onChange={onChangeSingleField} name="subject" defaultValue={form.subject} />
      </EuiFormRow>
      <EuiSpacer />
      <EuiFormRow label="Тема" helpText="Чем займемся сегодня?">
        <EuiFieldText name="title" onChange={onChangeSingleField} />
      </EuiFormRow>
      <EuiSpacer />
      <EuiFormRow label="Тэги">
        <BadgetCombobox initialOptions={tags} onChangeFn={onChangeMultipleValuesField} />
      </EuiFormRow>
      <EuiSpacer />
      <EuiFormRow>
        <TextAreaEditor stateSaver={onChangeContentValue} />
      </EuiFormRow>
      <EuiButton type="submit" isLoading={loadingForm} fill >
        Создать
      </EuiButton>
    </EuiForm>
  );
};