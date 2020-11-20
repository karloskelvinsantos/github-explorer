import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../service/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [erros, setErros] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const reposStored = localStorage.getItem('@GithubExplorer:repositories');

    if (reposStored) {
      return JSON.parse(reposStored);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleSubmitForm(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setErros('Preencha o campo de pesquisa');
      return;
    }

    try {
      const response = await api.get<Repository>(`/repos/${newRepo}`);

      const repository = response.data;

      if (repository) {
        setRepositories([...repositories, repository]);
        setNewRepo('');
        setErros('');
      }
    } catch (error) {
      setErros('Repositório não encontrado!');
    }
  }

  return (
    <>
      <img src={logoImg} alt="logo github explorer" />

      <Title>Explore repositórios no Github</Title>

      <Form hasError={Boolean(erros)} onSubmit={handleSubmitForm}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          type="text"
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {erros && <Error>{erros}</Error>}

      <Repositories>
        {repositories.map(repo => (
          <Link key={repo.full_name} to={`/repositories/${repo.full_name}`}>
            <img src={repo.owner.avatar_url} alt="repository" />
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
