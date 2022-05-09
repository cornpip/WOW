import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';
import ArticleAPI from '../api/article';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { ChangeEvent, useState } from 'react';

const WriteContainer = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  fieldset {
    margin-bottom: 1rem;
  }
  margin-top: 8rem;
`;
const WriteTagList = styled.input``;
const WriteForm = styled.form`
  input,
  textarea {
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.25rem;
    background-color: #fff;
    width: 100%;
    padding: 0.5rem 0.75rem;
    line-height: 1.25;
  }
`;

const WriteInput = styled.input`
  background-color: ${props => props.theme.lightTextColor};
`;
const WriteTitle = tw(WriteInput)``;
const WriteDescription = tw(WriteInput)``;
const WriteBody = styled.textarea``;
const WriteBtn = styled.button`
  border-radius: 0.25rem;
  border: 1px solid black;
  color: #fff;
  background-color: #5cb85c;
  border-color: #5cb85c;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem;
  margin-top: 2rem;
`;
const TagList = styled('div')`
  display: flex;
  span {
    display: flex;
    margin: 1rem;
    button {
      margin-right: 0.5rem;
    }
  }
`;
interface IFormInputs {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

const schema = yup.object().shape({
  title: yup.string().required('필수항목입니다'),
  description: yup.string().required('필수 항목입니다.'),
  body: yup.string().required('필수 항목입니다'),
});

const WritePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const [tagList, setTagList] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const changeTagInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  };
  const handleAddTag = () => {
    if (!!tag) {
      const isExist = tagList.includes(tag.trim());
      if (!isExist) {
        const newTagList = tagList.concat(tag);
        setTagList(newTagList);
      }
      setTag('');
    }
  };
  const handleRemoveTag = (extag: string) => {
    const newTagList = tagList.filter(tag => tag !== extag);
    setTagList(newTagList);
  };
  const handleTagInputKeyDown = (e: any) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      if (e.key !== 'Tab') {
        e.preventDefault();
      }
      handleAddTag();
    }
  };
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const mutation = useMutation(
    'addArticle',
    async (body: IFormInputs) => {
      await ArticleAPI.create(body);
    },
    {
      onSuccess: async () => {
        navigate('/');
      },
      onError: (e: any) => {
        setServerError(e.response.data.message);
      },
    },
  );
  const onSubmit = async (data: any) => {
    mutation.mutate({ tagList, ...data });
  };

  return (
    <WriteContainer>
      <WriteForm onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <WriteTitle {...register('title')} type="text" placeholder="제목" />
          <p>{errors.title?.message}</p>
        </fieldset>
        <fieldset>
          <WriteDescription
            {...register('description')}
            type="text"
            placeholder="설명"
          />
          <p>{errors.description?.message}</p>
        </fieldset>
        <fieldset>
          <WriteBody {...register('body')} rows={8} placeholder="내용" />
          <p>{errors.body?.message}</p>
        </fieldset>
        <fieldset>
          <WriteTagList
            type="text"
            placeholder="Enter tags"
            value={tag}
            onChange={changeTagInput}
            onBlur={handleAddTag}
            onKeyDown={handleTagInputKeyDown}
          />
          <TagList>
            {tagList.map((tag, index) => (
              <span key={index}>
                <button onClick={() => handleRemoveTag(tag)}>X</button>
                {tag}
              </span>
            ))}
          </TagList>
        </fieldset>
        <fieldset>
          <p>{serverError}</p>
        </fieldset>
        <WriteBtn>글쓰기</WriteBtn>
      </WriteForm>
    </WriteContainer>
  );
};

export default WritePage;