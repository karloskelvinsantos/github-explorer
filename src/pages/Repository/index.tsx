import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../service/api';

import logoImg from '../../assets/logo.svg';
import loadingGif from '../../assets/loading.gif';

import { Header, RepositoryInfo, Issues, Loading } from './styles';

interface RepositoryParams {
  repository: string;
}

interface RepositoryDTO {
  full_name: string;
  description: string;
  owner: {
    avatar_url: string;
  };
  stargazers_count: number;
  forks: number;
  open_issues: number;
}

interface IssueDTO {
  id: string;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const [repository, setRepository] = useState<RepositoryDTO>();
  const [issues, setIssues] = useState<IssueDTO[]>([]);

  useEffect(() => {
    const repositories = localStorage.getItem('@GithubExplorer:repositories');

    if (repositories) {
      const repositoryStored = JSON.parse(repositories).find(
        (repo: RepositoryDTO) => {
          return repo.full_name === params.repository;
        },
      );

      if (repositoryStored) {
        setRepository(repositoryStored);
      } else {
        api.get(`/repos/${params.repository}`).then(response => {
          setRepository(response.data);
        });
      }
    }

    api.get<IssueDTO[]>(`/repos/${params.repository}/issues`).then(response => {
      const issuesResponse = response.data;
      setIssues(issuesResponse.slice(0, 10));
    });
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      <RepositoryInfo>
        <header>
          <img src={repository?.owner.avatar_url} alt="Profile" />
          <div>
            <strong>{repository?.full_name}</strong>
            <p>{repository?.description}</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>{repository?.stargazers_count}</strong>
            <span>stars</span>
          </li>
          <li>
            <strong>{repository?.forks}</strong>
            <span>forks</span>
          </li>
          <li>
            <strong>{repository?.open_issues}</strong>
            <span>issues abertas</span>
          </li>
        </ul>
      </RepositoryInfo>

      {issues.length !== 0 ? (
        <Issues>
          {issues.map(issue => (
            <a
              key={issue.id}
              href={issue.html_url}
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <strong>{issue.title}</strong>
                <p>{issue.user.login}</p>
              </div>
              <FiChevronRight size={20} />
            </a>
          ))}
        </Issues>
      ) : (
        <Loading>
          <img src={loadingGif} alt="loading" width="80px" height="80px" />
        </Loading>
      )}
    </>
  );
};

export default Repository;
