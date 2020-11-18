import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../service/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
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

    const response = await api.get<Repository>(`/repos/${newRepo}`);

    const repository = response.data;

    if (repository) {
      setRepositories([...repositories, repository]);
      setNewRepo('');
    }
  }

  return (
    <>
      <img src={logoImg} alt="logo github explorer" />

      <Title>Explore repositórios no Github</Title>

      <Form onSubmit={handleSubmitForm}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          type="text"
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      <Repositories>
        {repositories.map(repo => (
          <a key={repo.full_name} href="teste">
            <img src={repo.owner.avatar_url} alt="repository" />
            <div>
              <strong>{repo.full_name}</strong>
              <p>{repo.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
